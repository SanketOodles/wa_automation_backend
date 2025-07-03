
### User Management Models

1. **User**
   - Primary model for user information
   - Contains authentication details, personal information, and organizational relationships
   - Fields:
     - `id` (PK): Unique identifier for the user
     - `first_name`: User's first name
     - `last_name`: User's last name
     - `email`: User's email address (used for login)
     - `phone`: User's contact phone number
     - `hash_password`: Encrypted password for authentication
     - `org_id` (FK): Reference to Organization model
     - `status`: User account status (active, inactive, suspended)
     - `acc_limit`: Account limitation parameter
     - `created_at`: Timestamp when record was created
     - `updated_at`: Timestamp when record was last updated
     - `deleted_at`: Soft delete timestamp
     - `created_by_id`: User ID who created this record
     - `updated_by_id`: User ID who last updated this record
   - Relationships: belongsTo Organisation, belongsToMany Role, hasMany UserActivity

2. **Role**
   - Defines user permissions and access levels
   - Fields:
     - `id` (PK): Unique identifier for the role
     - `name`: Name of the role (e.g., Admin, User, Manager)
     - `status`: Status of the role (active, inactive)
     - `created_at`: Timestamp when record was created
     - `updated_at`: Timestamp when record was last updated
     - `deleted_at`: Soft delete timestamp
     - `created_by_id`: User ID who created this record
     - `updated_by_id`: User ID who last updated this record
     - `deleted_by_id`: User ID who deleted this record
   - Relationships: belongsToMany User, hasMany UserRole

3. **UserRole**
   - Junction table linking users to their roles
   - Fields:
     - `user_id` (FK): Reference to User model, part of composite primary key
     - `role_id` (FK): Reference to Role model, part of composite primary key
   - Relationships: belongsTo User, belongsTo Role

4. **UserActivity**
   - Tracks user actions for auditing and monitoring
   - Fields:
     - `id` (PK): Unique identifier for the activity record
     - `user_id` (FK): Reference to User who performed the action
     - `action`: Description of the action performed
     - `timestamp`: When the action occurred
   - Relationships: belongsTo User

5. **Permission**
   - Defines granular access controls within the system
   - Fields:
     - `id` (PK): Unique identifier for the permission
     - `name`: Name of the permission (e.g., "read_users", "write_products")
     - `description`: Detailed description of what the permission allows
     - `created_at`: Timestamp when record was created
     - `updated_at`: Timestamp when record was last updated
   - Relationships: belongsToMany Role

### Organization Models

6. **Organisation**
   - Represents business entities using the system
   - Fields:
     - `id` (PK): Unique identifier for the organisation
     - `name`: Name of the organisation
     - `address_id` (FK): Reference to Address model
     - `created_at`: Timestamp when record was created
     - `updated_at`: Timestamp when record was last updated
     - `deleted_at`: Soft delete timestamp
   - Relationships: hasOne Address, hasMany User, hasMany Chat

7. **Address**
   - Stores location information for organizations and suppliers
   - Fields:
     - `id` (PK): Unique identifier for the address
     - `street`: Street address
     - `city`: City name
     - `state`: State or province
     - `country_id` (FK): Reference to Country model
     - `postal_code`: ZIP or postal code
     - `created_at`: Timestamp when record was created
     - `updated_at`: Timestamp when record was last updated
   - Relationships: belongsTo Country, belongsTo Organisation

8. **Country**
   - Reference data for address internationalization
   - Fields:
     - `id` (PK): Unique identifier for the country
     - `name`: Full name of the country
     - `code`: ISO country code (2-letter code)
     - `created_at`: Timestamp when record was created
     - `updated_at`: Timestamp when record was last updated
   - Relationships: hasMany Address

### Product Management Models

