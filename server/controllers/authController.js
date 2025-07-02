import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isDatabaseConnected } from '../config/database.js';
import { JWT_SECRET } from '../middleware/auth.js';

// In-memory storage fallback
let users = [];

export const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    let user;
    if (isDatabaseConnected()) {
      user = await User.findOne({ username });
      if (!user) {
        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, password: hashedPassword, role });
        await user.save();
      } else {
        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
      }
    } else {
      // In-memory fallback
      user = users.find(u => u.username === username);
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = {
          id: Date.now().toString(),
          username,
          password: hashedPassword,
          role,
          createdAt: new Date()
        };
        users.push(user);
      } else {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
      }
    }

    const token = jwt.sign(
      { id: user._id || user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};