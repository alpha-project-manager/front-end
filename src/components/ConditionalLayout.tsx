'use client';

import { usePathname } from 'next/navigation';
import AppLayout from './AppLayout';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();
  
  // Страницы без навигации
  const authPages = ['/auth'];
  const shouldShowNavigation = !authPages.some(page => pathname.startsWith(page));

  if (shouldShowNavigation) {
    return <AppLayout>{children}</AppLayout>;
  }

  return <>{children}</>;
};

export default ConditionalLayout;
