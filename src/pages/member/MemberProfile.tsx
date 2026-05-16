import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function MemberProfile() {
  const { currentUser, updateUser } = useAppContext();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
  });

  const handleSave = () => {
    if (!currentUser) return;
    updateUser({ ...currentUser, name: form.name, phone: form.phone, address: form.address });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a5f' }}>My Profile</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage your personal information</p>
      </div>

      <Card style={{ maxWidth: 500 } as React.CSSProperties}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Email</div>
            <div style={{ fontWeight: 600 }}>{currentUser?.email}</div>
          </div>
          {currentUser?.address && (
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Address</div>
              <div>{currentUser.address}</div>
            </div>
          )}
          <Input label="Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          <Input label="Address" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
