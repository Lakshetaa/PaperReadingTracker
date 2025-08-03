[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/MrnbppCd)
=======
# Paper Reading Tracker

A full-stack web application for students to track their academic paper reading progress. Built with Next.js, MongoDB, and a custom authentication system.

## Features

- **User Authentication**: Custom session-based authentication with signed cookies
- **Paper Management**: Add, edit, delete, and track reading progress
- **Dashboard**: Personal dashboard showing your papers
- **Public Feed**: View all papers from all users on the home page
- **Profile**: View your statistics and account information
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript
- **Styling**: Plain CSS
- **Authentication**: Custom session-based authentication with signed cookies
- **Database**: MongoDB Atlas with Mongoose ODM
- **Rendering**: Server-Side Rendering (SSR) only
- **Forms**: Native HTML forms with server-side processing

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd paper-reading-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection String
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/paper-tracker
   
   # Authentication Secret (generate a random string)
   AUTH_SECRET=your-secret-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Registration
1. Click "Register" in the navigation
2. Fill in your name, email, and password
3. Submit the form to create your account

### Adding Papers
1. Login to your account
2. Click "Add Paper" in the navigation
3. Fill in the paper details:
   - Title (required)
   - Authors (required)
   - Link (optional)
   - Status (To Read/Reading/Completed)
   - Notes (optional)
4. Submit to add the paper to your dashboard

### Managing Papers
- **View**: See all your papers on the dashboard
- **Edit**: Click "Edit" to modify paper details
- **Delete**: Click "Delete" to remove papers
- **Status**: Update reading progress as you go

## Project Structure

```
paper-reading-tracker/
├── app/                    # Next.js App Router pages
│   ├── components/         # Reusable components
│   ├── dashboard/          # User dashboard
│   ├── add/               # Add new paper
│   ├── edit/              # Edit papers
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── profile/           # User profile
│   └── globals.css        # Global styles
├── lib/                   # Utility functions
│   ├── mongodb.js         # Database connection
│   └── auth.js            # Authentication functions
├── models/                # Mongoose models
│   ├── User.js            # User model
│   └── Paper.js           # Paper model
├── pages/                 # API routes
│   └── api/               # API endpoints
└── public/                # Static assets
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Papers
- `GET /api/papers` - Get user's papers
- `POST /api/papers` - Create new paper
- `GET /api/papers/[id]` - Get specific paper
- `PUT /api/papers/[id]` - Update paper
- `DELETE /api/papers/[id]` - Delete paper

## Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Paper Model
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  authors: String,
  link: String,
  status: "To Read" | "Reading" | "Completed",
  notes: String,
  createdAt: Date
}
```

## Authentication System

The application uses a custom stateless authentication system:

- **Signed Cookies**: User data is stored in signed HTTP-only cookies
- **HMAC Verification**: Tokens are signed with HMAC-SHA256 for security
- **Automatic Expiry**: Tokens expire after 30 days
- **No Server Storage**: Completely stateless - no session storage needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
