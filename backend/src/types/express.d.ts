// src/types/express.d.ts
import { User } from '@prisma/client'; // optional: if you want strong types

declare module 'express' {
  interface Request {
    user?: any; // or user?: { userId: string } if you want type-safe userId
  }
}
