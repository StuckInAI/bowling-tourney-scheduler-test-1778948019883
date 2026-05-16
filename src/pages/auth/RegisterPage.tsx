import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RegisterPage() {
  const { register } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    register({ name: form.name, email: form.email, password: form.password });
    navigate('/member/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
      <Card padding="lg">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎳</div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e3a5f' }}>Create Account</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Join BowlPro today</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 320 }}>
          <Input label="Full Name" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))} required />
          <Input label="Confirm Password" type="password" value={form.confirm} onChange={(e) => setForm(p => ({ ...p, confirm: e.target.value }))} required />
          {error && <p style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{error}</p>}
          <Button type="submit" fullWidth>Create Account</Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: '#1e3a5f', fontWeight: 600 }}>Sign In</Link>
        </p>
      </Card>
    </div>
  );
}
