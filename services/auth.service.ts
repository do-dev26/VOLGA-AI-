import { loginWithEmail, signupWithEmail, loginWithGoogle, logout, resetPassword } from '@/lib/auth';

export const authService = {
  login: loginWithEmail,
  signup: signupWithEmail,
  loginWithGoogle,
  logout,
  resetPassword,
};
