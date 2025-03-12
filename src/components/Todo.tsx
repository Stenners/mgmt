import React, { useState, useEffect } from 'react';
import { Todo as TodoType } from '../types/todo';
import { PencilIcon, TrashIcon } from './icons/index';

interface TodoProps {
  todo: TodoType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: TodoType) => void;
}

export const Todo: React.FC<TodoProps> = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit
}) => {
  const [isChecked, setIsChecked] = useState(todo.completed);

  useEffect(() => {
    setIsChecked(todo.completed);
  }, [todo.completed]);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onToggle(todo.id);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
          className="w-5 h-5 cursor-pointer transition-opacity"
        />
        <div className="ml-4 flex-1">
          <h3 className={`text-lg font-medium ${isChecked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`mt-1 text-sm ${isChecked ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}
          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
            {todo.dueDate && (
              <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
            )}
            {todo.priority && (
              <span className={`px-2 py-1 rounded-full text-xs ${
                todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(todo)}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          title="Edit todo"
        >
          <PencilIcon />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
          title="Delete todo"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}; 