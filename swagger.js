const swaggerAutogen = require('swagger-autogen')();

// Documentation definition
const doc = {
  info: {
    title: 'WA Automation Authentication API',
    description: 'API documentation for the WA Automation Authentication Service',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  }
};

const outputFile = './swagger.json';
// Start with just index.js to test if it works
const routes = ['./index.js'];

// Add proper promise handling
swaggerAutogen(outputFile, routes, doc)
  .then(() => {
    console.log('Swagger documentation generated successfully!');
  })
  .catch(error => {
    console.error('Error generating Swagger documentation:');
    console.error(error);
  });