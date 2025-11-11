import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'text-link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:shadow-[0_0_0_3px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
    secondary: 'bg-white text-gray-900 border-2 border-gray-300 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed',
    dark: 'bg-gray-700 text-white hover:shadow-[0_0_0_3px_rgba(107,114,128,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
    'text-link': 'bg-transparent text-red-600 hover:text-red-800 p-0 border-0 shadow-none disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  // Для text-link используем минимальный padding и размер текста
  const finalSizeStyles = variant === 'text-link' 
    ? 'px-0 py-0 text-base' 
    : sizeStyles[size];

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${finalSizeStyles}
    ${widthStyle}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

