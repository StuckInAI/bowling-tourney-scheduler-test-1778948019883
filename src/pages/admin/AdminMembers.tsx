import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { SubscriptionTier, SubscriptionStatus } from '@/types';

export default function AdminMembers() {
  const { users, updateUser, deleteUser } = useAppContext();
  const members = users.filter((u) => u.role === 'member');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ subscriptionTier: 'basic' as SubscriptionTier, subscriptionStatus: 'active' as SubscriptionStatus });

  const tierVariant = (tier?: SubscriptionTier) => {
    if (tier === 'vip') return 'purple';
    if (tier === 'premium') return 'info';
    return 'neutral';
  };

  const statusVariant = (status?: SubscriptionStatus) => {
    if (status === 'active') return 'success';
    if (status === 'expired') return 'danger';
    return 'warning';
  };

  const handleEdit = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    setForm({ subscriptionTier: user.subscriptionTier || 'basic', subscriptionStatus: user.subscriptionStatus || 'active' });
    setEditingId(userId);
  };

  const handleSave = () => {
    if (!editingId) return;
    updateUser(editingId, form);
    setEditingId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Members</h1>

      {members.length === 0 ? (
        <Card><p style={{ textAlign: 'center', color: '#64748b' }}>No members yet.</p></Card>
      ) : (
        members.map((m) => (
          <Card key={m.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{m.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{m.email}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Badge variant={tierVariant(m.subscriptionTier)}>{m.subscriptionTier || 'basic'}</Badge>
                  <Badge variant={statusVariant(m.subscriptionStatus)}>{m.subscriptionStatus || 'inactive'}</Badge>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button size="sm" variant="secondary" onClick={() => handleEdit(m.id)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => deleteUser(m.id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))
      )}

      <Modal isOpen={!!editingId} onClose={() => setEditingId(null)} title="Edit Member Subscription">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Select
            label="Subscription Tier"
            value={form.subscriptionTier}
            onChange={(e) => setForm(p => ({ ...p, subscriptionTier: e.target.value as SubscriptionTier }))}
            options={[
              { value: 'basic', label: 'Basic' },
              { value: 'premium', label: 'Premium' },
              { value: 'vip', label: 'VIP' },
            ]}
          />
          <Select
            label="Status"
            value={form.subscriptionStatus}
            onChange={(e) => setForm(p => ({ ...p, subscriptionStatus: e.target.value as SubscriptionStatus }))}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'expired', label: 'Expired' },
            ]}
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
