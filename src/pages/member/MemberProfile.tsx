import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function MemberProfile() {
  const { currentUser, updateUser } = useAppContext();
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!currentUser) return;
    updateUser({ id: currentUser.id, name: form.name, phone: form.phone, address: form.address });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!currentUser) return null;

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '1.5rem' }}>My Profile</h2>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem', alignItems: 'start' }}>
            <div style={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>Email</div>
            <div>{currentUser.email}</div>
            <div style={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>Role</div>
            <div style={{ textTransform: 'capitalize' }}>{currentUser.role}</div>
            <div style={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>Subscription</div>
            <div style={{ textTransform: 'capitalize' }}>{currentUser.subscription}</div>
            {currentUser.phone && (
              <>
                <div style={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>Phone</div>
                <div>{currentUser.phone}</div>
              </>
            )}
            {currentUser.address && (
              <>
                <div style={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem', paddingTop: '0.25rem' }}>Address</div>
                <div>{currentUser.address}</div>
              </>
            )}
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
          <h3 style={{ fontWeight: 700, color: '#1e3a5f', margin: 0 }}>Edit Profile</h3>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Input label="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          {saved && <div style={{ color: '#15803d', fontWeight: 600 }}>Profile saved!</div>}
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
