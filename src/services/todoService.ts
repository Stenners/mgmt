import { db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, writeBatch } from 'firebase/firestore';
import { Todo } from '../types/todo';

export const createTodo = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const userDocRef = doc(db, 'users', todo.createdBy);
    const todosCollectionRef = collection(userDocRef, 'todos');
    
    // Get the highest order number
    const todosQuery = query(todosCollectionRef, orderBy('order', 'desc'), where('completed', '==', false));
    const snapshot = await getDocs(todosQuery);
    const highestOrder = snapshot.empty ? 0 : snapshot.docs[0].data().order || 0;
    
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
    const todosQuery = query(
      collection(userDocRef, 'todos'),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(todosQuery);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      ...(doc.data().dueDate && { dueDate: doc.data().dueDate.toDate() })
    })) as Todo[];
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