# AI Resume Builder

A modern resume builder application with AI-powered suggestions and multiple template options.

## Project Structure

```
ai-resume-builder/
├── frontend/           # React frontend application
│   ├── src/           # Source files
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   └── store/        # Redux store and slices
│   └── public/        # Public assets
│
└── backend/           # Node.js backend application
    ├── src/          # Source files
    │   ├── controllers/  # Route controllers
    │   ├── models/      # Database models
    │   └── routes/      # API routes
    └── config/       # Configuration files
```

## Features

- AI-powered resume suggestions
- Multiple professional templates
- Real-time preview
- Export to PDF
- Responsive design
- User authentication
- Profile management

## Tech Stack

### Frontend
- React.js
- Material-UI
- Redux Toolkit
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Getting Started

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
npm install
npm start
```

## Environment Variables

Create `.env` files in both frontend and backend directories:

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

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