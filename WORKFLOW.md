# WA-Automation-Authentication-Service API Design and Workflow

## High-Level Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌────────────┐
│  HTTP Client │────▶│    Routes    │────▶│ Controllers  │────▶│   Models   │
│   (Request)  │      │  (Routing)   │      │  (Logic)    │      │  (Data)    │
└─────────────┘      └──────────────┘      └─────────────┘      └────────────┘
       ▲                     │                    │                    │
       │                     │                    │                    │
       │                     ▼                    │                    ▼
       │              ┌──────────────┐            │             ┌────────────┐
       └──────────────│  Middleware  │◀───────────┘             │ PostgreSQL │
          (Response)  │   (Auth)     │                          │ Database   │
                      └──────────────┘                          └────────────┘
```

## Authentication Flow Diagram

```
┌──────────┐          ┌────────────┐          ┌────────────┐          ┌────────────┐
│  Client  │          │   Routes   │          │ Controllers │          │   Models   │
└────┬─────┘          └─────┬──────┘          └──────┬─────┘          └──────┬─────┘
     │                      │                        │                       │
     │  POST /api/users/signup                       │                       │
     │─────────────────────▶│                        │                       │
     │                      │                        │                       │
     │                      │  req, res              │                       │
     │                      │───────────────────────▶│                       │
     │                      │                        │  Create User          │
     │                      │                        │─────────────────────▶ │
     │                      │                        │                       │
     │                      │                        │  Create UserRole      │
     │                      │                        │─────────────────────▶ │
     │                      │                        │                       │
     │                      │       Response         │                       │
     │◀─────────────────────│◀───────────────────────│                       │
     │                      │                        │                       │
     │  POST /api/users/login                        │                       │
     │─────────────────────▶│                        │                       │
     │                      │  req, res              │                       │
     │                      │───────────────────────▶│                       │
     │                      │                        │  Verify Credentials   │
     │                      │                        │─────────────────────▶ │
     │                      │                        │                       │
     │                      │       JWT Token        │                       │
     │◀─────────────────────│◀───────────────────────│                       │
     │                      │                        │                       │
     │  Request with JWT    │                        │                       │
     │─────────────────────▶│                        │                       │
     │                      │                        │                       │
     │                      │  Auth Middleware       │                       │
     │                      │───────────────────────▶│                       │
     │                      │                        │  Verify Token         │
     │                      │                        │─────────────────────▶ │
     │                      │                        │                       │
     │                      │  Access Protected      │                       │
     │                      │  Resources if          │                       │
     │                      │  Authorized            │                       │
     │                      │◀───────────────────────│                       │
     │  Response            │                        │                       │
     │◀─────────────────────│                        │                       │
     │                      │                        │                       │
└─────┴──────┘          └─────┴──────┘          └──────┴─────┘          └──────┴─────┘
```

## Components and Their Responsibilities

### 1. Routes
Routes define the API endpoints and map HTTP methods to controller functions. They handle:
- URL path definitions
- HTTP method binding (GET, POST, PUT, DELETE)
- Middleware attachment (e.g., authentication)

Example: `/api/users/signup` is mapped to `usersController.signup`

### 2. Middleware
Middleware functions process requests before they reach the controller:
- **Authentication middleware**: Verifies JWT tokens and grants access to protected resources
- **Validation middleware**: Ensures request data meets requirements
- **Error handling middleware**: Manages errors that occur during request processing

### 3. Controllers
Controllers contain the business logic for handling requests:
- Processing request data
- Calling service/model methods
- Sending appropriate responses
- Error handling

### 4. Models (Sequelize ORM)
Models define the data structure and provide methods to interact with the database:
- User, Role, UserRole, etc.
- Database schema and relationships
- Data validation rules

## Key API Workflows

### User Registration (Signup)
1. Client sends POST request to `/api/users/signup` with user details
2. Controller validates input data
3. Controller checks if user already exists
4. If user doesn't exist, password is hashed using bcrypt
5. New user is created in the database
6. Default role is assigned to the user
7. Success response is sent back to the client

### User Authentication (Login)
1. Client sends POST request to `/api/users/login` with credentials
2. Controller finds user by email
3. Controller verifies password using bcrypt
4. If credentials are valid, JWT token is generated with user information
5. Token and user details are sent back to the client

### Protected Resource Access
1. Client sends request with JWT token in Authorization header
2. Auth middleware intercepts the request
3. Middleware verifies token validity and expiration
4. Middleware retrieves user from database and attaches to request
5. If authorized, request proceeds to the controller
6. Controller processes the request and sends appropriate response
7. If unauthorized, middleware returns 401 status code

## Data Model Relationships

```
┌───────────┐     ┌───────────────┐     ┌───────────┐
│   User    │     │   UserRole    │     │   Role    │
├───────────┤     ├───────────────┤     ├───────────┤
│ id        │──┐  │ id            │  ┌──│ id        │
│ first_name│  │  │ user_id       │◀─┘  │ name      │
│ last_name │  └─▶│ role_id       │     │ status    │
│ email     │     │ status        │     └───────────┘
│ phone     │     └───────────────┘
│ hash_password │
│ org_id    │     ┌───────────────┐
│ status    │     │  Permission   │
└───────────┘     ├───────────────┤
                  │ id            │
                  │ module_name   │
                  │ role_id       │──┐
                  │ parent_id     │  │
                  │ crud_flags    │  │
                  └───────────────┘  │
                                     │
                                     └─▶ Role
```

## API Endpoints Reference

### Authentication
- **POST /api/users/signup** - Register new user
- **POST /api/users/login** - Authenticate and get JWT token

### Users
- **GET /api/users** - List all users
- **GET /api/users/:id** - Get user by ID
- **PUT /api/users/:id** - Update user
- **DELETE /api/users/:id** - Soft delete user
- **PUT /api/users/:id/roles** - Update user roles

### Roles
- **GET /api/roles** - List all roles
- **POST /api/roles** - Create new role
- **GET /api/roles/:id** - Get role by ID
- **PUT /api/roles/:id** - Update role
- **DELETE /api/roles/:id** - Soft delete role

### User Roles
- **GET /api/user-roles** - List all user roles
- **POST /api/user-roles** - Create new user role
- **GET /api/user-roles/:id** - Get user role by ID
- **PUT /api/user-roles/:id** - Update user role
- **DELETE /api/user-roles/:id** - Soft delete user role

### Permissions
- **GET /api/permissions** - List all permissions
- **POST /api/permissions** - Create new permission
- **GET /api/permissions/:id** - Get permission by ID
- **PUT /api/permissions/:id** - Update permission
- **DELETE /api/permissions/:id** - Soft delete permission

## Authentication Headers

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

This architecture follows RESTful API design principles and implements robust authentication with JWT tokens, providing a secure and scalable foundation for the WhatsApp Automation service.
