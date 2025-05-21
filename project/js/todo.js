/**
 * Todo List Functionality
 * Handles adding, completing, and removing todo items
 * Includes filtering and local storage persistence
 */
export function initTodoList() {
  // DOM elements
  const todoForm = document.getElementById('todoForm');
  const todoInput = document.getElementById('todoInput');
  const todoList = document.getElementById('todoList');
  const todoCount = document.getElementById('todoCount');
  const clearCompletedBtn = document.getElementById('clearCompleted');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  // Check if elements exist
  if (!todoForm || !todoInput || !todoList || !todoCount || !clearCompletedBtn) return;
  
  // Current filter ('all', 'active', 'completed')
  let currentFilter = 'all';
  
  // Initialize todos from localStorage or empty array
  let todos = getTodosFromStorage();
  
  // Render initial todos
  renderTodos();
  
  // Add new todo
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const todoText = todoInput.value.trim();
    
    if (todoText !== '') {
      addTodo(todoText);
      todoInput.value = '';
      todoInput.focus();
    } else {
      // Shake the input to indicate error
      todoInput.classList.add('animate-shake');
      setTimeout(() => {
        todoInput.classList.remove('animate-shake');
      }, 500);
    }
  });
  
  // Clear completed todos
  clearCompletedBtn.addEventListener('click', () => {
    clearCompletedTodos();
  });
  
  // Filter todos
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      // Update active filter button
      filterBtns.forEach(btn => btn.classList.remove('active'));
      btn.classList.add('active');
      
      // Update filter and render
      currentFilter = filter;
      renderTodos();
    });
  });
  
  /**
   * Add a new todo
   * @param {string} text - The todo text
   */
  function addTodo(text) {
    const newTodo = {
      id: Date.now().toString(),
      text: text,
      completed: false,
      createdAt: new Date()
    };
    
    todos.unshift(newTodo);
    saveTodosToStorage();
    renderTodos();
    
    // Highlight the new todo with animation
    setTimeout(() => {
      const newTodoElement = document.querySelector('.todo-item');
      if (newTodoElement) {
        newTodoElement.classList.add('animate-slide-up');
        setTimeout(() => {
          newTodoElement.classList.remove('animate-slide-up');
        }, 500);
      }
    }, 10);
  }
  
  /**
   * Toggle todo completion status
   * @param {string} id - The todo ID
   */
  function toggleTodo(id) {
    todos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    
    saveTodosToStorage();
    renderTodos();
  }
  
  /**
   * Delete a todo
   * @param {string} id - The todo ID
   */
  function deleteTodo(id) {
    // Find the todo element
    const todoElement = document.querySelector(`[data-id="${id}"]`);
    
    if (todoElement) {
      // Add removing animation
      todoElement.classList.add('removing');
      
      // Wait for animation to complete before removing from array
      setTimeout(() => {
        todos = todos.filter(todo => todo.id !== id);
        saveTodosToStorage();
        renderTodos();
      }, 300);
    } else {
      // If element not found, just remove from array
      todos = todos.filter(todo => todo.id !== id);
      saveTodosToStorage();
      renderTodos();
    }
  }
  
  /**
   * Clear all completed todos
   */
  function clearCompletedTodos() {
    // Get IDs of completed todos
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);
    
    // Apply animation to each completed todo
    completedIds.forEach(id => {
      const todoElement = document.querySelector(`[data-id="${id}"]`);
      if (todoElement) {
        todoElement.classList.add('removing');
      }
    });
    
    // Wait for animation to complete before removing from array
    setTimeout(() => {
      todos = todos.filter(todo => !todo.completed);
      saveTodosToStorage();
      renderTodos();
    }, 300);
  }
  
  /**
   * Render todos based on current filter
   */
  function renderTodos() {
    // Clear the list
    todoList.innerHTML = '';
    
    // Filter todos based on current filter
    const filteredTodos = todos.filter(todo => {
      if (currentFilter === 'active') return !todo.completed;
      if (currentFilter === 'completed') return todo.completed;
      return true; // 'all' filter
    });
    
    // Check if we have todos to display
    if (filteredTodos.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.className = 'todo-item todo-empty';
      emptyMessage.textContent = currentFilter === 'all' 
        ? 'No tasks yet. Add one above!' 
        : `No ${currentFilter} tasks found.`;
      todoList.appendChild(emptyMessage);
    } else {
      // Create todo elements
      filteredTodos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.className = `todo-item ${todo.completed ? 'todo-completed' : ''}`;
        todoItem.setAttribute('data-id', todo.id);
        todoItem.setAttribute('draggable', 'true');
        
        // Checkbox for completion status
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));
        
        // Todo text
        const todoText = document.createElement('span');
        todoText.className = 'todo-text';
        todoText.textContent = todo.text;
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-delete';
        deleteBtn.textContent = '×';
        deleteBtn.setAttribute('aria-label', 'Delete task');
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteTodo(todo.id);
        });
        
        // Append elements to todo item
        todoItem.appendChild(checkbox);
        todoItem.appendChild(todoText);
        todoItem.appendChild(deleteBtn);
        
        // Append todo item to list
        todoList.appendChild(todoItem);
        
        // Add drag and drop functionality
        setupDragAndDrop(todoItem);
      });
    }
    
    // Update the count of active todos
    const activeTodosCount = todos.filter(todo => !todo.completed).length;
    todoCount.textContent = `${activeTodosCount} item${activeTodosCount !== 1 ? 's' : ''} left`;
  }
  
  /**
   * Set up drag and drop functionality for a todo item
   * @param {HTMLElement} todoItem - The todo item element
   */
  function setupDragAndDrop(todoItem) {
    todoItem.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', todoItem.getAttribute('data-id'));
      todoItem.classList.add('dragging');
    });
    
    todoItem.addEventListener('dragend', () => {
      todoItem.classList.remove('dragging');
    });
    
    todoItem.addEventListener('dragover', (e) => {
      e.preventDefault();
      todoItem.classList.add('drag-over');
    });
    
    todoItem.addEventListener('dragleave', () => {
      todoItem.classList.remove('drag-over');
    });
    
    todoItem.addEventListener('drop', (e) => {
      e.preventDefault();
      
      const draggedId = e.dataTransfer.getData('text/plain');
      const targetId = todoItem.getAttribute('data-id');
      
      if (draggedId !== targetId) {
        reorderTodos(draggedId, targetId);
      }
      
      todoItem.classList.remove('drag-over');
    });
  }
  
  /**
   * Reorder todos when a todo is dragged and dropped
   * @param {string} draggedId - The ID of the dragged todo
   * @param {string} targetId - The ID of the target todo
   */
  function reorderTodos(draggedId, targetId) {
    const draggedIndex = todos.findIndex(todo => todo.id === draggedId);
    const targetIndex = todos.findIndex(todo => todo.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Remove the dragged todo from the array
      const [draggedTodo] = todos.splice(draggedIndex, 1);
      
      // Insert it at the target position
      todos.splice(targetIndex, 0, draggedTodo);
      
      // Save and render
      saveTodosToStorage();
      renderTodos();
    }
  }
  
  /**
   * Save todos to localStorage
   */
  function saveTodosToStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  
  /**
   * Get todos from localStorage
   * @returns {Array} Array of todo objects
   */
  function getTodosFromStorage() {
    const storedTodos = localStorage.getItem('todos');
    
    if (storedTodos) {
      try {
        return JSON.parse(storedTodos);
      } catch (error) {
        console.error('Error parsing todos from localStorage:', error);
        return [];
      }
    }
    
    return [];
  }
}