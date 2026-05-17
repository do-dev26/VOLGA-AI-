import { getAuth } from 'firebase/auth'

/**
 * Current Firebase user ka fresh ID token return karta hai.
 * Har backend call se pehle use karo.
 */
export async function getToken(): Promise<string> {
  const user = getAuth().currentUser
  if (!user) throw new Error('User logged in nahi hai')
  return user.getIdToken()
}
