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

## System Architecture

### Microservices Architecture

```
Nova-wa-be
├── Adminservice/         # Core Administrative Services
│   ├── Controllers/     # Business Logic
│   ├── Models/         # Data Models
│   ├── Routes/         # API Endpoints
│   └── Services/       # Service Integration
├── AiService/          # AI Processing Services
│   ├── Controllers/   # AI Logic
│   └── Routes/        # AI Endpoints
└── Whatsappservice/   # WhatsApp Integration
    ├── Controllers/   # WhatsApp Logic
    ├── Models/       # WhatsApp Models
    └── Routes/       # WhatsApp Endpoints
```

### Service Integration Flow

```
[Frontend]
    ↓ REST API Calls
[Adminservice]
    ↓ Internal API Calls
[Whatsappservice]
    ↔ WhatsApp Web API
    ↓ AI Processing
[AiService]
    ↔ OpenAI API
```

### Data Flow Architecture

```
[User Request]
    ↓
[Authentication]
    ↓
[Role-Based Access]
    ↓
[Service Router]
    ↓
[WhatsApp Integration]
    ↓
[AI Processing]
    ↓
[Response]
```

## Service Relationships

### Admin Service Integration

1. **Authentication Flow**
```javascript
User -> authController.js -> auth.routes.js
- Handles login/logout
- Token generation
- Session management
```

2. **User Management**
```javascript
User -> userController.js -> users.routes.js
- CRUD operations
- Role assignments
- Activity logging
```

3. **Organization Management**
```javascript
Organisation -> organisationController.js -> organisations.routes.js
- Business entities
- Address management
- Country relationships
```

### WhatsApp Service Integration

1. **WhatsApp Session Management**
```javascript
WhatsApp Session -> whatsappController.js -> whatsapp.routes.js
- Session handling
- Message processing
- Chat management
```

2. **Message Flow**
```javascript
WhatsApp Message -> chatController.js -> whatsapp.routes.js
- Message routing
- AI integration
- Media handling
```

### AI Service Integration

1. **AI Processing**
```javascript
Chat AI Log -> aiController.js -> ai.routes.js
- AI response generation
- Context management
- Template processing
```

2. **Smart Replies**
```javascript
Chat -> Chat AI Log -> Chat Templates
- Message categorization
- Response generation
- Template selection
```

## API Endpoints

### Admin Service Endpoints

```
/auth/           # Authentication
/users/         # User management
/roles/         # Role management
/organisations/ # Organisation management
/products/      # Product management
/suppliers/     # Supplier management
```

### WhatsApp Service Endpoints

```
/whatsapp/        # WhatsApp integration
/messages/       # Message handling
/chats/         # Chat management
/media/         # Media processing
```

### AI Service Endpoints

```
/ai/              # AI processing
/templates/       # Template management
/responses/      # Response generation
```

## Integration Points

1. **User Authentication**
```javascript
Frontend -> Adminservice -> Whatsappservice
- Token validation
- Session management
- Access control
```

2. **Message Processing**
```javascript
WhatsAppservice -> AiService
- Message routing
- AI processing
- Response generation
```

3. **Data Synchronization**
```javascript
Adminservice <-> Whatsappservice
- User updates
- Organisation changes
- Product updates
```

## Security Architecture

1. **Authentication**
- JWT-based tokens
- Session management
- Role-based access

2. **Data Protection**
- Input validation
- SQL injection prevention
- XSS protection

3. **API Security**
- Rate limiting
- Request validation
- CORS configuration

## Scalability Architecture

1. **Load Balancing**
- Service distribution
- Request routing
- Failover handling

2. **Caching Strategy**
- In-memory caching
- API response caching
- Database query caching

3. **Database Optimization**
- Indexing strategy
- Query optimization
- Connection pooling

## Monitoring Architecture

1. **Service Monitoring**
- Health checks
- Performance metrics
- Error tracking

2. **User Activity**
- Action logging
- Session tracking
- Performance metrics

3. **WhatsApp Integration**
- Session status
- Message delivery
- Error handling

## Documentation

For detailed documentation, refer to:
- [WORKFLOW.md](WORKFLOW.md) - Workflow documentation
- Swagger documentation available at `/api-docs` endpoint

## License

This project is licensed under the MIT License - see the LICENSE file for details.
