import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import type { Tournament } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';

export default function AdminTournaments() {
  const { tournaments, addTournament, updateTournament, deleteTournament } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tournament | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    startDate: '',
    endDate: '',
    maxParticipants: 16,
    prize: '',
    status: 'upcoming' as Tournament['status'],
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', date: '', startDate: '', endDate: '', maxParticipants: 16, prize: '', status: 'upcoming' });
    setModalOpen(true);
  };

  const openEdit = (t: Tournament) => {
    setEditing(t);
    setForm({
      name: t.name,
      description: t.description,
      date: t.date,
      startDate: t.startDate,
      endDate: t.endDate,
      maxParticipants: t.maxParticipants,
      prize: t.prize ?? '',
      status: t.status,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      updateTournament({ id: editing.id, ...form });
    } else {
      addTournament({
        ...form,
        currentParticipants: 0,
        registeredUserIds: [],
      });
    }
    setModalOpen(false);
  };

  const getStatusVariant = (status: string): 'info' | 'success' | 'neutral' | 'danger' => {
    if (status === 'upcoming') return 'info';
    if (status === 'ongoing') return 'success';
    if (status === 'completed') return 'neutral';
    return 'danger';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tournaments</h1>
          <p style={{ color: 'var(--color-gray-600)' }}>Manage bowling tournaments</p>
        </div>
        <Button onClick={openCreate}>+ New Tournament</Button>
      </div>

      {tournaments.map(t => (
        <Card key={t.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontWeight: 700 }}>{t.name}</h3>
                <Badge variant={getStatusVariant(t.status)}>{t.status}</Badge>
              </div>
              <p style={{ color: 'var(--color-gray-600)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{t.description}</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                <span>📅 {formatDate(new Date(t.startDate))} – {formatDate(new Date(t.endDate))}</span>
                <span>👥 {t.currentParticipants} / {t.maxParticipants}</span>
                {t.prize && <span>🏆 {t.prize}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button size="sm" variant="secondary" onClick={() => openEdit(t)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => deleteTournament(t.id)}>Delete</Button>
            </div>
          </div>
        </Card>
      ))}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Tournament' : 'New Tournament'} size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Tournament Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Input label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <Input label="Start Date" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
          <Input label="End Date" type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
          <Input label="Max Participants" type="number" value={String(form.maxParticipants)} onChange={e => setForm(f => ({ ...f, maxParticipants: Number(e.target.value) }))} />
          <Input label="Prize" value={form.prize} onChange={e => setForm(f => ({ ...f, prize: e.target.value }))} placeholder="e.g. $500 cash prize" />
          <Select
            label="Status"
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as Tournament['status'] }))}
            options={[
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'ongoing', label: 'Ongoing' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Save Changes' : 'Create Tournament'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
