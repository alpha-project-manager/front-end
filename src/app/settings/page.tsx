'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import Button from '@/components/Button';

export default function Settings() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSave = () => {
    // Логика сохранения данных Яндекс календаря
    console.log('Сохранение данных:', { username, password });
  };

  const handleChangePassword = () => {
    // Логика смены пароля
    console.log('Смена пароля');
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.push('/auth');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="text-right">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Регистрация нового пользователя
        </h1>
        <p className="text-gray-600">
          админ пользователь
        </p>
      </div>

      {/* Форма Яндекс календаря */}
      <div className="max-w-md">
        <div className="border border-gray-300 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Яндекс календарь
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите имя пользователя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите пароль"
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSave}
                variant="primary"
              >
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="max-w-md space-y-3">
        <Button
          onClick={handleChangePassword}
          variant="secondary"
          fullWidth
          className="text-left"
        >
          Сменить пароль
        </Button>
        
        <Button
          onClick={handleLogout}
          variant="text-link"
          fullWidth
          className="text-center"
        >
          Выйти
        </Button>
      </div>
    </div>
  );
}
