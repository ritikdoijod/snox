# [Snox - Task Management App](https://snox.onrender.com)

## Description
Snox is a modern task management application designed to help users efficiently create, manage, and track their tasks. Built with a cutting-edge tech stack, it offers a responsive user interface and a robust backend to ensure secure and efficient task handling. Whether you're organizing personal to-dos or managing team projects, Snox provides the tools you need to stay organized and productive.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation
To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ritikdoijod/snox.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd snox
   ```

3. **Server setup:**

   1. **Navigate to the server directory:**
      ```bash
      cd server
      ```

   2. **Install dependencies:**
      ```bash
      npm install
      ```

   3. **Set up environment variables:**
      
      Create a `.env` file. `.env.example` available for reference.
   
   4. **Start project:**
      
      ```bash
      npm run dev
      ```

4. **Webapp setup:**

   1. **Navigate to the webapp directory:**
      ```bash
      cd webapp
      ```

   2. **Install dependencies:**
      ```bash
      npm install
      ```

   3. **Set up environment variables:**
      
      Create a `.env` file. `.env.example` available for reference.
   
   4. **Start project:**
      
      ```bash
      npm run dev
      ```
## Usage
- Access the frontend at `http://localhost:5173` (assuming it runs on port 5173).
- Use the application to:
  - Create new tasks
  - View, update, or delete existing tasks
  - Assign tasks to users or categories
  - Set deadlines and receive reminders
- The backend API is available at `http://localhost:8080` (assuming Hono.js runs on port 8080), but you typically interact with it through the frontend.

## Features
Snox offers a range of features to enhance task management:
- **User Authentication**: Secure login and registration for users. It also supports Google OAuth Sign In.
- **Task CRUD Operations**: Create, read, update, and delete tasks.
- **Task Assignment**: Assign tasks to specific users with due dates and priorites.
- **Secure Data Storage**: Tasks are stored securely using MongoDB.

## Technologies
Snox is built with a modern and efficient tech stack:
- **Backend**:
  - [Node.js](https://nodejs.org/): Runtime environment for the server.
  - [Hono.js](https://hono.dev/): A lightweight, ultrafast web framework for building APIs.
  - [MongoDB](https://www.mongodb.com/): A flexible and scalable NoSQL database for storing task data.
- **Frontend**:
  - [React](https://react.dev/): A powerful library for building user interfaces.
  - [React Router 7](https://reactrouter.com/): Handles client-side routing for seamless navigation.
  - [Shadcn UI](https://ui.shadcn.com/): A beautifully designed UI component library for React, built on Radix UI and Tailwind CSS.
  - [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid and customizable styling.

## Contributing
Contributions are welcome! To contribute to this project:

1. Fork the repository.
2. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request against the main branch.

**Note:** Before contributing, review the project's [CONTRIBUTING.md](CONTRIBUTING.md) file (if available) for additional guidelines.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For questions, feedback, or collaboration opportunities, reach out to:

- GitHub: [ritikdoijod](https://github.com/ritikdoijod)
- Email: [ritikdoijod@gmail.com](mailto:ritikdoijod@gmail.com)