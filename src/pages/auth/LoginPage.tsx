import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

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
      setError('Invalid email or password');
      return;
    }
    navigate(user.role === 'admin' ? '/admin/overview' : '/member/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎳</div>
          <h1 className="text-2xl font-bold text-slate-800">BowlPro</h1>
          <p className="text-slate-500 mt-1">Sign in to your account</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full">Sign In</Button>
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
            </p>
          </form>
        </Card>
        <p className="text-center text-xs text-slate-400 mt-6">
          Demo: admin@bowl.com / admin123 &nbsp;|&nbsp; member@bowl.com / member123
        </p>
      </div>
    </div>
  );
}
