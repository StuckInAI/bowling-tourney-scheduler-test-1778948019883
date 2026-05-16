import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const { register } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = register(form.name, form.email, form.password);
    if (success) {
      navigate('/member/dashboard');
    } else {
      setError('An account with this email already exists.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem' }}>🎳</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', margin: '0.5rem 0 0.25rem' }}>Create Account</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Join BowlPro today</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <Input label="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          {error && <div style={{ color: '#dc2626', fontSize: '0.875rem', background: '#fee2e2', padding: '0.75rem', borderRadius: '8px' }}>{error}</div>}
          <Button type="submit" fullWidth>Create Account</Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: '#1e3a5f', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
