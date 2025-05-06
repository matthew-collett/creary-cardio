import { FirebaseError } from 'firebase/app'

export const handleError = (error: unknown): string => {
  if (!navigator.onLine) {
    return 'Please check your internet connection and try again.'
  }

  if (error instanceof FirebaseError) {
    return handleFirebaseError(error)
  }

  if (error instanceof Error) {
    return error.message
  }

  console.error(error)
  return 'Something went wrong. Please try again or contact support if the issue persists.'
}

export const handleFirebaseError = (error: FirebaseError): string => {
  switch (error.code) {
    // Common login/registration errors
    case 'auth/invalid-credential':
      return 'Invalid email or password.'
    case 'auth/user-not-found':
      return 'No account found with this email address.'
    case 'auth/wrong-password':
      return 'Incorrect password.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    case 'auth/missing-password':
      return 'Please provide a password'

    // Google login specific errors
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Login window was closed. Please try again.'
    case 'auth/popup-blocked':
      return 'Login popup was blocked by your browser. Please allow popups and try again.'
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different login credentials.'
    case 'auth/user-token-expired':
      return 'Login session expired. Please try again.'

    // Network and technical errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    case 'auth/internal-error':
      return 'Authentication service encountered an error. Please try again.'

    case 'permission-denied':
      return 'You do not have permission to perform this action.'

    default:
      return `Firebase error: ${error.message}`
  }
}
