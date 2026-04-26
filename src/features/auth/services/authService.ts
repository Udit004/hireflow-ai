import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import axios from "axios";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { AuthUser, UserRole } from "../types";
import { getBackendUser, syncBackendUser, type BackendUserResponse } from "./authApi";

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

function mapBackendUserToAuthUser(
  backendUser: BackendUserResponse,
  firebaseUser: FirebaseUser,
): AuthUser {
  return {
    uid: backendUser.uid,
    email: backendUser.email,
    displayName: backendUser.display_name,
    photoURL: firebaseUser.photoURL,
    role: backendUser.role,
    createdAt: new Date(backendUser.created_at),
  };
}

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

    // Create Firestore user document as best-effort only.
    try {
      await createUserDocument(user, role, displayName);
    } catch (firestoreError) {
      console.warn("Firestore user document write skipped:", firestoreError);
    }

    // Sync the Firebase user into the backend database.
    const backendUser = await syncBackendUser(user, role, displayName);

    return mapBackendUserToAuthUser(backendUser, user);
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

    const backendUser = await getOrCreateBackendUser(user);
    return mapBackendUserToAuthUser(backendUser, user);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

async function getOrCreateBackendUser(user: FirebaseUser): Promise<BackendUserResponse> {
  try {
    const backendUser = await getBackendUser(user);

    // Keep email/display name in sync without changing role unexpectedly.
    return await syncBackendUser(user, backendUser.role, user.displayName);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return await syncBackendUser(user, "candidate", user.displayName);
    }
    throw error;
  }
}

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

export const syncLoggedInUserToBackend = async (
  user: FirebaseUser,
): Promise<AuthUser> => {
  try {
    const backendUser = await getOrCreateBackendUser(user);
    return mapBackendUserToAuthUser(backendUser, user);
  } catch (error) {
    console.error("Backend user sync failed:", error);
    throw error;
  }
};
