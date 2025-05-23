# Opus

**Opus** is a progressive web application (PWA) designed to reduce excessive screen time and promote daily well-being through personalized and collaborative task management. Built with persuasive technology principles, Opus encourages users to engage in meaningful activities based on their interests and social connections.

## Features

- 🔄 **Daily Personalized Tasks**: Automatically generates 3 daily tasks tailored to each user's interests.
- 👥 **Friend System**: Connect with friends to collaborate on tasks and share progress.
- 🤝 **Collaborative Tasks**: Create and join group tasks involving 2–20 users to stay motivated together.
- ✍️ **Custom Tasks and Interests**: Add your own tasks and define interests to personalize your experience further.
- 🖼️ **Posts with Photos**: Share your task completions or moments through image-based posts.
- 💬 **Comment & Reply System**: Engage with friends by commenting and replying to posts.
- 🔔 **Notification System**: Stay updated with task reminders, friend requests, and post interactions.
- 🎨 **Custom Themes**: Personalize your app experience with theme settings.
- 🌐 **Discover Page**: Explore public interests and browse related user posts.

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Prisma, PostgreSQL
- **Authentication**: JWT-based auth system
- **Hosting**: Vercel (frontend), Railway (backend + database)
- **Other**: PWA features, responsive design, REST API

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (or a Railway account)
- Yarn or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/opus.git
   cd opus

   ```

2. Install dependencies:

npm install

# or

yarn install

3. Set up your environment variables:

Create a .env file based on .env.example and fill in the required values.

4. Run the development server:

npm run dev

# or

yarn dev

### Building for Production

npm run build
npm start

### Project Structure

/client # React frontend
/server # Node.js backend with Prisma
/prisma # Prisma schema and migrations
/public # Static assets

### Contributing

As this is a final-year university project, contributions are currently not open. However, feedback is welcome.

Author
[James Palmer-Moore] – Final Year Software Engineering Student
