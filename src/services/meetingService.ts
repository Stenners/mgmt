import { db } from '../config/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { MeetingNote } from '../types/meeting';

export const createMeetingNote = async (meetingNote: Omit<MeetingNote, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const userDocRef = doc(db, 'users', meetingNote.createdBy);
    const meetingNotesCollectionRef = collection(userDocRef, 'meetingNotes');
    
    const docRef = await addDoc(meetingNotesCollectionRef, {
      ...meetingNote,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      date: Timestamp.fromDate(meetingNote.date)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating meeting note:', error);
    throw error;
  }
};

export const getMeetingNotes = async (userId: string): Promise<MeetingNote[]> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const meetingNotesQuery = query(
      collection(userDocRef, 'meetingNotes'),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(meetingNotesQuery);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as MeetingNote[];
  } catch (error) {
    console.error('Error fetching meeting notes:', error);
    throw error;
  }
};

export const updateMeetingNote = async (id: string, updates: Partial<MeetingNote>, userId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const meetingDocRef = doc(collection(userDocRef, 'meetingNotes'), id);
    
    await updateDoc(meetingDocRef, {
      ...updates,
      updatedAt: Timestamp.now(),
      ...(updates.date && { date: Timestamp.fromDate(updates.date) })
    });
  } catch (error) {
    console.error('Error updating meeting note:', error);
    throw error;
  }
};

export const generateAiSummary = async (notes: string): Promise<{ summary: string; insights: string }> => {
  // This would be your AI service integration
  // For now, returning mock data
  return {
    summary: 'AI-generated summary will appear here',
    insights: 'AI-generated insights will appear here'
  };
};

export const deleteMeetingNote = async (id: string, userId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const meetingDocRef = doc(collection(userDocRef, 'meetingNotes'), id);
    await deleteDoc(meetingDocRef);
  } catch (error) {
    console.error('Error deleting meeting note:', error);
    throw error;
  }
}; 