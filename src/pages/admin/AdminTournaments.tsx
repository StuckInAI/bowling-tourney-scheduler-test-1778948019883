import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { Tournament } from '@/types';

type TournamentForm = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  date: string;
  maxParticipants: string;
  prize: string;
  entryFee: string;
};

const emptyForm: TournamentForm = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  date: '',
  maxParticipants: '',
  prize: '',
  entryFee: '',
};

export default function AdminTournaments() {
  const { tournaments, addTournament, updateTournament, deleteTournament } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tournament | null>(null);
  const [form, setForm] = useState<TournamentForm>(emptyForm);

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (t: Tournament) => {
    setEditTarget(t);
    setForm({
      name: t.name,
      description: t.description,
      startDate: t.startDate,
      endDate: t.endDate,
      date: t.date,
      maxParticipants: String(t.maxParticipants),
      prize: t.prize ?? '',
      entryFee: t.entryFee !== undefined ? String(t.entryFee) : '',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Omit<Tournament, 'id' | 'currentParticipants' | 'registeredUserIds'> = {
      name: form.name,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      date: form.date || form.startDate,
      maxParticipants: Number(form.maxParticipants),
      status: 'upcoming',
      prize: form.prize || undefined,
      entryFee: form.entryFee ? Number(form.entryFee) : undefined,
    };
    if (editTarget) {
      updateTournament({ ...editTarget, ...data });
    } else {
      addTournament({ ...data, currentParticipants: 0, registeredUserIds: [] });
    }
    setModalOpen(false);
  };

  const f = (field: keyof TournamentForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Tournaments</h1>
        <Button onClick={openAdd}>+ Add Tournament</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tournaments.map(t => (
          <Card key={t.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>{t.name}</h3>
                <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t.description}</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
                  <span>📅 {formatDate(new Date(t.startDate))} – {formatDate(new Date(t.endDate))}</span>
                  <span>👥 {t.currentParticipants} / {t.maxParticipants}</span>
                  {t.prize && <span>🏆 {t.prize}</span>}
                  {t.entryFee !== undefined && t.entryFee > 0 && <span>💰 ${t.entryFee}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge variant={t.status === 'upcoming' ? 'info' : t.status === 'ongoing' ? 'success' : 'neutral'}>
                  {t.status}
                </Badge>
                <Button size="sm" variant="secondary" onClick={() => openEdit(t)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => deleteTournament(t.id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Tournament' : 'Add Tournament'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Name" value={form.name} onChange={f('name')} required />
          <Input label="Description" value={form.description} onChange={f('description')} />
          <Input label="Start Date" type="date" value={form.startDate} onChange={f('startDate')} required />
          <Input label="End Date" type="date" value={form.endDate} onChange={f('endDate')} required />
          <Input label="Max Participants" type="number" value={form.maxParticipants} onChange={f('maxParticipants')} required />
          <Input label="Prize" value={form.prize} onChange={f('prize')} />
          <Input label="Entry Fee ($)" type="number" value={form.entryFee} onChange={f('entryFee')} />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editTarget ? 'Save Changes' : 'Add Tournament'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
