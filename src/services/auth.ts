import { Credentials, UserProfile } from "@/types/auth";

const mockUsers: Array<UserProfile & { username: string; password: string }> = [
  {
    id: "u1",
    displayName: "Куратор Банка",
    email: "curator@bank.ru",
    department: "Corp",
    roles: ["curator"],
    username: "bank\\curator",
    password: "pass123",
  },
  {
    id: "u2",
    displayName: "Студент УрФУ",
    email: "student@urfu.ru",
    department: "Университет",
    roles: ["student"],
    university: "УрФУ",
    username: "urfu\\student",
    password: "pass123",
  },
];

export async function mockLogin(credentials: Credentials): Promise<{ token: string; user: UserProfile }>{
  await delay(300);
  const account = mockUsers.find(
    (u) => u.username.toLowerCase() === credentials.username.toLowerCase() && u.password === credentials.password
  );
  if (!account) {
    throw new Error("Неверные учетные данные");
  }
  return { token: `mock-token-${account.id}`, user: stripSecrets(account) };
}

export async function mockLogout(): Promise<void> {
  await delay(100);
}

function stripSecrets(user: (UserProfile & { username: string; password: string })): UserProfile {
  const { username: _u, password: _p, ...safe } = user;
  return safe;
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}


