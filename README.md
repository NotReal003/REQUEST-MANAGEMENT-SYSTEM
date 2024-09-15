# Request Management System

## Overview
This project is a fully functional request management system, including both backend and frontend components. It is designed for users to submit different types of requests such as Discord reports, support requests, and guild applications. Administrators can manage these requests with advanced control options.

The system uses React for the frontend and Node.js with MongoDB for the backend. Features include JWT-based authentication, email notifications, request status updates, and an admin dashboard for managing user requests.

## Key Features

### Frontend
- **Request Form Pages**: Submit various types of requests (Discord Report, Support, Guild Application).
- **Authentication**: JWT-based login/logout with dynamic status display in the navbar.
- **Admin Panel**: Admins can view, approve, reject, or cancel requests and leave review messages.
- **User Dashboard**: Users can view their request history and status updates.
- **Responsive Design**: Optimized for various devices using modern design practices.

### Backend
- **Request Routes**: Handles Support, Discord Report, Guild Application requests.
- **JWT Authentication**: Secure token-based access control.
- **Request Status**: Tracks requests with status updates (Approved, Denied, Cancelled, Pending) and review messages.
- **Admin Routes**: Admin-specific routes for managing requests and users.
- **Email Notifications**: Automatic notifications for request status updates.
- **IP Tracking**: Captures user IP addresses for security.

## Tech Stack

### Frontend
- **React**: For building the user interface.
- **React Router**: For navigation.
- **DaisyUI/TailwindCSS**: For UI components and styling.
- **Axios**: For API requests.
- **React-Icons**: For scalable icons.
- **React Toastify**: For notifications.

### Backend
- **Node.js**: Server-side runtime.
- **Express.js**: Web framework.
- **MongoDB**: NoSQL database.
- **JWT**: For authentication.
- **Nodemailer**: For sending emails.
- **Cloudflare Workers**: For hosting the backend API.

## Features Breakdown

### User Authentication
- **Login/Logout**: JWT-based authentication via Discord OAuth.
- **Protected Routes**: Restricted access to certain pages based on authentication.
- **Token Verification**: Validates JWT for secure access.

### Request Submission Forms
- **Forms**: For Discord reports, support requests, and guild applications.
- **Validation & Sanitization**: Ensures correct input and prevents malicious data.

### Admin Features
- **Request Management**: View, approve, reject, or cancel requests. Leave review messages.
- **User Management**: Block/unblock users.
- **Status Updates**: Admins can update request statuses and send notifications.

### Email Notifications
- **Auto-notifications**: Sends emails on request status updates.
- **Custom Messages**: Admins can include custom messages in notifications.

### Request History
- **User Dashboard**: View request history and status updates.
- **Admin Dashboard**: Manage requests and user actions.

## Backend API Endpoints

### User Authentication
- **POST `/auth/login`**: Login and return JWT token.
- **GET `/users/@me`**: Get current user details.
- **POST `/auth/signout`**: Logout user.

### Requests
- **POST `/requests/report`**: Submit a Discord report request.
- **POST `/requests/support`**: Submit a support request.
- **POST `/requests/guild-application`**: Submit a guild application request.
- **GET `/requests`**: Get all requests for the current user.
- **PUT `/requests/:requestId`**: Update request status (Admin only).

### Admin Routes
- **GET `/admin/requests`**: Get all submitted requests.
- **PUT `/admin/requests/:id`**: Update request status.
- **DELETE `/admin/requests/:id`**: Delete a request.
- **PUT `/admin/users/block`**: Block a user.
- **PUT `/admin/users/unblock`**: Unblock a user.

## Installation

### Prerequisites
- Node.js and npm installed.
- MongoDB Atlas or local MongoDB setup.
- (Opt) Cloudflare Workers account for backend hosting.

### Frontend Setup
1. Clone the repository:  
   `git clone https://github.com/yourusername/repo.git`
2. Install dependencies:  
   `npm install`
3. Create a `.env` file and add your API URL:  
REACT_APP_API=your_api_url
CI=false
4. Start the React app:  
`npm start` for build `npm run build` (output will be /build)

### Backend Setup
1. Clone the repository:  
`git clone https://github.com/yourrepo/backend.git`
2. Install dependencies:  
`npm install`
3. Configure environment variables:
MONGODB_URI=mongodb+srv://username
@cluster.mongodb.net/database JWT_SECRET=your_jwt_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=callback_url
DISCORD_WEBHOOK_URL=first_request_route_webhookurl
DISCORD_WEBHOOK_URL1=second_request_route_webhookurl
EMAIL=email
EPASS=email_password
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_uri
NODE_ENV=production
SESSION_SECRET=...
WEB_TOKEN=an_webhook_url(please test it)
USER_AUTH_WEBTOKEN=user_auth_webhookurl

4. Start the backend server:  
`node index.js`

## Usage

### User Actions
1. **Login**: Authenticate via Discord OAuth.
2. **Submit Request**: Fill out and submit request forms.
3. **View Requests**: Check request history and status updates.
4. **Email Notifications**: Receive email updates on request status.

### Admin Actions
1. **Manage Requests**: Approve, reject, or cancel requests. Leave review messages.
2. **Review Messages**: Admins can add messages visible to users.
3. **User Management**: Block/unblock users as needed.
4. **Request Status**: Update request statuses directly from the dashboard.

## Security
- **JWT Authentication**: Secures routes and user access.
- **Sanitization**: Prevents malicious input.
- **IP Logging**: Tracks user IP addresses for security.

## Conclusion
This request management system offers a comprehensive solution for handling user-submitted requests with robust administrative control and security features. Ideal for businesses or projects needing detailed request tracking and management.

For further details, customization, or support, please refer to the documentation or contact the developer.
