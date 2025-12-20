const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const supabase = require('./config/supabase');

const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:3000', 'https://bs-ji-007.github.io'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts, please try again later.'
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: 'Too many OTP requests, please try again later.'
});

// Input validation
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim();
};

// Email transporter (FIXED: createTransport not createTransporter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, type = 'verification') => {
  const subject = type === 'login'
    ? 'Your Login OTP for Khopadi Movies'
    : 'Your Registration OTP for Khopadi Movies';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">Khopadi Movies - OTP Verification</h2>
        <p>Your OTP for ${type} is:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #dc2626; border-radius: 8px; margin: 20px 0; letter-spacing: 8px;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes.</p>
        <p style="color: #6b7280; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px;">This is an automated email, please do not reply.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
};

// Cleanup expired OTPs
const cleanupExpiredOTPs = async () => {
  try {
    await supabase.rpc('cleanup_expired_otps');
  } catch (error) {
    console.error('OTP cleanup error:', error);
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);

// Register endpoint
app.post('/api/register', authLimiter, otpLimiter, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedName = sanitizeInput(name);

    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(sanitizedEmail);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Hash password for storage in OTP table
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store OTP with user data
    const { error: otpError } = await supabase
      .from('otp_verifications')
      .insert({
        email: sanitizedEmail,
        otp_code: otp,
        otp_type: 'register',
        user_data: {
          email: sanitizedEmail,
          password: hashedPassword,
          name: sanitizedName
        },
        expires_at: expiresAt.toISOString()
      });

    if (otpError) {
      console.error('OTP storage error:', otpError);
      return res.status(500).json({ message: 'Failed to process registration' });
    }

    await sendOTPEmail(sanitizedEmail, otp, 'registration');
    res.json({ message: 'OTP sent to your email for registration' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify registration OTP
app.post('/api/verify-register', authLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    // Get OTP record
    const { data: otpRecords, error: otpError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', sanitizedEmail)
      .eq('otp_code', otp)
      .eq('otp_type', 'register')
      .eq('verified', false)
      .gte('expires_at', new Date().toISOString())
      .limit(1);

    if (otpError || !otpRecords || otpRecords.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const otpRecord = otpRecords[0];

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: otpRecord.user_data.email,
      password: Math.random().toString(36).slice(-12),
      email_confirm: true,
      user_metadata: {
        name: otpRecord.user_data.name
      }
    });

    if (authError) {
      console.error('User creation error:', authError);
      return res.status(500).json({ message: 'Failed to create user' });
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: otpRecord.user_data.email,
        name: otpRecord.user_data.name
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    // Mark OTP as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', otpRecord.id);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: authData.user.id,
        email: authData.user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Registration successful',
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: otpRecord.user_data.name
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request OTP for login
app.post('/api/request-otp', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    // Check if user exists
    const { data: user } = await supabase.auth.admin.getUserByEmail(sanitizedEmail);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store OTP
    const { error: otpError } = await supabase
      .from('otp_verifications')
      .insert({
        email: sanitizedEmail,
        otp_code: otp,
        otp_type: 'login',
        expires_at: expiresAt.toISOString()
      });

    if (otpError) {
      console.error('OTP storage error:', otpError);
      return res.status(500).json({ message: 'Failed to send OTP' });
    }

    await sendOTPEmail(sanitizedEmail, otp, 'login');
    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('OTP request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', authLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    // Verify OTP
    const { data: otpRecords, error: otpError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', sanitizedEmail)
      .eq('otp_code', otp)
      .eq('otp_type', 'login')
      .eq('verified', false)
      .gte('expires_at', new Date().toISOString())
      .limit(1);

    if (otpError || !otpRecords || otpRecords.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Get user
    const { data: user } = await supabase.auth.admin.getUserByEmail(sanitizedEmail);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();

    // Mark OTP as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', otpRecords[0].id);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user.id,
        email: user.user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.user.id,
        email: user.user.email,
        name: profile?.name || 'User'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Protected profile route
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});