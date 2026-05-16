import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function MemberProfile() {
  const { currentUser, updateUser } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: currentUser?.name || '', phone: currentUser?.phone || '', address: currentUser?.address || '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!currentUser) return;
    updateUser(currentUser.id, { name: form.name, phone: form.phone, address: form.address });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!currentUser) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 600 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Profile</h1>

      <Card>
        {!editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>NAME</div>
              <div style={{ fontWeight: 600 }}>{currentUser.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>EMAIL</div>
              <div>{currentUser.email}</div>
            </div>
            {currentUser.phone && (
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>PHONE</div>
                <div>{currentUser.phone}</div>
              </div>
            )}
            {currentUser.address && (
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>ADDRESS</div>
                <div>{currentUser.address}</div>
              </div>
            )}
            {saved && <div style={{ color: '#15803d', fontSize: '0.875rem' }}>✓ Profile updated!</div>}
            <Button onClick={() => setEditing(true)} variant="secondary">Edit Profile</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Name" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} />
            <Input label="Address" value={form.address} onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))} />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
