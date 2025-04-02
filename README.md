# AI-Powered Resume Builder

A modern web application that helps users create professional resumes with AI-powered suggestions and optimizations.

## Features

- User authentication and profile management
- Multiple professional resume templates
- Drag-and-drop resume section management
- AI-powered content suggestions and improvements
- ATS optimization recommendations
- Cover letter generation
- PDF/DOCX export
- Resume sharing and analytics

## Technology Stack

- Frontend: React.js with Tailwind CSS/Material UI
- Backend: Node.js with Express.js
- Database: MongoDB
- AI Features: OpenAI API
- File Handling: react-pdf/puppeteer
- State Management: Redux/React Context API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-resume-builder.git
cd ai-resume-builder
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-builder
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile

### Resumes
- GET `/api/resumes` - Get all resumes for a user
- GET `/api/resumes/:id` - Get a single resume
- POST `/api/resumes` - Create a new resume
- PUT `/api/resumes/:id` - Update a resume
- DELETE `/api/resumes/:id` - Delete a resume
- PATCH `/api/resumes/:id/toggle-public` - Toggle resume public status
- GET `/api/resumes/public/:id` - Get public resume by ID

### AI Features
- POST `/api/ai/suggestions` - Get AI suggestions for resume content
- POST `/api/ai/optimize` - Optimize resume for ATS
- POST `/api/ai/cover-letter` - Generate cover letter

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the AI capabilities
- MongoDB Atlas for database hosting
- React.js and Node.js communities for the amazing tools and libraries 