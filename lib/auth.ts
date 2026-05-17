/**
 * lib/auth.ts
 * Firebase Auth only — Firestore user doc NAHI banate.
 * User data sirf Python backend (MongoDB) mein hota hai.
 * Login/signup ke baad backend /api/auth/sync call hoti hai
 * (useAuth hook mein handle hota hai).
 */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signupWithEmail(email: string, password: string, displayName: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName })
  return cred
}

export async function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}

export async function logout() {
  return signOut(auth)
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email)
}
