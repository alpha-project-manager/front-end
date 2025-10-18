const AuthPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Вход</h1>
            <form className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-start justify-center">
                    <label htmlFor="login" className="text-sm font-bold mb-2">Логин</label>
                    <input type="text" id="login" className="border-2 border-gray-300 rounded-md p-2" />
                </div>
                <div className="flex flex-col items-start justify-center mb-2">
                    <label htmlFor="password" className="text-sm font-bold mb-2">Пароль</label>
                    <input type="password" id="password" className="border-2 border-gray-300 rounded-md p-2" />
                </div>
                <div className="flex items-start justify-center mb-2">
                    <button type="submit" className="bg-blue-500 text-white rounded-md p-2 mr-2">Войти</button>
                    <button type="button" className="text-blue-500 mt-2">Забыл пароль?</button>
                </div>
            </form>
        </div>
    )
}
export default AuthPage