import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = login(email, password);
      if (!user) {
        setError('Invalid email or password.');
      } else {
        navigate(user.role === 'admin' ? '/admin/overview' : '/member/dashboard');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎳</div>
          <h1 className="text-2xl font-bold">BowlPro Login</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Demo credentials:</p>
          <p className="font-mono text-xs mt-1">admin@bowling.com / admin123</p>
          <p className="font-mono text-xs">jane@bowler.com / password</p>
        </div>

        <p className="mt-4 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
        <p className="mt-2 text-center text-sm text-slate-600">
          <Link to="/" className="text-slate-500 hover:underline">← Back to Home</Link>
        </p>
      </Card>
    </div>
  );
}
