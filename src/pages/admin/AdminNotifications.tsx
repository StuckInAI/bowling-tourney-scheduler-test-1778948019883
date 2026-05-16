import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { UserRole } from '@/types';

export default function AdminNotifications() {
  const { notifications, addNotification, deleteNotification } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', targetRole: '' });

  const handleSend = () => {
    if (!form.title || !form.message) return;
    addNotification({
      id: crypto.randomUUID(),
      title: form.title,
      message: form.message,
      targetRole: form.targetRole ? (form.targetRole as UserRole) : undefined,
      createdAt: new Date().toISOString(),
    });
    setShowModal(false);
    setForm({ title: '', message: '', targetRole: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Notifications</h1>
        <Button onClick={() => setShowModal(true)}>+ Send Notification</Button>
      </div>

      {notifications.length === 0 ? (
        <Card><p style={{ textAlign: 'center', color: '#64748b' }}>No notifications yet.</p></Card>
      ) : (
        notifications.map((n) => (
          <Card key={n.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{n.title}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{n.message}</div>
                {n.targetRole && <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#94a3b8' }}>Target: {n.targetRole}</div>}
              </div>
              <Button size="sm" variant="danger" onClick={() => deleteNotification(n.id)}>Delete</Button>
            </div>
          </Card>
        ))
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Send Notification">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Title" value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} required />
          <Input label="Message" value={form.message} onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))} required />
          <Select
            label="Target Audience"
            value={form.targetRole}
            onChange={(e) => setForm(p => ({ ...p, targetRole: e.target.value }))}
            options={[
              { value: 'member', label: 'Members Only' },
              { value: 'admin', label: 'Admins Only' },
            ]}
            placeholder="Everyone"
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
