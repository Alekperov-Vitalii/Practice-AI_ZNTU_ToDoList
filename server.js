const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;
const DATA_FILE = path.join(__dirname, 'data', 'todos.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
async function ensureDataDirectory() {
    try {
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    } catch (error) {
        console.error('Error creating data directory:', error);
    }
}

// Read todos from file
async function readTodos() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error('Error reading todos:', error);
        return [];
    }
}

// Write todos to file
async function writeTodos(todos) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
    } catch (error) {
        console.error('Error writing todos:', error);
        throw error;
    }
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// API Routes

// GET /api/todos - Get all todos
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await readTodos();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

// POST /api/todos - Create new todo
app.post('/api/todos', async (req, res) => {
    try {
        const { text, location, time, deadline, notes, isExtended } = req.body;
        
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Todo text is required' });
        }

        const todos = await readTodos();
        const newTodo = {
            id: generateId(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
            isExtended: isExtended || false,
            location: location || null,
            time: time || null,
            deadline: deadline || null,
            notes: notes || null
        };

        todos.push(newTodo);
        await writeTodos(todos);

        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// PUT /api/todos/:id - Update todo
app.put('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed, text, location, time, deadline, notes, isExtended } = req.body;

        const todos = await readTodos();
        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        // Update fields if provided
        if (completed !== undefined) todos[todoIndex].completed = completed;
        if (text !== undefined) todos[todoIndex].text = text;
        if (location !== undefined) todos[todoIndex].location = location;
        if (time !== undefined) todos[todoIndex].time = time;
        if (deadline !== undefined) todos[todoIndex].deadline = deadline;
        if (notes !== undefined) todos[todoIndex].notes = notes;
        if (isExtended !== undefined) todos[todoIndex].isExtended = isExtended;

        todos[todoIndex].updatedAt = new Date().toISOString();

        await writeTodos(todos);
        res.json(todos[todoIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

// DELETE /api/todos/:id - Delete todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todos = await readTodos();
        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        const deletedTodo = todos.splice(todoIndex, 1)[0];
        await writeTodos(todos);

        res.json({ message: 'Todo deleted successfully', deletedTodo });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize server
async function startServer() {
    await ensureDataDirectory();
    
    app.listen(PORT, () => {
        console.log(`🚀 ToDo List server running on http://localhost:${PORT}`);
        console.log(`📁 Data stored in: ${DATA_FILE}`);
    });
}

startServer().catch(console.error); 