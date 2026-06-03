export type FormErrors<T> = Partial<Record<keyof T, string>>;

// Login --------------------------------------
export interface LoginFields {
  email: string;
  password: string;
}

export function validateLogin(values: LoginFields): FormErrors<LoginFields> {
  const errors: FormErrors<LoginFields> = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}

// Register --------------------------------------
export interface RegisterFields {
  name: string;
  email: string;
  password: string;
}

export function validateRegister(values: RegisterFields): FormErrors<RegisterFields> {
  const errors: FormErrors<RegisterFields> = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = 'Password must contain at least one uppercase letter.';
  }

  return errors;
}

// Server error → human readable --------------------------------------
export function formatAuthError(msg: string): string {
  const map: Record<string, string> = {
    bad_credentials:      'Incorrect email or password.',
    Email_already_exists: 'This email is already registered.',
    token_error:          'Session expired. Please sign in again.',
  };
  return map[msg] ?? msg.replace(/_/g, ' ');
}