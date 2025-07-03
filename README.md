# Nova-wa-be Project

A WhatsApp automation backend service built with Node.js, featuring three main service components: Adminservice, AiService, and Whatsappservice.

## Project Structure

```
Nova-wa-be/
├── .env                    # Environment configuration
├── .git/                   # Git repository files
├── .wwebjs_auth/           # WhatsApp Web authentication files
├── .wwebjs_cache/          # WhatsApp Web cache files
├── Adminservice/           # Admin service component
├── AiService/             # AI service component
├── Whatsappservice/       # WhatsApp service component
└── node_modules/          # Node.js dependencies
```

## Adminservice Component

The Adminservice component handles administrative functionality and database operations.

```
Adminservice/
├── config/                # Configuration files
├── controllers/          # API controllers
├── middleware/           # Express middleware
├── migrations/           # Database migrations
├── models/              # Database models
├── routes/              # API routes
├── seeders/             # Database seeders
├── sessions/            # Session management
├── utils/              # Utility functions
├── index.js            # Entry point
├── swagger.js          # Swagger documentation
├── swagger.json        # Swagger JSON
└── testConnection.js   # Database connection test
```

## AiService Component

The AiService component handles AI-related functionality.

```
AiService/
├── routes/             # API routes
├── utils/             # Utility functions
├── index.js           # Entry point
├── swagger.js         # Swagger documentation
└── swagger.json       # Swagger JSON
```

## Whatsappservice Component

The Whatsappservice component handles WhatsApp integration and messaging functionality.

```
Whatsappservice/
├── config/            # Configuration files
├── controllers/       # API controllers
├── middleware/        # Express middleware
├── migrations/        # Database migrations
├── models/           # Database models
├── routes/           # API routes
├── seeders/          # Database seeders
├── sessions/         # Session management
├── utils/           # Utility functions
├── index.js         # Entry point
├── swagger.js       # Swagger documentation
└── swagger.json     # Swagger JSON
```

## Key Features

- WhatsApp Web integration using wwebjs
- Admin dashboard and management
- AI-powered features
- RESTful API endpoints
- Database management with migrations and seeders
- Swagger API documentation
- Session management
- Environment-based configuration

## Data Models and Relationships

### Admin Service Models

1. **User Management**
```javascript
// User Model
user.js - Represents system users
- id
- username
- email
- password
- createdAt
- updatedAt

// Role Model
role.js - User roles and permissions
- id
- name
- description
- permissions

// User Roles
user_roles.js - Junction table for user-role relationships
- userId
- roleId

// User Activity
userActivity.js - Tracks user actions
- id
- userId
- action
- timestamp
```

2. **Organization Management**
```javascript
// Organisation Model
organisation.js - Business organizations
- id
- name
- addressId
- createdAt
- updatedAt

// Address Model
Address.js - Physical addresses
- id
- street
- city
- state
- countryId
- postalCode

// Country Model
country.js - Countries
countryAddress.js - Country-specific address formats
```

3. **Product Management**
```javascript
// Product Model
product.js - Products for sale
- id
- name
- description
- priceId
- brandId
- createdAt
- updatedAt

// Price Model
price.js - Product pricing
- id
- amount
- currency
- effectiveDate

// Brand Model
brand.js - Product brands
- id
- name
- description
- createdAt
- updatedAt

// Product Brand
productBrand.js - Junction table for product-brand relationships
- productId
- brandId
```

4. **Document Management**
```javascript
// Document Model
Document.js - Product documents
- id
- name
- type
- url
- productId

// Product Document
productDocument.js - Junction table for product-documents
- productId
- documentId
```

### WhatsApp Service Models

1. **WhatsApp Integration**
```javascript
// WhatsApp Session
whatsappSession.js - WhatsApp session management
- id
- sessionId
- status
- lastHeartbeat
- createdAt
- updatedAt

// WhatsApp Message
whatsappmessage.js - WhatsApp messages
- id
- sessionId
- messageId
- content
- sender
- recipient
- timestamp

// Chat Model
chat.js - Chat conversations
- id
- sessionId
- participant
- lastMessage
- updatedAt
```

2. **AI Integration**
```javascript
// Chat AI Log
chatAILog.js - AI conversation logs
- id
- chatId
- prompt
- response
- timestamp

// Chat Templates
chatTemplates.js - Predefined message templates
- id
- name
- content
- category
```

3. **Media Management**
```javascript
// Chat Media
chatMedia.js - Media files in chats
- id
- chatId
- type
- url
- size
- mimeType
```

### Supplier Management

```javascript
// Suppliers
suppliers.js - Business suppliers
- id
- name
- contact
- addressId
- createdAt
- updatedAt

// Supplier Products
product.js - Supplier-specific products
- id
- supplierId
- name
- description
- price
```

### Channel Management

```javascript
// Channel Model
channel.js - Communication channels
- id
- name
- type
- configuration
- status
```

### Relationship Diagram

```
User <-> User Roles <-> Role
User -> User Activity
User -> Organisation
Organisation -> Address
Address -> Country

Product -> Price
Product -> Brand
Product <-> Document
Product <-> Supplier

WhatsApp Session -> WhatsApp Message
WhatsApp Message -> Chat
Chat -> Chat AI Log
Chat -> Chat Media
```

## Getting Started

1. Clone the repository
2. Copy `.env` file and configure environment variables
3. Install dependencies using npm or yarn
4. Run database migrations
5. Start the services

## Documentation

For detailed documentation, refer to:
- [WORKFLOW.md](WORKFLOW.md) - Workflow documentation
- Swagger documentation available at `/api-docs` endpoint

## License

[Add license information here]
