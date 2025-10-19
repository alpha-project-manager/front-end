'use client';

import { FormEvent, useState } from 'react';
import Modal from './Modal';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';

interface Props {
  open: boolean;
  onClose: () => void;
}

const LoginDialog = ({ open, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('bank\\curator');
  const [password, setPassword] = useState('pass123');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(login({ username, password }));
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Вход">
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm text-gray-700">Логин</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2"/>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-gray-700">Пароль</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2"/>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Отмена</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Войти</button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginDialog;


