require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const roleController = require('./controllers/role/role.controller');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Import routes
const authRoutes = require('./routes/auth.routes');
const roleRoutes = require('./routes/role.routes');
const userRoutes = require('./routes/users.routes');
const authRoute = require('./routes/authRoutes');
const accountsRoutes = require('./routes/accounts.routes');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auths', authRoute); // for qr generation
app.use('/api/auths', accountsRoutes); // accounts management under the auths path for frontend compatibility

// Root route
app.get('/', (req, res) => {
  res.send('WA-Automation Authentication Service is running');
});

// Database connection and server initialization
// Database connection and server initialization
async function initializeDatabase() {
  try {
    // Connect to the database
    await db.sequelize.authenticate();
    console.log('Connected to the database!');
    
    // Create tables in a specific order to handle dependencies
    // Core tables first with no foreign keys
    await db.Organisation.sync({ force: false });
    console.log('Organisation table created');
    
    // User table must be created before other tables that reference it
    await db.User.sync({ force: false });
    console.log('User table created');
    
    // Role table and user-role association
    await db.Role.sync({ force: false });
    console.log('Role table created');
    
    await db.UserRole.sync({ force: false });
    console.log('UserRole table created');
    
    // Now we can create the rest of the tables
    await db.Product.sync({ force: false });
    console.log('Product table created');
    
    // Continue with other tables
    await db.sequelize.sync({ force: false });
    console.log('All remaining tables created');
    
    // Initialize default roles (Admin, Manager, Manager 2, User)
    // try {
    //   await roleController.initializeDefaultRoles();
    //   console.log('Default roles initialized successfully');
    // } catch (error) {
    //   console.error('Error initializing default roles:', error);
    // }
    
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

// Initialize database and start server
initializeDatabase()
  .then(success => {
    if (success) {
      // Start the server
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } else {
      console.error('Failed to initialize database. Server not started.');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Failed to connect to the database:', err.message);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Export the app for testing purposes
module.exports = app;