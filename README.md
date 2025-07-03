# Nova-wa-fe - WhatsApp Automation Frontend

A modern, responsive frontend application built with React and TypeScript, providing a user-friendly interface for the WhatsApp automation system.

## Project Overview

Nova-wa-fe is the frontend component of the WhatsApp automation system, designed to work seamlessly with the Nova-wa-be backend service. It provides a modern, intuitive interface for managing WhatsApp automation tasks, AI features, and administrative functions.

## Technical Stack

- React 18
- TypeScript
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Radix UI (Component Library)
- React Query (Data Fetching)
- Swiper (Carousel)
- Axios (HTTP Client)

## Project Structure

```
Nova-wa-fe/
├── .env                    # Environment configuration
├── .git/                   # Git repository files
├── components/            # Reusable UI components
├── src/                   # Source code
│   ├── App.css          # Global styles
│   ├── App.tsx          # Root component
│   ├── assets/         # Static assets
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility libraries
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── styles/        # CSS modules
│   ├── utils/         # Helper functions
│   └── index.css      # Global styles
├── public/              # Static files
└── node_modules/       # Dependencies
```

## Key Components

### UI Components

```
components/
├── Header.tsx          # Navigation header
├── SupplierFormModal.tsx # Supplier form modal
├── SupplierTable.tsx    # Supplier data table
├── account_card.tsx    # Account card component
├── chat_detail.tsx     # Chat detail view
├── chat_list_item.tsx  # Chat list item
├── product_card.tsx    # Product card
├── prompt_template.tsx # AI prompt template
└── qr_code-modal.tsx   # QR code modal
```

### Pages

```
pages/
├── Dashboard.tsx      # Main dashboard
├── Suppliers.tsx      # Supplier management
├── Chats.tsx         # Chat interface
├── Settings.tsx      # System settings
└── Auth.tsx         # Authentication pages
```

### Services

```
services/
├── whatsapp.ts       # WhatsApp API integration
├── auth.ts          # Authentication service
├── suppliers.ts     # Supplier management
└── ai.ts           # AI service integration
```

## Features

1. WhatsApp Integration
   - Real-time chat interface
   - Contact management
   - Message history
   - Group management

2. Supplier Management
   - Add/Edit suppliers
   - Supplier directory
   - Supplier chat history

3. AI Features
   - Smart replies
   - Message categorization
   - Automated responses

4. User Interface
   - Modern, responsive design
   - Dark/Light mode support
   - Intuitive navigation
   - Real-time updates

## Getting Started

1. Prerequisites
   - Node.js (v16 or higher)
   - npm or yarn

2. Installation
   ```bash
   # Clone the repository
   git clone [repository-url]
   
   # Install dependencies
   npm install
   
   # Copy environment file
   cp .env.example .env
   
   # Configure environment variables
   # Edit .env file with your settings
   
   # Start development server
   npm run dev
   ```

3. Build for Production
   ```bash
   # Build the project
   npm run build
   
   # Preview the build
   npm run preview
   ```

## Development

The project uses Vite for fast development and build processes. Key development scripts:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Environment Variables

The following environment variables need to be configured:

```
# API Configuration
VITE_API_URL=http://localhost:3000

# Theme Configuration
VITE_THEME=light

# Feature Flags
VITE_ENABLE_AI=true
VITE_ENABLE_CHAT=true
```

## Technologies Used

### Frontend Framework
- React 18
- TypeScript
- Vite

### Styling
- Tailwind CSS
- PostCSS

### Component Libraries
- Radix UI
- Lucide React Icons

### State Management
- React Query
- Custom React Hooks

### UI Features
- Responsive Design
- Dark/Light Mode
- Real-time Updates
- Form Validation
- Error Handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team directly.
