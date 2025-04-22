export interface User {
  id: string;
  name: string;
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
}

export interface AuthenticatedUser extends User {
  // Additional properties for authenticated user if needed.
}
