const ErrorMessage = {
  // Not Found
  USER_NOT_FOUND: 'User not found',
  PREDICTION_NOT_FOUND: 'Prediction not found',
  FEEDBACK_NOT_FOUND: 'Feedback not found',
  TOKEN_NOT_FOUND: 'Token not found',
  FILE_NOT_FOUND: 'File not found',
  TASK_NOT_FOUND: 'Task not found',
  SCHEDULE_NOT_FOUND: 'Schedule not found',
  ROOM_NOT_FOUND: 'Room not found',

  // Payments
  SESSION_URL_INVALID: 'Session URL invalid',
  CUSTOMER_DELETED: 'Customer deleted',

  // Already exists
  USER_ALREADY_EXISTS: 'User already exists',
  TASK_ALREADY_EXISTS: 'Task already exists',
  SCHEDULE_ALREADY_EXISTS: 'Schedule already exists',
  ROOM_ALREADY_EXISTS: 'Room already exists',
  FEEDBACK_ALREADY_EXISTS: 'Feedback already exists',

  // Authoriztion
  OWNERSHIP_NOT_VERIFIED: 'Ownership not verified',
  INVALID_CREDENTIALS: 'Invalid credentials',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  NOT_AUTHENTICATED: 'Not authenticated',
  INVALID_TOKEN: 'Invalid token',
  EMAIL_NOT_VERIFIED: 'Email not verified',

  // Misc
  INVALID_FILE_NAME: 'Invalid file name',
  USER_ALREADY_IN_ROOM: 'User already in room',
  USER_NOT_IN_ROOM: 'User not in room',
  USER_ALREADY_ADMIN: 'User already admin',
  USER_NOT_ADMIN: 'User not admin',
  INVALID_OPERATOR_OR_VALUE_FOR_FIELD: 'Invalid operator or value for field',
} as const;

export default ErrorMessage;
