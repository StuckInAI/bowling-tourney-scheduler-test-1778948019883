import { useState } from 'react';
import { Plus, Trash2, Edit2, Users } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import type { Tournament, TournamentStatus } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'purple';

function statusVariant(status: TournamentStatus): BadgeVariant {
  if (status === 'active') return 'success';
  if (status === 'upcoming') return 'info';
  if (status === 'completed') return 'neutral';
  if (status === 'draft') return 'warning';
  return 'danger';
}

const STATUS_OPTIONS: { value: TournamentStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const emptyForm = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'upcoming' as TournamentStatus,
  maxParticipants: 16,
  entryFee: 10,
  prizePool: 100,
  format: 'single-elimination',
};

export default function AdminTournaments() {
  const { tournaments, addTournament, updateTournament, deleteTournament, users } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [inviteModal, setInviteModal] = useState<Tournament | null>(null);
  const [inviteUserId, setInviteUserId] = useState('');

  const openAdd = () => {
    setEditingTournament(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (t: Tournament) => {
    setEditingTournament(t);
    setForm({
      name: t.name,
      description: t.description,
      startDate: t.startDate,
      endDate: t.endDate,
      status: t.status,
      maxParticipants: t.maxParticipants,
      entryFee: t.entryFee,
      prizePool: t.prizePool,
      format: t.format,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingTournament) {
      updateTournament(editingTournament.id, {
        name: form.name,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
        maxParticipants: form.maxParticipants,
        entryFee: form.entryFee,
        prizePool: form.prizePool,
        format: form.format,
      });
    } else {
      addTournament({
        name: form.name,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
        maxParticipants: form.maxParticipants,
        entryFee: form.entryFee,
        prizePool: form.prizePool,
        format: form.format,
        participants: [],
        matches: [],
      });
    }
    setModalOpen(false);
  };

  const handleInvite = () => {
    if (!inviteModal || !inviteUserId) return;
    const user = users.find(u => u.id === inviteUserId);
    if (!user) return;
    const alreadyIn = inviteModal.participants.find(p => p.userId === inviteUserId);
    if (alreadyIn) return;
    const participants = [
      ...inviteModal.participants,
      {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        status: 'registered' as const,
        joinedAt: new Date().toISOString(),
      },
    ];
    updateTournament(inviteModal.id, { participants });
    setInviteUserId('');
  };

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Tournaments</h1>
        <Button onClick={openAdd} size="sm">
          <Plus size={16} /> Add Tournament
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {tournaments.map(t => (
          <Card key={t.id} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-slate-800">{t.name}</span>
                <span className="text-sm text-slate-500">{t.startDate} &ndash; {t.endDate}</span>
                <span className="text-xs text-slate-400">{t.description}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                <span className="text-sm">{t.participants.length}/{t.maxParticipants} players</span>
                <span className="text-sm font-medium">${t.prizePool} prize</span>
                <Button size="sm" variant="secondary" onClick={() => setInviteModal(t)}>
                  <Users size={14} /> Participants
                </Button>
                <Button size="sm" variant="secondary" onClick={() => openEdit(t)}>
                  <Edit2 size={14} />
                </Button>
                <Button size="sm" variant="danger" onClick={() => deleteTournament(t.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {tournaments.length === 0 && (
          <Card className="text-center text-slate-400 py-12">No tournaments yet.</Card>
        )}
      </div>

      {/* Edit/Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTournament ? 'Edit Tournament' : 'Add Tournament'}>
        <div className="p-6 flex flex-col gap-4">
          <Input label="Name" value={form.name} onChange={e => handleChange('name', e.target.value)} />
          <Input label="Description" value={form.description} onChange={e => handleChange('description', e.target.value)} />
          <Input label="Start Date" type="date" value={form.startDate} onChange={e => handleChange('startDate', e.target.value)} />
          <Input label="End Date" type="date" value={form.endDate} onChange={e => handleChange('endDate', e.target.value)} />
          <Input label="Max Participants" type="number" value={form.maxParticipants} onChange={e => handleChange('maxParticipants', Number(e.target.value))} />
          <Input label="Entry Fee ($)" type="number" value={form.entryFee} onChange={e => handleChange('entryFee', Number(e.target.value))} />
          <Input label="Prize Pool ($)" type="number" value={form.prizePool} onChange={e => handleChange('prizePool', Number(e.target.value))} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={form.status}
              onChange={e => handleChange('status', e.target.value as TournamentStatus)}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Format</label>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={form.format}
              onChange={e => handleChange('format', e.target.value)}
            >
              <option value="single-elimination">Single Elimination</option>
              <option value="double-elimination">Double Elimination</option>
              <option value="round-robin">Round Robin</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Participants Modal */}
      <Modal isOpen={!!inviteModal} onClose={() => setInviteModal(null)} title="Manage Participants">
        {inviteModal && (
          <div className="p-6 flex flex-col gap-4">
            <div className="flex gap-2">
              <select
                className="flex-1 border rounded-md px-3 py-2 text-sm"
                value={inviteUserId}
                onChange={e => setInviteUserId(e.target.value)}
              >
                <option value="">Select a user...</option>
                {users.filter(u => u.role === 'member').map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <Button size="sm" onClick={handleInvite}>Add</Button>
            </div>
            <div className="flex flex-col gap-2">
              {inviteModal.participants.length === 0 && (
                <p className="text-sm text-slate-400">No participants yet.</p>
              )}
              {inviteModal.participants.map(p => (
                <div key={p.userId} className="flex items-center justify-between text-sm border rounded-md px-3 py-2">
                  <span>{p.userName} ({p.userEmail})</span>
                  <Badge variant="info">{p.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
