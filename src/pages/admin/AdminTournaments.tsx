import { useState } from 'react';
import { Trophy, Plus, Users, Trash2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import type { Tournament, TournamentStatus } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';

type TournamentForm = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  prizePool: string;
  entryFee: number;
  status: TournamentStatus;
  format: string;
};

const defaultForm: TournamentForm = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  registrationDeadline: '',
  maxParticipants: 16,
  prizePool: '',
  entryFee: 0,
  status: 'upcoming',
  format: 'Single Elimination',
};

export default function AdminTournaments() {
  const { tournaments, addTournament, updateTournament, deleteTournament } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TournamentForm>(defaultForm);
  const [inviteModal, setInviteModal] = useState<{ id: string; name: string } | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');

  const openAdd = () => {
    setEditId(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (t: Tournament) => {
    setEditId(t.id);
    setForm({
      name: t.name,
      description: t.description,
      startDate: t.startDate,
      endDate: t.endDate,
      registrationDeadline: t.registrationDeadline,
      maxParticipants: t.maxParticipants,
      prizePool: t.prizePool,
      entryFee: t.entryFee,
      status: t.status,
      format: t.format,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editId) {
      updateTournament(editId, {
        name: form.name,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        registrationDeadline: form.registrationDeadline,
        maxParticipants: form.maxParticipants,
        prizePool: form.prizePool,
        entryFee: form.entryFee,
        status: form.status,
        format: form.format,
      });
    } else {
      addTournament({
        name: form.name,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        registrationDeadline: form.registrationDeadline,
        maxParticipants: form.maxParticipants,
        prizePool: form.prizePool,
        entryFee: form.entryFee,
        status: form.status,
        format: form.format,
      });
    }
    setShowModal(false);
  };

  const handleInvite = () => {
    if (!inviteModal || !inviteEmail || !inviteName) return;
    const t = tournaments.find(t => t.id === inviteModal.id);
    if (!t) return;
    const participants = [
      ...t.participants,
      {
        userId: crypto.randomUUID(),
        name: inviteName,
        userName: inviteName,
        userEmail: inviteEmail,
        status: 'registered' as const,
        joinedAt: new Date().toISOString(),
      },
    ];
    updateTournament(inviteModal.id, { participants });
    setInviteEmail('');
    setInviteName('');
    setInviteModal(null);
  };

  const statusVariant = (s: TournamentStatus) => {
    if (s === 'upcoming') return 'info';
    if (s === 'ongoing') return 'success';
    if (s === 'completed') return 'neutral';
    return 'danger';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Tournaments</h1>
        <Button onClick={openAdd} size="sm">
          <Plus size={16} /> New Tournament
        </Button>
      </div>

      <div className="space-y-4">
        {tournaments.length === 0 && (
          <div className="text-center py-12 text-slate-400">No tournaments yet.</div>
        )}
        {tournaments.map(t => (
          <div key={t.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Trophy size={20} className="text-orange-500 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">{t.name}</div>
                  <span className="text-sm text-slate-500">{t.startDate} &ndash; {t.endDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                <span className="text-sm font-medium">${t.prizePool} prize</span>
                <Button size="sm" variant="secondary" onClick={() => setInviteModal({ id: t.id, name: t.name })}>
                  <Users size={14} /> Invite
                </Button>
                <Button size="sm" variant="secondary" onClick={() => openEdit(t)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => deleteTournament(t.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-2">{t.description}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
              <span>Format: {t.format}</span>
              <span>Entry: ${t.entryFee}</span>
              <span>Participants: {t.participants.length}/{t.maxParticipants}</span>
              <span>Deadline: {t.registrationDeadline}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Tournament' : 'New Tournament'}>
        <div className="p-6 space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            <Input label="End Date" type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
          </div>
          <Input label="Registration Deadline" type="date" value={form.registrationDeadline} onChange={e => setForm(f => ({ ...f, registrationDeadline: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Max Participants" type="number" value={form.maxParticipants} onChange={e => setForm(f => ({ ...f, maxParticipants: Number(e.target.value) }))} />
            <Input label="Entry Fee ($)" type="number" value={form.entryFee} onChange={e => setForm(f => ({ ...f, entryFee: Number(e.target.value) }))} />
          </div>
          <Input label="Prize Pool" value={form.prizePool} onChange={e => setForm(f => ({ ...f, prizePool: e.target.value }))} />
          <Input label="Format" value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))} />
          <Select
            label="Status"
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as TournamentStatus }))}
            options={[
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'ongoing', label: 'Ongoing' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      {/* Invite Modal */}
      <Modal isOpen={!!inviteModal} onClose={() => setInviteModal(null)} title={`Invite to ${inviteModal?.name}`}>
        <div className="p-6 space-y-4">
          <Input label="Participant Name" value={inviteName} onChange={e => setInviteName(e.target.value)} />
          <Input label="Participant Email" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setInviteModal(null)}>Cancel</Button>
            <Button onClick={handleInvite}>Invite</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
