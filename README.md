# AI ToDo List Application

A modern, full-stack ToDo List application built with Node.js, Express, and Tailwind CSS. Tasks are stored server-side in a JSON file, providing persistence across sessions.

**Repository**: [Practice-AI_ZNTU_ToDoList](https://github.com/Alekperov-Vitalii/Practice-AI_ZNTU_ToDoList)

## ✨ Features

- **Add Tasks**: Create new tasks with a clean, intuitive interface
- **Mark as Completed**: Toggle task completion status with visual feedback
- **Delete Tasks**: Remove tasks with a single click
- **Real-time Statistics**: View total, completed, and pending task counts
- **Responsive Design**: Beautiful UI that works on desktop and mobile
- **Server-side Storage**: Tasks persist in a JSON file on the server
- **Modern UI**: Built with Tailwind CSS for a professional look
- **Toast Notifications**: User-friendly feedback for all actions
- **Loading States**: Smooth loading indicators for better UX

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alekperov-Vitalii/Practice-AI_ZNTU_ToDoList.git
   cd Practice-AI_ZNTU_ToDoList
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # For production
   npm start
   
   # For development (with auto-restart)
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3003`

## 📁 Project Structure

```
Practice-AI_ZNTU_ToDoList/
├── server.js              # Main server file with Express setup
├── package.json           # Project dependencies and scripts
├── README.md             # This file
├── .gitignore            # Git ignore rules
├── public/               # Frontend files
│   ├── index.html        # Main HTML page
│   └── app.js           # Frontend JavaScript
└── data/                # Data storage (created automatically)
    └── todos.json       # Tasks stored as JSON
```

## 🔧 API Endpoints

The application provides a RESTful API for managing todos:

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo (mark as completed/uncompleted)
- `DELETE /api/todos/:id` - Delete a todo

## 🎨 Features in Detail

### Task Management
- **Add Tasks**: Type in the input field and press Enter or click "Add Task"
- **Complete Tasks**: Click the checkbox icon to mark tasks as completed
- **Delete Tasks**: Click the trash icon to remove tasks
- **Visual Feedback**: Completed tasks are struck through and dimmed

### User Interface
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Animations**: Smooth transitions and hover effects
- **Statistics**: Real-time counters for total, completed, and pending tasks
- **Empty State**: Friendly message when no tasks exist

### Data Persistence
- **Server Storage**: Tasks are stored in `data/todos.json`
- **Automatic Backup**: Data persists between server restarts
- **JSON Format**: Human-readable data storage

## 🛠️ Customization

### Changing the Port
Edit `server.js` and modify the PORT variable:
```javascript
const PORT = process.env.PORT || 3003; // Change 3003 to your preferred port
```

### Database Integration
To use a database instead of file storage, you can modify the `readTodos()` and `writeTodos()` functions in `server.js` to connect to your preferred database (MongoDB, PostgreSQL, etc.).

### Styling
The application uses Tailwind CSS. You can customize the design by modifying the classes in `public/index.html` or adding custom CSS.

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `server.js` or kill the process using the current port

2. **Cannot access the application**
   - Ensure the server is running (`npm start`)
   - Check that you're accessing `http://localhost:3003`

3. **Tasks not saving**
   - Check that the `data` directory has write permissions
   - Verify the server has proper file system access

### Development Mode
For development with auto-restart on file changes:
```bash
npm run dev
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Built with ❤️ using Node.js, Express, and Tailwind CSS**
