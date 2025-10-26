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
  // Простые варианты для тестирования
  {
    id: "u3",
    displayName: "Тестовый Куратор",
    email: "test@bank.ru",
    department: "Corp",
    roles: ["curator"],
    username: "curator",
    password: "pass123",
  },
  {
    id: "u4",
    displayName: "Тестовый Студент",
    email: "test@urfu.ru",
    department: "Университет",
    roles: ["student"],
    university: "УрФУ",
    username: "student",
    password: "pass123",
  },
];

export async function mockLogin(credentials: Credentials): Promise<{ token: string; user: UserProfile }>{
  await delay(300);
  
  // Отладочная информация
  console.log("Попытка входа:", credentials);
  console.log("Доступные пользователи:", mockUsers.map(u => ({ username: u.username, password: u.password })));
  
  const account = mockUsers.find(
    (u) => {
      // Нормализуем имя пользователя для сравнения (приводим к нижнему регистру)
      const normalizedInput = credentials.username.toLowerCase().trim();
      const normalizedUsername = u.username.toLowerCase();
      
      // Проверяем точное совпадение
      const usernameMatch = normalizedUsername === normalizedInput;
      const passwordMatch = u.password === credentials.password;
      
      console.log(`Проверка пользователя: ${u.username}, вход: "${credentials.username}", username match: ${usernameMatch}, password match: ${passwordMatch}`);
      
      return usernameMatch && passwordMatch;
    }
  );
  
  if (!account) {
    console.log("Пользователь не найден");
    throw new Error("Неверные учетные данные");
  }
  
  console.log("Вход успешен:", account.displayName);
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


