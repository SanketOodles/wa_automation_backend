# Database Documentation

This document provides a comprehensive overview of the database schema and relationships for the application.

## Table of Contents

- [Product Schema](#product-schema)
- [Chat Schema](#chat-schema)
- [Organisation Schema](#organisation-schema)
- [Entity Relationship Diagram](#entity-relationship-diagram)

## Product Schema

The Product Schema contains tables related to products, brands, and suppliers.

### Brands

| Column | Description |
|--------|-------------|
| id | Primary key |
| name | Brand name |
| org_id | Foreign key to Organisations table |
| status | Status of the brand |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

### Suppliers

| Column | Description |
|--------|-------------|
| id | Primary key |
| name | Supplier name |
| org_id | Foreign key to Organisations table |
| status | Status of the supplier |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

### Product Brands

| Column | Description |
|--------|-------------|
| id | Primary key |
| product_id | Foreign key to Products table |
| brand_id | Foreign key to Brands table |
| status | Status of the product brand relationship |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

### Products

| Column | Description |
|--------|-------------|
| id | Primary key |
| name | Product name |
| description | Product description |
| color_name | Color of the product |
| type | Type of product |
| price | Price of the product |
| status | Status of the product |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

## Chat Schema

The Chat Schema contains tables related to communication channels and messages.

### Channels

| Column | Description |
|--------|-------------|
| id | Primary key |
| name | Channel name |
| type | Type of channel |
| acc_id | Foreign key to Accounts table |
| description | Channel description |
| is_subscribed | Subscription status |
| status | Status of the channel |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

### Chats

| Column | Description |
|--------|-------------|
| id | Primary key |
| original_message | Original message content |
| message | Processed message content |
| type | Type of chat message |
| channel_id | Foreign key to Channels table |
| is_ai_processed | Flag indicating if processed by AI |
| parent_chat_id | Self-referencing foreign key to Chats table |
| status | Status of the chat |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

### Chat Medias

| Column | Description |
|--------|-------------|
| id | Primary key |
| unique_file_name | Unique identifier for the file |
| file_name | Original file name |
| bucket_name | Storage bucket name |
| region | Storage region |
| type | Type of media |
| chat_id | Foreign key to Chats table |
| status | Status of the media |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

### Chat Templates

| Column | Description |
|--------|-------------|
| id | Primary key |
| name | Template name |
| content | Template content |
| channel_id | Foreign key to Channels table |
| status | Status of the template |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

### Chat AI Logs

| Column | Description |
|--------|-------------|
| id | Primary key |
| ai_request | AI request data |
| ai_response | AI response data |
| chat_id | Foreign key to Chats table |
| status | Status of the AI log |
| crm_type | CRM type |
| is_synced | Synchronization status |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

## Organisation Schema

The Organisation Schema contains tables related to users, roles, and permissions.

### Roles

| Column | Description |
|--------|-------------|
| id | Primary key |
| name | Role name |
| status | Status of the role |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

### Permissions

| Column | Description |
|--------|-------------|
| id | Primary key |
| module_name | Name of the module |
| role_id | Foreign key to Roles table |
| parent_permission_id | Self-referencing foreign key to Permissions table |
| is_create | Create permission flag |
| is_update | Update permission flag |
| is_delete | Delete permission flag |
| is_read | Read permission flag |
| status | Status of the permission |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

### Organisations

| Column | Description |
|--------|-------------|
| id | Primary key |
| name | Organisation name |
| type_of_organisation | Type of organisation |
| status | Status of the organisation |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

### User Roles

| Column | Description |
|--------|-------------|
| id | Primary key |
| user_id | Foreign key to Users table |
| role_id | Foreign key to Roles table |
| status | Status of the user role |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

### Users

| Column | Description |
|--------|-------------|
| id | Primary key |
| first_name | User's first name |
| last_name | User's last name |
| email | User's email address |
| phone | User's phone number |
| hash_password | Hashed password |
| org_id | Foreign key to Organisations table |
| status | Status of the user |
| acc_limit | Account limit |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

### Accounts

| Column | Description |
|--------|-------------|
| id | Primary key |
| org_id | Foreign key to Organisations table |
| qr_session | QR session data |
| status | Status of the account |
| ip_address | IP address |
| location | Location information |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

### User Activities

| Column | Description |
|--------|-------------|
| id | Primary key |
| user_id | Foreign key to Users table |
| api_request_url | API request URL |
| description | Activity description |
| status | Status of the activity |
| created_at | Timestamp when record was created |
| updated_at | Timestamp when record was last updated |
| deleted_at | Timestamp when record was soft deleted |
| created_by_id | ID of user who created the record |
| updated_by_id | ID of user who last updated the record |
| deleted_by_id | ID of user who deleted the record |

## Entity Relationship Diagram

### Product Schema Relationships
- `Brands.id` → `Product_Brands.brand_id`
- `Products.id` → `Product_Brands.product_id`
- `Organisations.id` → `Brands.org_id`
- `Organisations.id` → `Suppliers.org_id`

### Chat Schema Relationships
- `Channels.id` → `Chats.channel_id`
- `Chats.id` → `Chats.parent_chat_id` (self-referencing)
- `Chats.id` → `Chat_Medias.chat_id`
- `Channels.id` → `Chat_Templates.channel_id`
- `Chats.id` → `Chat_Ai_Logs.chat_id`

### Organisation Schema Relationships
- `Accounts.id` → `Channels.acc_id`
- `Roles.id` → `User_Roles.role_id`
- `Roles.id` → `Permissions.role_id`
- `Users.id` → `User_Activities.user_id`
- `Users.id` → `User_Roles.user_id`
- `Organisations.id` → `Users.org_id`
- `Organisations.id` → `Accounts.org_id`
- `Permissions.id` → `Permissions.parent_permission_id` (self-referencing)