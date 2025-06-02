const db = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get model references
const User = db.User;
const Role = db.Role;
const UserRole = db.UserRole;

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * User signup with role assignment
 */
exports.signup = async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      password, 
      org_id,
      role_id, // This will come from the dropdown selection
      acc_limit 
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email || !password || !role_id || !org_id ||
        acc_limit === undefined || acc_limit === null || acc_limit === '' || 
        phone === undefined || phone === null || phone === '') {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if the selected role exists
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Selected role not found'
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hash_password = await bcrypt.hash(password, saltRounds);

    // Create the user
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      phone: phone,
      hash_password,
      org_id: org_id,
      status: 'active',
      acc_limit: acc_limit,
      created_at: new Date(),
      updated_at: new Date(),
      created_by_id: req.user ? req.user.id : null
    });

    // Assign the selected role to the user
    await UserRole.create({
      user_id: newUser.id,
      role_id,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
      created_by_id: req.user ? req.user.id : null
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response without sensitive information
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role_id,
        token
      }
    });
  } catch (error) {
    console.error('Error in signup:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      error: error.message
    });
  }
};

/**
 * User login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({
      where: { email },
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] }
      }]
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.hash_password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        roles: user.roles,
        token
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: error.message
    });
  }
};