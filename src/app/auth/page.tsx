"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Credentials } from "@/types/auth";
import Button from "@/components/Button";

const AuthPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { status, error } = useAppSelector((state) => state.auth);
    
    const [credentials, setCredentials] = useState<Credentials>({
        username: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(login(credentials));
        if (login.fulfilled.match(result)) {
            router.push("/");
        }
    };

    return (
        <div className="relative flex items-center justify-center h-screen overflow-hidden px-4">
            
            {/* Панель с формой */}
            <div className="relative z-10 h-11/12 w-full min-w-1/3 max-w-md bg-transparent rounded-[40px] py-[7.5rem] px-[7.813rem] md:mr-12 shadow-2xl border border-black/5">
                <form onSubmit={handleSubmit} className="flex flex-col">
                    {/* Заголовок */}
                    <h1 className="text-5xl md:text-4xl font-medium text-gray-900 mb-[4.375rem] text-center">
                        Вход
                    </h1>
                    
                    {/* Поле Логин */}
                    <div className="mb-10">
                        <div className="border-b-2 border-gray-400 focus-within:border-gray-600 transition-colors">
                            <input
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                className="w-full bg-transparent py-2 outline-none text-gray-900 placeholder-gray-400 text-lg"
                                placeholder="Логин"
                                required
                                autoComplete="given-name"
                            />
                        </div>
                    </div>
                    
                    {/* Поле Пароль */}
                    <div className="mb-[6.25rem]">
                        <div className="border-b-2 border-gray-400 focus-within:border-gray-600 transition-colors">
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                className="w-full bg-transparent py-2 outline-none text-gray-900 placeholder-gray-400 text-lg"
                                placeholder="Пароль"
                                required
                                autoComplete="password"
                            />
                        </div>
                        {/* Сообщение об ошибке */}
                    {error && (
                        <div className="mt-4 text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}
                    </div>
                    
                    {/* Кнопка Войти */}
                    <Button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full
                        text-white font-medium text-lg py-2 rounded-4xl transition-colors 
                        disabled:opacity-50 disabled:cursor-not-allowed mb-5 cursor-pointer"
                    >
                        {status === "loading" ? "Вход..." : "Войти"}
                    </Button>
                    
                    {/* Ссылка Забыли пароль */}
                    <button
                        type="button"
                        className="text-base text-gray-600 hover:text-gray-800 text-center transition-colors cursor-pointer"
                    >
                        Забыли пароль?
                    </button>
                    
                    {/* Подсказка для разработки */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-6 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
                            <p className="font-semibold mb-1">Тестовые данные:</p>
                            <p>Логин: curator или student</p>
                            <p>Пароль: pass123</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AuthPage;