export const ERROR_MESSAGES = {
  UNKNOWN: 'An unknown error occurred',
  SIGN_IN: 'Failed to sign in. Please check your credentials.',
  SIGN_UP: 'Failed to create account. Please try again.',
  SIGN_OUT: 'Failed to sign out. Please try again.',
  GOOGLE_SIGN_IN: 'Failed to sign in with Google. Please try again.',
} as const;

export type ErrorMessage = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES];
