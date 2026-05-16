import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function MemberProfile() {
  const { currentUser, updateUser } = useAppContext();
  const [name, setName] = useState(currentUser?.name ?? '');
  const [phone, setPhone] = useState(currentUser?.phone ?? '');
  const [saved, setSaved] = useState(false);

  if (!currentUser) return null;

  const handleSave = () => {
    updateUser({ ...currentUser, name, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>My Profile</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>Manage your account details</p>
      </div>
      <div style={{ maxWidth: 500 }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="Email" value={currentUser.email} onChange={() => {}} disabled />
            <Input label="Phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" />
            <Input label="Member Since" value={new Date(currentUser.joinedAt).toLocaleDateString()} onChange={() => {}} disabled />
            <Button onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Changes'}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
