import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import type { Tournament, TournamentStatus } from '@/types';

export default function AdminTournaments() {
  const { tournaments, addTournament, updateTournament, deleteTournament } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    maxParticipants: '16',
    prize: '',
    entryFee: '0',
    status: 'open' as TournamentStatus,
  });

  const resetForm = () => {
    setForm({ name: '', description: '', startDate: '', endDate: '', maxParticipants: '16', prize: '', entryFee: '0', status: 'open' });
    setEditingTournament(null);
  };

  const openCreate = () => { resetForm(); setShowModal(true); };

  const openEdit = (t: Tournament) => {
    setEditingTournament(t);
    setForm({
      name: t.name,
      description: t.description,
      startDate: t.startDate,
      endDate: t.endDate,
      maxParticipants: String(t.maxParticipants),
      prize: t.prize || '',
      entryFee: String(t.entryFee || 0),
      status: t.status,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.startDate || !form.endDate) return;
    if (editingTournament) {
      updateTournament(editingTournament.id, {
        ...form,
        maxParticipants: Number(form.maxParticipants),
        entryFee: Number(form.entryFee),
      });
    } else {
      const t: Tournament = {
        id: crypto.randomUUID(),
        ...form,
        maxParticipants: Number(form.maxParticipants),
        entryFee: Number(form.entryFee),
        participants: [],
        createdAt: new Date().toISOString(),
      };
      addTournament(t);
    }
    setShowModal(false);
    resetForm();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tournaments</h1>
        <Button onClick={openCreate}>+ New Tournament</Button>
      </div>

      {tournaments.length === 0 ? (
        <Card><p style={{ textAlign: 'center', color: '#64748b' }}>No tournaments yet.</p></Card>
      ) : (
        tournaments.map((t) => (
          <Card key={t.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h2 style={{ fontWeight: 700 }}>{t.name}</h2>
                  <Badge variant={t.status === 'open' ? 'success' : t.status === 'closed' ? 'warning' : 'neutral'}>
                    {t.status}
                  </Badge>
                </div>
                <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>{t.description}</p>
                <div style={{ fontSize: '0.875rem', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <span>📅 {formatDate(new Date(t.startDate))} – {formatDate(new Date(t.endDate))}</span>
                  <span>👥 {t.participants.length} / {t.maxParticipants}</span>
                  {t.prize && <span>🏆 {t.prize}</span>}
                  {t.entryFee !== undefined && t.entryFee > 0 && <span>💰 ${t.entryFee}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button size="sm" variant="secondary" onClick={() => openEdit(t)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => deleteTournament(t.id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingTournament ? 'Edit Tournament' : 'New Tournament'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Tournament Name" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required />
          <Input label="Description" value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm(p => ({ ...p, startDate: e.target.value }))} required />
            <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm(p => ({ ...p, endDate: e.target.value }))} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Max Participants" type="number" value={form.maxParticipants} onChange={(e) => setForm(p => ({ ...p, maxParticipants: e.target.value }))} />
            <Input label="Entry Fee ($)" type="number" value={form.entryFee} onChange={(e) => setForm(p => ({ ...p, entryFee: e.target.value }))} />
          </div>
          <Input label="Prize" value={form.prize} onChange={(e) => setForm(p => ({ ...p, prize: e.target.value }))} />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm(p => ({ ...p, status: e.target.value as TournamentStatus }))}
            options={[
              { value: 'open', label: 'Open' },
              { value: 'closed', label: 'Closed' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
