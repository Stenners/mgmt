import { db } from '../config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, Timestamp, writeBatch } from 'firebase/firestore';
import { Todo } from '../types/todo';

export const createTodo = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const userDocRef = doc(db, 'users', todo.createdBy);
    const todosCollectionRef = collection(userDocRef, 'todos');
    
    // Get all todos and find the highest order number in memory
    const snapshot = await getDocs(todosCollectionRef);
    const todos = snapshot.docs.map(doc => doc.data());
    const activeTodos = todos.filter(t => !t.completed);
    const highestOrder = activeTodos.length > 0 
      ? Math.max(...activeTodos.map(t => t.order || 0))
      : 0;
    
    const docRef = await addDoc(todosCollectionRef, {
      ...todo,
      order: highestOrder + 1,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      ...(todo.dueDate && { dueDate: Timestamp.fromDate(todo.dueDate) })
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

export const getTodos = async (userId: string): Promise<Todo[]> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const todosCollectionRef = collection(userDocRef, 'todos');
    const querySnapshot = await getDocs(todosCollectionRef);
    
    const todos = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      ...(doc.data().dueDate && { dueDate: doc.data().dueDate.toDate() })
    })) as Todo[];

    // Sort in memory
    return todos.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const updateTodo = async (id: string, updates: Partial<Todo>, userId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const todoDocRef = doc(collection(userDocRef, 'todos'), id);
    
    await updateDoc(todoDocRef, {
      ...updates,
      updatedAt: Timestamp.now(),
      ...(updates.dueDate && { dueDate: Timestamp.fromDate(updates.dueDate) })
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const reorderTodos = async (userId: string, reorderedTodos: { id: string; order: number }[]) => {
  try {
    const batch = writeBatch(db);
    const userDocRef = doc(db, 'users', userId);

    reorderedTodos.forEach(({ id, order }) => {
      const todoRef = doc(collection(userDocRef, 'todos'), id);
      batch.update(todoRef, { order, updatedAt: Timestamp.now() });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error reordering todos:', error);
    throw error;
  }
};

export const deleteTodo = async (id: string, userId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const todoDocRef = doc(collection(userDocRef, 'todos'), id);
    await deleteDoc(todoDocRef);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}; 