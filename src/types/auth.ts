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
  username: string; // доменное имя или корпоративный логин
  password: string;
}