9. **Product**
   - Core product information
   - Fields:
     - `id` (PK): Unique identifier for the product
     - `name`: Product name
     - `description`: Detailed product description
     - `price_id` (FK): Reference to Price model
     - `brand_id` (FK): Reference to Brand model
     - `supplier_id` (FK): Reference to Supplier model
     - `created_at`: Timestamp when record was created
     - `updated_at`: Timestamp when record was last updated
     - `deleted_at`: Soft delete timestamp
   - Relationships: belongsTo Price, belongsTo Brand, belongsTo Supplier, hasMany ProductBrand, hasMany ProductDocument

10. **Price**
    - Product pricing information
    - Fields:
      - `id` (PK): Unique identifier for the price
      - `amount`: Monetary amount
      - `currency`: Currency code (USD, EUR, etc.)
      - `effective_date`: Date when this price becomes effective
      - `created_at`: Timestamp when record was created
      - `updated_at`: Timestamp when record was last updated
    - Relationships: belongsTo Product

11. **Brand**
    - Brand information for products
    - Fields:
      - `id` (PK): Unique identifier for the brand
      - `name`: Brand name
      - `description`: Brand description
      - `created_at`: Timestamp when record was created
      - `updated_at`: Timestamp when record was last updated
      - `deleted_at`: Soft delete timestamp
    - Relationships: hasMany Product, hasMany ProductBrand

12. **ProductBrand**
    - Junction table for products and brands
    - Fields:
      - `product_id` (FK): Reference to Product model, part of composite primary key
      - `brand_id` (FK): Reference to Brand model, part of composite primary key
    - Relationships: belongsTo Product, belongsTo Brand

13. **Document**
    - Stores references to files and documents
    - Fields:
      - `id` (PK): Unique identifier for the document
      - `name`: Document name/title
      - `type`: Document type (PDF, image, contract, etc.)
      - `url`: URL or file path to access the document
      - `created_at`: Timestamp when record was created
      - `updated_at`: Timestamp when record was last updated
    - Relationships: belongsToMany Product

14. **ProductDocument**
    - Junction table linking products to documents
    - Fields:
      - `product_id` (FK): Reference to Product model, part of composite primary key
      - `document_id` (FK): Reference to Document model, part of composite primary key
    - Relationships: belongsTo Product, belongsTo Document

### Supplier Management Models

15. **Supplier**
    - Information about product suppliers
    - Fields:
      - `id` (PK): Unique identifier for the supplier
      - `name`: Supplier company name
      - `contact`: Primary contact person name or details
      - `address_id` (FK): Reference to Address model
      - `phone_number`: Contact phone number
      - `location`: Geographic location coordinates or description
      - `created_at`: Timestamp when record was created
      - `updated_at`: Timestamp when record was last updated
      - `deleted_at`: Soft delete timestamp
    - Relationships: belongsTo Address, hasMany Product, hasMany SupplierProduct

16. **SupplierProduct**
    - Products offered by specific suppliers
    - Fields:
      - `id` (PK): Unique identifier for the supplier product
      - `supplier_id` (FK): Reference to Supplier model
      - `name`: Product name as defined by supplier
      - `description`: Supplier-provided product description
      - `price`: Supplier's price for the product
      - `created_at`: Timestamp when record was created
      - `updated_at`: Timestamp when record was last updated
    - Relationships: belongsTo Supplier

### WhatsApp Integration Models

17. **Channel**
    - Communication channels configuration
    - Fields:
      - `id` (PK): Unique identifier for the channel
      - `name`: Channel name
      - `type`: Channel type (WhatsApp, SMS, Email, etc.)
      - `configuration`: JSON configuration data for the channel
      - `status`: Channel status (active, inactive, maintenance)
      - `whatsapp_chat_id`: External WhatsApp chat identifier
      - `created_at`: Timestamp when record was created
      - `updated_at`: Timestamp when record was last updated
      - `deleted_at`: Soft delete timestamp
    - Relationships: hasMany Chat

