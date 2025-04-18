import { useState, useEffect } from 'react';
import { title as titleStyle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useAuth } from '@/contexts/AuthContext';
import { Todo } from '@/types/todo';
import { createTodo, getTodos, updateTodo, deleteTodo } from '@/services/todoService';
import { button as buttonStyles } from "@heroui/theme";
import { Modal } from '@/components/Modal';
import { Todo as TodoComponent } from '@/components/Todo';
import { SkeletonCard } from '@/components/SkeletonCard';

const TodosPage = () => {
  const { userData } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('medium');

  // Filter todos
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    if (userData?.id) {
      loadTodos(userData.id);
    } else {
      setLoading(false);
    }
  }, [userData]);

  const loadTodos = async (userId: string) => {
    try {
      const fetchedTodos = await getTodos(userId);
      setTodos(fetchedTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async () => {
    if (!userData?.organisations[0] || !userData?.id) return;

    const newTodo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      description,
      completed: false,
      createdBy: userData.id,
      organisationId: userData.organisations[0],
      order: activeTodos.length + 1,
      ...(dueDate && { dueDate: new Date(dueDate) }),
      priority
    };

    try {
      await createTodo(newTodo);
      loadTodos(userData.id);
      clearForm();
      setIsNewTodoModalOpen(false);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleUpdateTodo = async () => {
    if (!userData?.id || !selectedTodo) return;

    const updates: Partial<Todo> = {
      title,
      description,
      ...(dueDate && { dueDate: new Date(dueDate) }),
      priority
    };

    try {
      await updateTodo(selectedTodo.id, updates, userData.id);
      loadTodos(userData.id);
      clearForm();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleToggleTodo = async (id: string) => {
    if (!userData?.id) return;
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      await updateTodo(id, { completed: !todo.completed }, userData.id);
      loadTodos(userData.id);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!userData?.id) return;

    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(id, userData.id);
        loadTodos(userData.id);
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || '');
    setDueDate(todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '');
    setPriority(todo.priority || 'medium');
    setIsEditModalOpen(true);
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setSelectedTodo(null);
  };

  if (!userData?.id || !userData?.organisations[0]) {
    return (
      <DefaultLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            Please complete your profile setup to access todos.
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className={titleStyle()}>Todos</h2>
          {userData?.id && (
            <button
              onClick={() => setIsNewTodoModalOpen(true)}
              className={buttonStyles({
                color: "primary",
                radius: "md",
                variant: "shadow"
              })}
            >
              New Todo
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : !userData?.id ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Welcome to Todos</h3>
            <p className="mt-2 text-sm text-gray-500">Sign in to start managing your tasks</p>
          </div>
        ) : (
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Active</h3>
              {activeTodos.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-500">No active todos</p>
                  <button
                    onClick={() => setIsNewTodoModalOpen(true)}
                    className={`${buttonStyles({
                      color: "primary",
                      radius: "md",
                      variant: "light"
                    })} mt-4`}
                  >
                    Create Todo
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeTodos.map(todo => (
                    <TodoComponent
                      key={todo.id}
                      todo={todo}
                      onToggle={handleToggleTodo}
                      onDelete={handleDeleteTodo}
                      onEdit={handleEditTodo}
                    />
                  ))}
                </div>
              )}
            </section>

            {completedTodos.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Completed ({completedTodos.length})
                  </h3>
                  <button
                    onClick={() => setShowCompleted(!showCompleted)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {showCompleted ? 'Hide' : 'Show'}
                  </button>
                </div>
                {showCompleted && (
                  <div className="space-y-4">
                    {completedTodos.map(todo => (
                      <TodoComponent
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onDelete={handleDeleteTodo}
                        onEdit={handleEditTodo}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* New Todo Modal */}
        <Modal
          isOpen={isNewTodoModalOpen}
          onClose={() => {
            setIsNewTodoModalOpen(false);
            clearForm();
          }}
          title="New Todo"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={priority || 'medium'}
                onChange={(e) => setPriority(e.target.value as Todo['priority'])}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsNewTodoModalOpen(false);
                  clearForm();
                }}
                className={buttonStyles({
                  color: "default",
                  radius: "md",
                  variant: "light"
                })}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTodo}
                className={buttonStyles({
                  color: "primary",
                  radius: "md",
                  variant: "shadow"
                })}
              >
                Create Todo
              </button>
            </div>
          </div>
        </Modal>

        {/* Edit Todo Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            clearForm();
          }}
          title="Edit Todo"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={priority || 'medium'}
                onChange={(e) => setPriority(e.target.value as Todo['priority'])}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  clearForm();
                }}
                className={buttonStyles({
                  color: "default",
                  radius: "md",
                  variant: "light"
                })}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTodo}
                className={buttonStyles({
                  color: "primary",
                  radius: "md",
                  variant: "shadow"
                })}
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default TodosPage; 