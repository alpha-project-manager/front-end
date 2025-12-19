import { Credentials, UserProfile } from "@/types/auth";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS, API_CONFIG } from "@/config/api";
import { withApiFallback, shouldUseMockData } from "@/lib/api-utils";

const mockUsers: Array<UserProfile & { password: string }> = [
  {
    id: "u1",
    displayName: "Куратор Банка",
    email: "curator@bank.ru",
    department: "Corp",
    roles: ["curator"],
    password: "pass123",
  },
  {
    id: "u2",
    displayName: "Студент УрФУ",
    email: "student@urfu.ru",
    department: "Университет",
    roles: ["student"],
    university: "УрФУ",
    password: "pass123",
  },
  // Простые варианты для тестирования
  {
    id: "u3",
    displayName: "Тестовый Куратор",
    email: "test@bank.ru",
    department: "Corp",
    roles: ["curator"],
    password: "pass123",
  },
  {
    id: "u4",
    displayName: "Тестовый Студент",
    email: "test@urfu.ru",
    department: "Университет",
    roles: ["student"],
    university: "УрФУ",
    password: "pass123",
  },
];

// ========== Mock функции ==========
export async function mockLogin(credentials: Credentials): Promise<{ token: string; user: UserProfile }>{
  await delay(300);

  // Отладочная информация
  console.log("Попытка входа:", credentials);
  console.log("Доступные пользователи:", mockUsers.map(u => ({ email: u.email, password: u.password })));

  const account = mockUsers.find(
    (u) => {
      // Нормализуем email для сравнения (приводим к нижнему регистру)
      const normalizedInput = credentials.email.toLowerCase().trim();
      const normalizedEmail = u.email.toLowerCase();

      // Проверяем точное совпадение
      const emailMatch = normalizedEmail === normalizedInput;
      const passwordMatch = u.password === credentials.password;

      console.log(`Проверка пользователя: ${u.email}, вход: "${credentials.email}", email match: ${emailMatch}, password match: ${passwordMatch}`);

      return emailMatch && passwordMatch;
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

// ========== API функции ==========
async function apiLogin(credentials: Credentials): Promise<{ token: string; user: UserProfile }> {
  const response = await apiClient.post<{ accessToken: string; user?: UserProfile }>(
    API_ENDPOINTS.auth.login,
    credentials
  );
  return {
    token: response.accessToken,
    user: response.user || {
      id: '1',
      displayName: 'User',
      email: credentials.email,
      roles: []
    }
  };
}

async function apiLogout(): Promise<void> {
  // Logout может не требовать авторизации, поэтому делаем запрос без токена
  const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.auth.logout}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok && response.status !== 401) {
    throw new Error('Logout failed');
  }
}

async function apiRefresh(): Promise<{ accessToken: string }> {
  const response = await apiClient.post<{ accessToken: string }>(API_ENDPOINTS.auth.refresh);
  return response;
}

async function apiRegister(data: { email: string; password: string; isTutor: boolean; firstName: string; lastName?: string; patronymic?: string }): Promise<{ accessToken: string; user?: UserProfile }> {
  const response = await apiClient.post<{ accessToken: string; user?: UserProfile }>(API_ENDPOINTS.auth.register, data);
  return response;
}

async function apiDeleteAccount(): Promise<void> {
  await apiClient.post(API_ENDPOINTS.auth.delete);
}

async function apiGetMe(): Promise<UserProfile> {
  return await apiClient.get<UserProfile>(API_ENDPOINTS.auth.me);
}

// ========== Публичные функции (с автоматическим выбором моков/API) ==========
/**
 * Вход в систему
 * Автоматически использует API или моки в зависимости от конфигурации
 */
export async function login(credentials: Credentials): Promise<{ token: string; user: UserProfile }> {
  return withApiFallback(
    () => apiLogin(credentials),
    () => mockLogin(credentials)
  );
}

/**
 * Выход из системы
 * Автоматически использует API или моки в зависимости от конфигурации
 */
export async function logout(): Promise<void> {
  return withApiFallback(
    () => apiLogout(),
    () => mockLogout()
  );
}

/**
 * Обновить токен
 * Автоматически использует API или моки в зависимости от конфигурации
 */
export async function refreshToken(): Promise<{ accessToken: string }> {
  return withApiFallback(
    () => apiRefresh(),
    async () => ({ accessToken: `mock-refreshed-token-${Date.now()}` })
  );
}

/**
 * Регистрация нового пользователя
 * Автоматически использует API или моки в зависимости от конфигурации
 */
export async function register(data: { email: string; password: string; isTutor: boolean; firstName: string; lastName?: string; patronymic?: string }): Promise<{ accessToken: string; user?: UserProfile }> {
  return withApiFallback(
    () => apiRegister(data),
    async () => {
      const newUser = {
        id: `u${mockUsers.length + 1}`,
        displayName: `${data.firstName} ${data.lastName || ''}`.trim(),
        email: data.email,
        department: data.isTutor ? 'Tutor' : 'Student',
        roles: data.isTutor ? ['tutor'] : ['student'],
        university: data.isTutor ? undefined : 'УрФУ',
        password: data.password,
      };
      mockUsers.push(newUser);
      return { accessToken: `mock-token-${newUser.id}`, user: stripSecrets(newUser) };
    }
  );
}

/**
 * Удалить аккаунт
 * Автоматически использует API или моки в зависимости от конфигурации
 */
export async function deleteAccount(): Promise<void> {
  return withApiFallback(
    () => apiDeleteAccount(),
    async () => { console.log('Аккаунт удален (mock)'); }
  );
}

/**
 * Получить текущего пользователя
 */
export async function getCurrentUser(): Promise<UserProfile> {
  if (shouldUseMockData()) {
    // Для моков возвращаем первого пользователя как пример
    const mockUser = mockUsers[0];
    return stripSecrets(mockUser);
  }

  return apiGetMe();
}

function stripSecrets(user: (UserProfile & { password: string })): UserProfile {
  const { password: _p, ...safe } = user;
  return safe;
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}