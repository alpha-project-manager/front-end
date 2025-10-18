'use client';

import { useState } from 'react';

export default function Settings() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    // Логика сохранения данных Яндекс календаря
    console.log('Сохранение данных:', { username, password });
  };

  const handleChangePassword = () => {
    // Логика смены пароля
    console.log('Смена пароля');
  };

  const handleLogout = () => {
    // Логика выхода
    console.log('Выход из системы');
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
              <button
                onClick={handleSave}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="max-w-md space-y-3">
        <button
          onClick={handleChangePassword}
          className="w-full px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-left"
        >
          Сменить пароль
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-left"
        >
          Выход
        </button>
      </div>
    </div>
  );
}
