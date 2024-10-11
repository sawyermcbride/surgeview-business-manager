declare namespace Express {
  export interface Request {
    session: {
      planName?: string | undefined;
      email?: string | undefined;
      videoLink?: string | undefined;
    },
    user: {
      id: number;
      role: 'Admin' | 'manager' | 'associate';
      email?: string;
      username: string;
      name?: string;
      createdAt?: Date;
    }
 }
}
