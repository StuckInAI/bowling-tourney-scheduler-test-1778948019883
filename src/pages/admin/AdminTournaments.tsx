import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { Tournament } from '@/types';

const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
];

export default function AdminTournaments() {
  const { tournaments, addTournament, updateTournament, deleteTournament } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [editT, setEditT] = useState<Tournament | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const emptyForm = { name: '', description: '', date: '', maxParticipants: '16', entryFee: '0', status: 'upcoming' };
  const [form, setForm] = useState(emptyForm);

  const handleAdd = () => {
    const t: Tournament = {
      id: crypto.randomUUID(),
      name: form.name,
      description: form.description,
      date: form.date,
      maxParticipants: parseInt(form.maxParticipants),
      entryFee: parseFloat(form.entryFee),
      status: form.status as Tournament['status'],
      registeredParticipants: [],
      createdAt: new Date().toISOString(),
    };
    addTournament(t);
    setShowAdd(false);
    setForm(emptyForm);
  };

  const handleEdit = () => {
    if (!editT) return;
    updateTournament(editT.id, {
      name: form.name,
      description: form.description,
      date: form.date,
      maxParticipants: parseInt(form.maxParticipants),
      entryFee: parseFloat(form.entryFee),
      status: form.status as Tournament['status'],
    });
    setEditT(null);
    setForm(emptyForm);
  };

  const openEdit = (t: Tournament) => {
    setEditT(t);
    setForm({ name: t.name, description: t.description, date: t.date, maxParticipants: String(t.maxParticipants), entryFee: String(t.entryFee), status: t.status });
  };

  const TournamentForm = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input label="Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
      <Input label="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
      <Input label="Date" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
      <Input label="Max Participants" type="number" value={form.maxParticipants} onChange={e => setForm(p => ({ ...p, maxParticipants: e.target.value }))} />
      <Input label="Entry Fee ($)" type="number" value={form.entryFee} onChange={e => setForm(p => ({ ...p, entryFee: e.target.value }))} />
      <Select label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} options={STATUS_OPTIONS} />
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tournaments</h1>
          <p style={{ color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>Manage bowling competitions.</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setShowAdd(true); }}>+ Add Tournament</Button>
      </div>

      {tournaments.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' } as React.CSSProperties}>
          <div style={{ fontSize: '3rem' }}>🏆</div>
          <p style={{ marginTop: '1rem', color: 'var(--color-gray-400)' }}>No tournaments yet.</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {tournaments.map(t => (
            <Card key={t.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h2 style={{ fontWeight: 700 }}>{t.name}</h2>
                <Badge variant={t.status === 'upcoming' ? 'info' : t.status === 'ongoing' ? 'success' : 'neutral'}>{t.status}</Badge>
              </div>
              <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{t.description}</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', marginBottom: '1rem' }}>
                <div>📅 {formatDate(t.date)}</div>
                <div>👥 {t.registeredParticipants.length}/{t.maxParticipants} participants</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button size="sm" variant="ghost" onClick={() => openEdit(t)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => setDeleteId(t.id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Tournament">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {TournamentForm}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name || !form.date}>Add</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editT} onClose={() => setEditT(null)} title="Edit Tournament">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {TournamentForm}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setEditT(null)}>Cancel</Button>
            <Button onClick={handleEdit}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Tournament">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p>Delete this tournament?</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { if (deleteId) { deleteTournament(deleteId); setDeleteId(null); } }}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
