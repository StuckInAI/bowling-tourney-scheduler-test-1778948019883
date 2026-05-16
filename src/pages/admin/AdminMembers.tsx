import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { getInitials } from '@/lib/utils';

export default function AdminMembers() {
  const { users, deleteUser, updateUser } = useAppContext();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [search, setSearch] = useState('');

  const members = users.filter(u => u.role === 'member').filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditSave = () => {
    if (!editUser) return;
    updateUser(editUser.id, { name: editUser.name, email: editUser.email });
    setEditUser(null);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Members</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>Manage registered members.</p>
      </div>

      <Card style={{ marginBottom: '1rem' } as React.CSSProperties}>
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Card>

      {members.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' } as React.CSSProperties}>
          <p style={{ color: 'var(--color-gray-400)' }}>No members found.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {members.map(u => (
            <Card key={u.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                    {getInitials(u.name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{u.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {u.subscriptionPlan && <Badge variant="info">{u.subscriptionPlan}</Badge>}
                  <Button size="sm" variant="ghost" onClick={() => setEditUser({ id: u.id, name: u.name, email: u.email })}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => setDeleteId(u.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit Member">
        {editUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Name" value={editUser.name} onChange={e => setEditUser(p => p ? { ...p, name: e.target.value } : null)} />
            <Input label="Email" type="email" value={editUser.email} onChange={e => setEditUser(p => p ? { ...p, email: e.target.value } : null)} />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setEditUser(null)}>Cancel</Button>
              <Button onClick={handleEditSave}>Save</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Member">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p>Are you sure you want to delete this member?</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { if (deleteId) { deleteUser(deleteId); setDeleteId(null); } }}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
