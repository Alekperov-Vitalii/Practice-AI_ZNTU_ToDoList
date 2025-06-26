class TodoApp {
    constructor() {
        this.todos = [];
        this.apiBase = '/api/todos';
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadTodos();
    }

    bindEvents() {
        // Form submission
        document.getElementById('todoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // Enter key on input
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addTodo();
            }
        });
    }

    async loadTodos() {
        this.showLoading(true);
        try {
            const response = await fetch(this.apiBase);
            if (!response.ok) throw new Error('Failed to fetch todos');
            
            this.todos = await response.json();
            this.renderTodos();
            this.updateStats();
        } catch (error) {
            console.error('Error loading todos:', error);
            this.showToast('Error loading tasks', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();
        
        if (!text) return;

        try {
            const response = await fetch(this.apiBase, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error('Failed to add todo');
            
            const newTodo = await response.json();
            this.todos.push(newTodo);
            this.renderTodos();
            this.updateStats();
            
            input.value = '';
            this.showToast('Task added successfully!', 'success');
        } catch (error) {
            console.error('Error adding todo:', error);
            this.showToast('Error adding task', 'error');
        }
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        try {
            const response = await fetch(`${this.apiBase}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !todo.completed })
            });

            if (!response.ok) throw new Error('Failed to update todo');
            
            const updatedTodo = await response.json();
            const index = this.todos.findIndex(t => t.id === id);
            this.todos[index] = updatedTodo;
            
            this.renderTodos();
            this.updateStats();
            
            const message = updatedTodo.completed ? 'Task completed!' : 'Task marked as pending';
            this.showToast(message, 'success');
        } catch (error) {
            console.error('Error updating todo:', error);
            this.showToast('Error updating task', 'error');
        }
    }

    async deleteTodo(id) {
        try {
            const response = await fetch(`${this.apiBase}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete todo');
            
            this.todos = this.todos.filter(t => t.id !== id);
            this.renderTodos();
            this.updateStats();
            
            this.showToast('Task deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting todo:', error);
            this.showToast('Error deleting task', 'error');
        }
    }

    renderTodos() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');

        if (this.todos.length === 0) {
            todoList.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        
        todoList.innerHTML = this.todos
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(todo => this.createTodoElement(todo))
            .join('');
    }

    createTodoElement(todo) {
        const completedClass = todo.completed ? 'completed' : '';
        const checkboxIcon = todo.completed ? 'fas fa-check-square text-green-500' : 'far fa-square text-gray-400';
        
        return `
            <div class="todo-item fade-in p-4 hover:bg-gray-50 transition-all duration-200" data-id="${todo.id}">
                <div class="flex items-center gap-4">
                    <button 
                        onclick="todoApp.toggleTodo('${todo.id}')"
                        class="flex-shrink-0 w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-200"
                    >
                        <i class="${checkboxIcon} text-lg"></i>
                    </button>
                    
                    <div class="flex-1 min-w-0">
                        <p class="text-gray-800 font-medium ${completedClass} break-words">
                            ${this.escapeHtml(todo.text)}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                            Created: ${new Date(todo.createdAt).toLocaleString()}
                            ${todo.updatedAt ? `• Updated: ${new Date(todo.updatedAt).toLocaleString()}` : ''}
                        </p>
                    </div>
                    
                    <button 
                        onclick="todoApp.deleteTodo('${todo.id}')"
                        class="flex-shrink-0 text-red-500 hover:text-red-700 hover:scale-110 transition-all duration-200 p-2"
                        title="Delete task"
                    >
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');

        if (show) {
            loading.classList.remove('hidden');
            todoList.classList.add('hidden');
            emptyState.classList.add('hidden');
        } else {
            loading.classList.add('hidden');
            todoList.classList.remove('hidden');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        // Update toast content and style
        toastMessage.textContent = message;
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50 flex items-center gap-2 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        
        // Show toast
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
}); 