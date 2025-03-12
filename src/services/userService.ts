import { db } from '../config/firebase';
import { doc, getDoc, setDoc, Timestamp, collection } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { UserData } from '../types/user';
import { Organisation } from '../types/organisation';

export const createOrUpdateUser = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const userData: UserData = {
    id: user.uid,
    email: user.email,
    displayName: user.displayName,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    organisations: [],
  };

  try {
    await setDoc(userRef, {
      ...userData,
      createdAt: Timestamp.fromDate(userData.createdAt),
      lastLoginAt: Timestamp.fromDate(userData.lastLoginAt),
    }, { merge: true });
    return userData;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
};

const fetchOrganisationData = async (organisationId: string): Promise<Organisation | null> => {
  console.log('Fetching organisation data for:', organisationId);
  const orgRef = doc(db, 'organisations', organisationId);
  try {
    const orgSnap = await getDoc(orgRef);
    if (orgSnap.exists()) {
      const data = orgSnap.data();
      return {
        ...data,
        id: orgSnap.id,
        createdAt: data.createdAt.toDate(),
      } as Organisation;
    }
    return null;
  } catch (error) {
    console.error('Error fetching organisation:', error);
    return null;
  }
};

export const getUserData = async (userId: string): Promise<UserData | null> => {
  const userRef = doc(db, 'users', userId);
  
  try {
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      const userData = {
        ...data,
        id: userSnap.id,
        createdAt: data.createdAt.toDate(),
        lastLoginAt: data.lastLoginAt.toDate(),
        organisations: data.organisations || [],
      } as UserData;

      // Fetch organisation data for each organisation the user belongs to
      if (userData.organisations && userData.organisations.length > 0) {
        const organisationsData = await Promise.all(
          userData.organisations.map(orgId => fetchOrganisationData(orgId))
        );
        
        // Filter out any null values and assign to userData
        userData.organisationsData = organisationsData.filter((org): org is Organisation => org !== null);
      }

      return userData;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}; 