'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = '' }: SidebarProps) => {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Главная',
      href: '/',
      icon: '🏠',
    },
    {
      name: 'Активные проекты',
      href: '/active',
      icon: '📋',
    },
    {
      name: 'Заявки',
      href: '/requests',
      icon: '📝',
    },
    {
      name: 'Архив',
      href: '/archive',
      icon: '📁',
    },
  ];

  const bottomNavigationItems = [
    {
      name: 'настройки',
      href: '/settings',
      icon: '⚙️',
    },
  ];

  return (
    <aside className={`bg-gray-50 border-r border-gray-200 w-64 h-screen flex flex-col sidebar-transition fixed left-0 top-0 z-10 ${className}`}>
      {/* Логотип/Заголовок */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Мое Приложение</h1>
      </div>

      {/* Навигационное меню */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === '/active' && pathname.startsWith('/projects'));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Нижняя часть с настройками */}
      <div className="p-4 border-t border-gray-200">
        <ul className="space-y-2">
          {bottomNavigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

