import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    if (user) {
      if (user.role === 'admin') navigate('/admin/overview');
      else navigate('/member/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
      <Card padding="lg">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎳</div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e3a5f' }}>Welcome Back</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Sign in to your BowlPro account</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 320 }}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{error}</p>}
          <Button type="submit" fullWidth>Sign In</Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          Don't have an account? <Link to="/register" style={{ color: '#1e3a5f', fontWeight: 600 }}>Register</Link>
        </p>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b' }}>
          <strong>Demo:</strong> admin@bowlpro.com / admin123 · john@example.com / member123
        </div>
      </Card>
    </div>
  );
}
