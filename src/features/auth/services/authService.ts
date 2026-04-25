import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { AuthUser, UserRole } from "../types";

const USERS_COLLECTION = "users";

/**
 * Create user document in Firestore with role information
 */
export const createUserDocument = async (
  user: FirebaseUser,
  role: UserRole,
  displayName: string
) => {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const userDoc: AuthUser = {
    uid: user.uid,
    email: user.email,
    displayName: displayName || user.displayName,
    photoURL: user.photoURL,
    role,
    createdAt: new Date(),
  };

  await setDoc(userRef, userDoc);
  return userDoc;
};

/**
 * Get user document from Firestore
 */
export const getUserDocument = async (uid: string): Promise<AuthUser | null> => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
    } as AuthUser;
  }

  return null;
};

/**
 * Register a new user with email and password
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  role: UserRole
): Promise<AuthUser> => {
  try {
    // Create auth user
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // Update display name
    await updateProfile(user, {
      displayName,
    });

    // Create user document in Firestore
    const authUser = await createUserDocument(user, role, displayName);

    return authUser;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    // Get user data from Firestore
    const authUser = await getUserDocument(user.uid);

    if (!authUser) {
      throw new Error("User document not found");
    }

    return authUser;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Logout current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

/**
 * Update user role in Firestore
 */
export const updateUserRole = async (
  uid: string,
  role: UserRole
): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, { role });
  } catch (error) {
    console.error("Update role error:", error);
    throw error;
  }
};
