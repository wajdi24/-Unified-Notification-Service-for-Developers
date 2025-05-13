export interface User {
  id: string;
  firstName: string
  lastName: string
  email: string;
  phone: string;
  password?: string;
  isProfilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
  verified?: boolean;
  verificationToken?: string;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: string;
  isProfileCompleted: boolean;
  avatar?: string
}

export interface AuthenticatedUser extends User {
  // Additional properties for authenticated user if needed.
}
