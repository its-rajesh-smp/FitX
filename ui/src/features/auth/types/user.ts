export interface User {
  id: string;
  name: string;
  email: string;
  planId?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}
