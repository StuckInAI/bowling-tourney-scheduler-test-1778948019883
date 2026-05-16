import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
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
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-gray-50)', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-lg)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>🎳 BowlPro Login</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{error}</p>}
          <Button type="submit" fullWidth>Login</Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
