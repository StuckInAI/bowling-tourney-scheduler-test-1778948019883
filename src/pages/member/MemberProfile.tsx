import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { getInitials } from '@/lib/utils';

export default function MemberProfile() {
  const { currentUser, updateUser } = useAppContext();
  const [name, setName] = useState(currentUser?.name ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateUser(currentUser.id, { name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!currentUser) return null;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Profile</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>Manage your account information.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
              {getInitials(currentUser.name)}
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{currentUser.name}</h2>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>{currentUser.email}</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gray-400)' }}>Member since {new Date(currentUser.createdAt).toLocaleDateString()}</p>
          </div>
        </Card>

        <Card>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Edit Profile</h2>
          {saved && (
            <div style={{ padding: '0.75rem', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 'var(--radius-md)', marginBottom: '1rem', color: '#15803d', fontSize: '0.875rem', fontWeight: 600 }}>
              ✅ Profile saved successfully!
            </div>
          )}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Button type="submit">Save Changes</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
