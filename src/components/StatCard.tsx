interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
  color: 'teal' | 'green' | 'orange';
}

export default function StatCard({ icon, title, value, subtitle, color }: StatCardProps) {
  const colorMap = {
    teal: 'var(--primary-teal)',
    green: '#10b981',
    orange: 'var(--primary-orange)'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: colorMap[color] }}
        >
          <i className={`${icon} text-white text-lg`}></i>
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-600 mb-0.5">{title}</p>
          <p className="text-lg font-bold mb-0.5" style={{ color: 'var(--dark-brown)' }}>
            {value}
          </p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}