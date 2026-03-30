import React from 'react';

/**
 * Reusable Card component
 */
const Card = ({
  children,
  title,
  subtitle,
  footer,
  padding = 'md', // none, sm, md, lg
  shadow = 'md', // none, sm, md, lg
  hover = false,
  className = '',
  onClick,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  
  const hoverStyles = hover
    ? 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'
    : '';
  
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-gray-100
        ${shadows[shadow]}
        ${paddings[padding]}
        ${hoverStyles}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div>{children}</div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

/**
 * Card Header component
 */
Card.Header = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

/**
 * Card Body component
 */
Card.Body = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

/**
 * Card Footer component
 */
Card.Footer = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

/**
 * Stat Card variant
 */
export const StatCard = ({
  icon,
  label,
  value,
  trend,
  trendLabel,
  color = 'teal',
}) => {
  const colors = {
    teal: 'bg-[var(--primary-teal)]/10 text-[var(--primary-teal)]',
    orange: 'bg-[var(--primary-orange)]/10 text-[var(--primary-orange)]',
    gray: 'bg-gray-100 text-gray-600',
  };
  
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}% {trendLabel}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default Card;
