export type User = { phone: number; name?: string; password: string; isAdmin?: boolean };
export type Request = { user: User };
export type Store = { users: User[] };
