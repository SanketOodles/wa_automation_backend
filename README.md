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

### Core User Management

```javascript
// User Model
user.js
- id (PK)
- first_name
- last_name
- email
- phone
- hash_password
- org_id (FK -> Organisation)
- status
- acc_limit
- created_at
- updated_at
- deleted_at
- created_by_id
- updated_by_id

// Role Model
role.js
- id (PK)
- name
- status
- created_at
- updated_at
- deleted_at
- created_by_id
- updated_by_id
- deleted_by_id

// User Role (Junction Table)
user_roles.js
- user_id (FK -> User)
- role_id (FK -> Role)

// User Activity
userActivity.js
- id (PK)
- user_id (FK -> User)
- action
- timestamp
```

### Organization Structure

```javascript
// Organisation Model
organisation.js
- id (PK)
- name
- address_id (FK -> Address)
- created_at
- updated_at
- deleted_at

// Address Model
address.js
- id (PK)
- street
- city
- state
- country_id (FK -> Country)
- postal_code
- created_at
- updated_at

// Country Model
country.js
- id (PK)
- name
- code
- created_at
- updated_at
```

### Product Management

```javascript
// Product Model
product.js
- id (PK)
- name
- description
- price_id (FK -> Price)
- brand_id (FK -> Brand)
- created_at
- updated_at
- deleted_at

// Price Model
price.js
- id (PK)
- amount
- currency
- effective_date
- created_at
- updated_at

// Brand Model
brand.js
- id (PK)
- name
- description
- created_at
- updated_at
- deleted_at

// Product Brand (Junction Table)
productBrand.js
- product_id (FK -> Product)
- brand_id (FK -> Brand)

// Product Document (Junction Table)
productDocument.js
- product_id (FK -> Product)
- document_id (FK -> Document)

// Document Model
document.js
- id (PK)
- name
- type
- url
- created_at
- updated_at
```

### WhatsApp Integration

```javascript
// Chat Model
chat.js
- id (PK)
- channel_id (FK -> Channel)
- parent_chat_id (Self-FK)
- org_id (FK -> Organisation)
- product_id (FK -> Product)
- created_at
- updated_at
- deleted_at

// WhatsApp Message
whatsappmessage.js
- messageId (PK)
- chatId (FK -> Chat)
- body
- fromMe
- timestamp
- type
- media

// Chat Media
chatMedia.js
- id (PK)
- chat_id (FK -> Chat)
- type
- url
- size
- mime_type
- created_at
- updated_at

// Chat AI Log
chatAILog.js
- id (PK)
- chat_id (FK -> Chat)
- prompt
- response
- timestamp
- created_at
- updated_at
```

### Channel Management

```javascript
// Channel Model
channel.js
- id (PK)
- name
- type
- configuration
- status
- created_at
- updated_at
- deleted_at
```

### Supplier Management

```javascript
// Supplier Model
suppliers.js
- id (PK)
- name
- contact
- address_id (FK -> Address)
- created_at
- updated_at
- deleted_at

// Supplier Product
product.js
- id (PK)
- supplier_id (FK -> Supplier)
- name
- description
- price
- created_at
- updated_at
```

### Detailed Relationships

1. **User Management**
```javascript
User.belongsToMany(Role, { through: UserRole })
Role.belongsToMany(User, { through: UserRole })
User.hasMany(UserRole)
Role.hasMany(UserRole)
User.hasMany(UserActivity)
User.belongsTo(Organisation)
```

2. **Chat Management**
```javascript
Chat.belongsTo(Channel)
Chat.belongsTo(Chat, { as: 'parentChat' })
Chat.hasMany(Chat, { as: 'replies' })
Chat.hasMany(ChatMedia)
Chat.hasMany(ChatAILog)
Chat.belongsTo(Organisation)
Chat.belongsTo(Product)
```

3. **WhatsApp Message Flow**
```javascript
WhatsappMessage.belongsTo(Chat)
Chat.hasMany(WhatsappMessage)
Chat.hasMany(ChatMedia)
Chat.hasMany(ChatAILog)
```

4. **Organization Structure**
```javascript
Organisation.hasOne(Address)
Address.belongsTo(Country)
Organisation.hasMany(Chat)
```

5. **Product Structure**
```javascript
Product.belongsTo(Price)
Product.belongsTo(Brand)
Product.hasMany(ProductBrand)
Product.hasMany(ProductDocument)
```

### Relationship Diagram

```
[User]
  ↓ belongsToMany
[Role]
  ↑ belongsToMany
[UserRole]
  ↑ hasMany
[User]
  ↓ belongsTo
[Organisation]
  ↓ hasOne
[Address]
  ↓ belongsTo
[Country]

[Chat]
  ↓ belongsTo
[Channel]
  ↑ hasMany
[Chat]
  ↓ hasMany
[ChatMedia]
  ↑ belongsTo
[Chat]
  ↓ hasMany
[ChatAILog]
  ↑ belongsTo
[Chat]
  ↓ belongsTo
[Organisation]
  ↓ belongsTo
[Product]
  ↑ hasMany
[Chat]
  ↓ belongsTo
[Product]
  ↑ hasMany
[ProductBrand]
  ↑ belongsTo
[Brand]
  ↓ hasMany
[ProductBrand]
  ↑ hasMany
[Product]
  ↓ hasMany
[ProductDocument]
  ↑ belongsTo
[Document]

[WhatsappMessage]
  ↓ belongsTo
[Chat]
  ↑ hasMany
[WhatsappMessage]
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