18. **Chat**
    - Core chat conversation model
    - Fields:
      - `id` (PK): Unique identifier for the chat
      - `channel_id` (FK): Reference to Channel model
      - `parent_chat_id` (Self-FK): Reference to parent Chat for threading
      - `org_id` (FK): Reference to Organisation model
      - `product_id` (FK): Reference to Product model
      - `follow_up_message`: Scheduled follow-up message content
      - `created_at`: Timestamp when record was created
      - `updated_at`: Timestamp when record was last updated
      - `deleted_at`: Soft delete timestamp
    - Relationships: belongsTo Channel, belongsTo Chat (as parentChat), hasMany Chat (as replies), hasMany ChatMedia, hasMany ChatAILog, belongsTo Organisation, belongsTo Product

19. **WhatsappMessage**
    - Individual WhatsApp messages
    - Fields:
      - `messageId` (PK): Unique identifier for the message (typically from WhatsApp API)
      - `chatId` (FK): Reference to Chat model
      - `body`: Message content text
      - `fromMe`: Boolean flag indicating if message sent by system user
      - `timestamp`: When the message was sent
      - `type`: Message type (text, image, voice, document, etc.)
      - `media`: Media information for non-text messages
    - Relationships: belongsTo Chat

20. **ChatMedia**
    - Media files attached to chats
    - Fields:
      - `id` (PK): Unique identifier for the chat media
      - `chat_id` (FK): Reference to Chat model
      - `type`: Media type (image, video, audio, document)
      - `url`: URL to access the media file
      - `size`: File size in bytes
      - `mime_type`: MIME content type
      - `base64_data`: Base64 encoded media data for small files
      - `created_at`: Timestamp when record was created
      - `updated_at`: Timestamp when record was last updated
    - Relationships: belongsTo Chat

21. **ChatAILog**
    - AI interaction logs for chat conversations
    - Fields:
      - `id` (PK): Unique identifier for the AI log
      - `chat_id` (FK): Reference to Chat model
      - `prompt`: Input text sent to AI service
      - `response`: Response received from AI service
      - `timestamp`: When the AI interaction occurred
      - `created_at`: Timestamp when record was created
      - `updated_at`: Timestamp when record was last updated
    - Relationships: belongsTo Chat

22. **ChatTemplate**
    - Predefined message templates
    - Fields:
      - `id` (PK): Unique identifier for the template
      - `name`: Template name/identifier
      - `content`: Template content with variable placeholders
      - `variables`: JSON array of variables used in the template
      - `created_at`: Timestamp when record was created
      - `updated_at`: Timestamp when record was last updated
    - Relationships: belongsTo Organisation

### Account Management Models

23. **Account**
    - Customer account information
    - Fields:
      - `id` (PK): Unique identifier for the account
      - `user_id` (FK): Reference to User model
      - `organisation_id` (FK): Reference to Organisation model
      - `status`: Account status (active, inactive, suspended)
      - `number`: Account reference number
      - `name`: Account display name
      - `created_at`: Timestamp when record was created
      - `updated_at`: Timestamp when record was last updated
    - Relationships: belongsTo User, belongsTo Organisation

24. **Color**
    - Color definitions for UI and products
    - Fields:
      - `id` (PK): Unique identifier for the color
      - `name`: Color name
      - `hex_code`: Hexadecimal color code
      - `created_at`: Timestamp when record was created
      - `updated_at`: Timestamp when record was last updated
    - Relationships: belongsToMany Product

25. **ProductColor**
    - Junction table for products and colors
    - Fields:
      - `product_id` (FK): Reference to Product model, part of composite primary key
      - `color_id` (FK): Reference to Color model, part of composite primary key
    - Relationships: belongsTo Product, belongsTo Color

26. **RolePermission**
    - Junction table linking roles to permissions
    - Fields:
      - `role_id` (FK): Reference to Role model, part of composite primary key
      - `permission_id` (FK): Reference to Permission model, part of composite primary key
    - Relationships: belongsTo Role, belongsTo Permission
