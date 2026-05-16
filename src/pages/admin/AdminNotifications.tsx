import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { Notification } from '@/types';

const TYPE_OPTIONS = [
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'success', label: 'Success' },
  { value: 'error', label: 'Error' },
];

export default function AdminNotifications() {
  const { notifications, addNotification, deleteNotification, markAllNotificationsRead } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' });

  const handleAdd = () => {
    const n: Notification = {
      id: crypto.randomUUID(),
      title: form.title,
      message: form.message,
      type: form.type as Notification['type'],
      read: false,
      createdAt: new Date().toISOString(),
    };
    addNotification(n);
    setShowAdd(false);
    setForm({ title: '', message: '', type: 'info' });
  };

  const typeVariant: Record<string, 'info' | 'warning' | 'success' | 'danger' | 'neutral'> = {
    info: 'info',
    warning: 'warning',
    success: 'success',
    error: 'danger',
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Notifications</h1>
          <p style={{ color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>Manage member notifications.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="ghost" onClick={markAllNotificationsRead}>Mark All Read</Button>
          <Button onClick={() => setShowAdd(true)}>+ Add Notification</Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' } as React.CSSProperties}>
          <div style={{ fontSize: '3rem' }}>🔔</div>
          <p style={{ marginTop: '1rem', color: 'var(--color-gray-400)' }}>No notifications yet.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[...notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(n => (
            <Card key={n.id} style={{ opacity: n.read ? 0.7 : 1 } as React.CSSProperties}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700 }}>{n.title}</span>
                    <Badge variant={typeVariant[n.type] ?? 'neutral'}>{n.type}</Badge>
                    {!n.read && <Badge variant="warning">Unread</Badge>}
                  </div>
                  <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>{n.message}</p>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-gray-400)', marginTop: '0.25rem' }}>{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <Button size="sm" variant="danger" onClick={() => setDeleteId(n.id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Notification">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          <Input label="Message" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
          <Select label="Type" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} options={TYPE_OPTIONS} />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.title || !form.message}>Add</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Notification">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p>Delete this notification?</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { if (deleteId) { deleteNotification(deleteId); setDeleteId(null); } }}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
