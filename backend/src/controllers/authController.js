const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Agent = require('../models/agentModel');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, agency_name, license_number, bio } = req.body;
    
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userId = await User.create({ name, email, password_hash, role, phone });

    if (role === 'agent') {
      await Agent.create(userId, { agency_name, license_number, bio });
    }

    const token = jwt.sign(
      { user_id: userId, role: role || 'buyer', email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({ success: true, message: 'User registered successfully', data: { token } });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      data: { token, user: { user_id: user.user_id, name: user.name, email: user.email, role: user.role } } 
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const { password_hash, ...profile } = user;
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};
