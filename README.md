# Meeting Management System

A modern web application for managing meetings, todos, and team collaboration. Built with React, TypeScript, and Firebase.

## Features

### Meeting Notes
- Create and manage detailed meeting notes
- Track attendees, action items, and key discussion points
- AI-powered meeting summaries and insights
- Edit and delete meeting records
- Real-time updates and collaboration

### Todo Management
- Create, edit, and delete todos
- Set priority levels (high, medium, low)
- Add due dates and descriptions
- Mark todos as complete
- Drag-and-drop reordering
- Separate views for active and completed todos

### User Management
- Secure authentication
- Organization-based access control
- User profiles and preferences

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd mgmt
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Context
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS with custom components
- **Icons**: Custom icon components

## Project Structure

```
src/
├── components/        # Reusable UI components
├── contexts/         # React context providers
├── layouts/          # Page layouts
├── pages/           # Main application pages
├── services/        # Firebase and API services
├── types/           # TypeScript type definitions
└── utils/           # Helper functions and utilities
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

