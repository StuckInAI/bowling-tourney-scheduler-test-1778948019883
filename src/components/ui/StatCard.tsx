interface StatCardProps {
  title: string;
  value: number | string;
  icon?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  subtitle?: string;
}

export default function StatCard({ title, value, icon, color = 'blue', subtitle }: StatCardProps) {
  const colorMap = {
    blue: { bg: '#eff6ff', text: '#1d4ed8', iconBg: '#dbeafe' },
    green: { bg: '#f0fdf4', text: '#15803d', iconBg: '#dcfce7' },
    purple: { bg: '#faf5ff', text: '#7e22ce', iconBg: '#f3e8ff' },
    orange: { bg: '#fff7ed', text: '#c2410c', iconBg: '#ffedd5' },
    red: { bg: '#fef2f2', text: '#b91c1c', iconBg: '#fee2e2' },
  };
  const c = colorMap[color];

  return (
    <div style={{ background: c.bg, borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {icon && (
        <div style={{ background: c.iconBg, borderRadius: '10px', padding: '0.75rem', fontSize: '1.5rem', lineHeight: 1 }}>
          {icon}
        </div>
      )}
      <div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: c.text, lineHeight: 1.2 }}>{value}</div>
        {subtitle && <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>{subtitle}</div>}
      </div>
    </div>
  );
}
