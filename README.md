# RhinoBack

A Next.js application that transforms natural language descriptions into production-ready backends through an intuitive AI-powered interface.

## Overview

RhinoBack is an AI-driven development platform that helps developers build backend systems through conversational interfaces. The application features advanced schema management, API development tools, and intelligent code generation capabilities.

## Features

### Implemented Features
- **Real AI Integration**: Chat interface powered by Groq AI for natural language backend generation
- **Persistent Data Storage**: Projects and schemas persist across browser sessions using localStorage
- **Interactive Schema Visualization**: Drag-and-drop database diagram with relationship mapping
- **Code Generation**: Generate production-ready Express.js/TypeScript backends from your schema
- **Cloud Deployment**: Deploy to Vercel, Railway, Render, and Heroku with live deployment logs
- **Dynamic Schema Management**: AI-powered database schema design and management

### Coming Soon
- **API Development Suite**: Advanced API endpoint generation and testing tools
- **Real-Time Collaboration**: Team-based development with live editing
- **Advanced Database Features**: Query builder, migrations, and performance optimization

## Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **AI Integration**: Groq SDK for AI-powered generation
- **Development**: React Hook Form, Zod validation
- **Charts**: Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rhinoback.git
cd rhinoback
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Groq API key and other configuration variables to `.env.local`:
- `GROQ_API_KEY`: Your Groq API key for AI functionality
- `AI_MODEL`: AI model to use (default: openai/gpt-oss-20b)
- `AI_TEMPERATURE`: Response randomness (0-2, default: 1)
- `AI_MAX_TOKENS`: Maximum response length (default: 8192)
- `AI_TOP_P`: Response diversity (0-1, default: 1)

### Development

Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

Create a production build:
```bash
pnpm build
pnpm start
```

## Deployment

### Vercel (Recommended)

This application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard:
   - `GROQ_API_KEY`: Your Groq API key
   - `AI_MODEL`: AI model configuration
   - `AI_TEMPERATURE`: Temperature setting
   - `AI_MAX_TOKENS`: Token limit
   - `AI_TOP_P`: Top P setting
4. Deploy automatically

The included `vercel.json` file provides optimal configuration for AI API routes with extended timeouts.

## Project Structure

```
├── app/                 # Next.js app directory
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and AI integration
├── public/             # Static assets
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## AI Integration

The application includes a complete AI backend powered by Groq:

- Centralized AI client configuration
- REST and streaming API endpoints
- React hooks for easy client-side integration
- Configurable models and generation options

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
