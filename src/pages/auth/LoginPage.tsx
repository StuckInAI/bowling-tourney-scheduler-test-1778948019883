import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function LoginPage() {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    if (!user) {
      setError('Invalid email or password.');
      return;
    }
    if (user.role === 'admin') {
      navigate('/admin/overview');
    } else {
      navigate('/member/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-gray-50)', padding: '1rem' }}>
      <Card style={{ width: '100%', maxWidth: 400 } as React.CSSProperties}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎳</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>Sign In to BowlPro</h1>
          <p style={{ color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>Welcome back!</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{error}</p>}
          <Button type="submit" fullWidth>Sign In</Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Register</Link>
        </p>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-gray-600)' }}>
          <strong>Demo credentials:</strong><br />
          Admin: admin@bowlpro.com / admin123<br />
          Member: member@bowlpro.com / member123
        </div>
      </Card>
    </div>
  );
}
