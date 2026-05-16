import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const { register } = useAppContext();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = register({ name, email, password });
      if (!user) {
        setError('An account with this email already exists.');
      } else {
        navigate('/member/dashboard');
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎳</div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Join BowlPro today</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jane Bowler"
              required
            />
          </div>
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
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
        <p className="mt-2 text-center text-sm text-slate-600">
          <Link to="/" className="text-slate-500 hover:underline">← Back to Home</Link>
        </p>
      </Card>
    </div>
  );
}
