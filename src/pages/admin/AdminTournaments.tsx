import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import type { Tournament, TournamentFormat, TournamentStatus } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const FORMAT_OPTIONS: { value: TournamentFormat; label: string }[] = [
  { value: 'single_elimination', label: 'Single Elimination' },
  { value: 'double_elimination', label: 'Double Elimination' },
  { value: 'round_robin', label: 'Round Robin' },
  { value: 'league', label: 'League' },
];

const STATUS_OPTIONS: { value: TournamentStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const emptyForm = {
  name: '',
  description: '',
  format: 'single_elimination' as TournamentFormat,
  startDate: '',
  endDate: '',
  maxParticipants: '16',
  entryFee: '0',
  prizePool: '',
  status: 'draft' as TournamentStatus,
};

export default function AdminTournaments() {
  const { tournaments, users, addTournament, updateTournament, deleteTournament } = useAppContext();
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; tournament?: Tournament } | null>(null);
  const [inviteModal, setInviteModal] = useState<Tournament | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [form, setForm] = useState(emptyForm);

  const members = users.filter(u => u.role === 'member');

  const handleOpen = (mode: 'create' | 'edit', t?: Tournament) => {
    if (mode === 'edit' && t) {
      setForm({
        name: t.name,
        description: t.description,
        format: t.format,
        startDate: t.startDate,
        endDate: t.endDate,
        maxParticipants: String(t.maxParticipants),
        entryFee: String(t.entryFee),
        prizePool: t.prizePool,
        status: t.status,
      });
    } else {
      setForm(emptyForm);
    }
    setModal({ mode, tournament: t });
  };

  const handleOpenInvite = (t: Tournament) => {
    setInviteModal(t);
    setSelectedMembers(t.participants.map(p => p.userId));
  };

  const handleSave = () => {
    if (modal?.mode === 'edit' && modal.tournament) {
      updateTournament({
        ...modal.tournament,
        name: form.name,
        description: form.description,
        format: form.format,
        startDate: form.startDate,
        endDate: form.endDate,
        maxParticipants: Number(form.maxParticipants),
        entryFee: Number(form.entryFee),
        prizePool: form.prizePool,
        status: form.status,
      });
    } else {
      const newTournament: Tournament = {
        id: `tournament-${crypto.randomUUID()}`,
        name: form.name,
        description: form.description,
        format: form.format,
        startDate: form.startDate,
        endDate: form.endDate,
        maxParticipants: Number(form.maxParticipants),
        participants: [],
        entryFee: Number(form.entryFee),
        prizePool: form.prizePool,
        status: form.status,
        createdAt: new Date().toISOString(),
      };
      addTournament(newTournament);
    }
    setModal(null);
  };

  const handleSaveInvites = () => {
    if (!inviteModal) return;
    const participants = selectedMembers.map(id => {
      const user = users.find(u => u.id === id);
      return {
        userId: id,
        userName: user?.name ?? '',
        userEmail: user?.email ?? '',
        registeredAt: new Date().toISOString(),
      };
    });
    updateTournament({ ...inviteModal, participants });
    setInviteModal(null);
  };

  const statusVariant = (s: TournamentStatus) => {
    if (s === 'upcoming') return 'info';
    if (s === 'ongoing') return 'success';
    if (s === 'completed') return 'neutral';
    if (s === 'cancelled') return 'danger';
    if (s === 'draft') return 'warning';
    return 'neutral';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tournaments</h1>
        <Button onClick={() => handleOpen('create')}>+ Create Tournament</Button>
      </div>

      <div className="grid gap-3">
        {tournaments.map(t => (
          <Card key={t.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{t.name}</h3>
                  <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                </div>
                <p className="text-sm text-slate-500">{t.description}</p>
                <p className="text-xs text-slate-400 mt-1">{t.startDate} → {t.endDate} | {t.participants.length}/{t.maxParticipants} participants</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="secondary" onClick={() => handleOpenInvite(t)}>Manage Participants</Button>
                <Button size="sm" variant="secondary" onClick={() => handleOpen('edit', t)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => deleteTournament(t.id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'create' ? 'Create Tournament' : 'Edit Tournament'}>
        <div className="p-6 space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Select
            label="Format"
            value={form.format}
            options={FORMAT_OPTIONS}
            onChange={e => setForm(f => ({ ...f, format: e.target.value as TournamentFormat }))}
          />
          <Select
            label="Status"
            value={form.status}
            options={STATUS_OPTIONS}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as TournamentStatus }))}
          />
          <Input label="Start Date" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
          <Input label="End Date" type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
          <Input label="Max Participants" type="number" value={form.maxParticipants} onChange={e => setForm(f => ({ ...f, maxParticipants: e.target.value }))} />
          <Input label="Entry Fee ($)" type="number" value={form.entryFee} onChange={e => setForm(f => ({ ...f, entryFee: e.target.value }))} />
          <Input label="Prize Pool" value={form.prizePool} onChange={e => setForm(f => ({ ...f, prizePool: e.target.value }))} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Invite Modal */}
      <Modal isOpen={!!inviteModal} onClose={() => setInviteModal(null)} title="Manage Participants">
        <div className="p-6 space-y-3">
          {inviteModal?.participants.length === 0 ? (
            <p className="text-slate-500 text-sm">No participants yet.</p>
          ) : (
            <div className="space-y-2">
              {inviteModal?.participants.map(p => {
                const checked = selectedMembers.includes(p.userId);
                return (
                  <label key={p.userId} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={e => {
                        if (e.target.checked) setSelectedMembers(prev => [...prev, p.userId]);
                        else setSelectedMembers(prev => prev.filter(id => id !== p.userId));
                      }}
                    />
                    {p.userName} ({p.userEmail})
                  </label>
                );
              })}
            </div>
          )}
          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-2">Add from members:</p>
            {members.filter(m => !selectedMembers.includes(m.id)).map(m => (
              <label key={m.id} className="flex items-center gap-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => setSelectedMembers(prev => [...prev, m.id])}
                />
                {m.name} ({m.email})
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setInviteModal(null)}>Cancel</Button>
            <Button onClick={handleSaveInvites}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
