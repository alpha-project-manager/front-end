export type AuthProvider = "SSO" | "DOMAIN";

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  department?: string;
  avatarUrl?: string;
  roles: string[]; // e.g. ["curator", "admin"]
  university?: string; // вуз, если относится к роли
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken?: string; // mock access token
  provider?: AuthProvider;
  user?: UserProfile;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

export interface Credentials {
  email: string; // email для входа
  password: string;
}

// Server auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  isTutor: boolean;
  firstName: string;
  lastName?: string;
  patronymic?: string;
}

export interface LoginResponse {
  completed: boolean;
  message: string;
  userId?: string; // Guid as string
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface RegisterResponse {
  completed: boolean;
  message: string;
  userId?: string; // Guid as string
  accessToken: string;
}