import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../data/store.js';
import { config } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.js';

export const register = (req: AuthRequest, res: Response): void => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({
        success: false,
        message: 'Please provide email, password, first name, and last name.',
      });
      return;
    }

    if (!email.includes('@')) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
      return;
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'An atelier account with this email already exists. Please sign in.',
      });
      return;
    }

    const newUser = db.createUser({
      email,
      password,
      firstName,
      lastName,
      phone,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to VELORA.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`.trim(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        role: newUser.role,
        tier: newUser.tier,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const login = (req: AuthRequest, res: Response): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
      return;
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'No atelier account found with this email address.',
      });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.',
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        tier: user.tier,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getMe = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = db.findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const addresses = db.getUserAddresses(user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        tier: user.tier,
        addresses,
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateProfile = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { firstName, lastName, phone } = req.body;
    const updated = db.updateUserProfile(req.user.id, { firstName, lastName, phone });

    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Client profile updated successfully.',
      user: {
        id: updated.id,
        email: updated.email,
        name: `${updated.firstName} ${updated.lastName}`.trim(),
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone,
        role: updated.role,
        tier: updated.tier,
      },
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
