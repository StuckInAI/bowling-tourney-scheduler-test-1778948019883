import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import type { Tournament, TournamentFormat, TournamentStatus } from '@/types';

const emptyForm = {
  name: '',
  description: '',
  format: 'single-elimination' as TournamentFormat,
  startDate: '',
  endDate: '',
  prize: '',
  maxParticipants: 8,
};

export default function AdminTournaments() {
  const { tournaments, users, addTournament, updateTournament, deleteTournament } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editTournament, setEditTournament] = useState<Tournament | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [inviteModal, setInviteModal] = useState<Tournament | null>(null);

  const members = users.filter(u => u.role === 'member');

  const openCreate = () => {
    setEditTournament(null);
    setForm(emptyForm);
    setSelectedMembers([]);
    setShowModal(true);
  };

  const openEdit = (t: Tournament) => {
    setEditTournament(t);
    setForm({
      name: t.name,
      description: t.description,
      format: t.format,
      startDate: t.startDate,
      endDate: t.endDate,
      prize: t.prize || '',
      maxParticipants: t.maxParticipants || 8,
    });
    setSelectedMembers(t.participants.map(p => p.userId));
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.startDate || !form.endDate) return;
    const participants = selectedMembers.map(uid => ({ userId: uid, status: 'pending' as const }));
    if (editTournament) {
      updateTournament({
        ...editTournament,
        ...form,
        participants,
      });
    } else {
      addTournament({
        ...form,
        participants,
        status: 'draft',
      });
    }
    setShowModal(false);
  };

  const handleStatusChange = (t: Tournament, status: TournamentStatus) => {
    updateTournament({ ...t, status });
  };

  const toggleMember = (uid: string) => {
    setSelectedMembers(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const formatVariant = (format: TournamentFormat) => {
    switch (format) {
      case 'single-elimination': return 'info';
      case 'round-robin': return 'success';
      case 'custom': return 'purple';
      default: return 'neutral';
    }
  };

  const statusVariant = (status: TournamentStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'completed': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tournament Management</h1>
          <p className="text-slate-500">{tournaments.length} tournaments.</p>
        </div>
        <Button onClick={openCreate}>+ New Tournament</Button>
      </div>

      {tournaments.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">🏆</div>
          <p className="text-slate-500 mb-4">No tournaments yet.</p>
          <Button onClick={openCreate}>Create First Tournament</Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {tournaments.map(t => (
            <Card key={t.id}>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                    <Badge variant={formatVariant(t.format)}>{t.format}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{t.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <span>📅 {formatDate(new Date(t.startDate + 'T12:00:00'))} – {formatDate(new Date(t.endDate + 'T12:00:00'))}</span>
                    <span>👥 {t.participants.length} invited</span>
                    <span>✅ {t.participants.filter(p => p.status === 'accepted').length} accepted</span>
                    {t.prize && <span>🏆 {t.prize}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="secondary" onClick={() => openEdit(t)}>Edit</Button>
                  <Button size="sm" variant="secondary" onClick={() => setInviteModal(t)}>Invites</Button>
                  {t.status === 'draft' && (
                    <Button size="sm" onClick={() => handleStatusChange(t, 'active')}>Activate</Button>
                  )}
                  {t.status === 'active' && (
                    <Button size="sm" variant="secondary" onClick={() => handleStatusChange(t, 'completed')}>Complete</Button>
                  )}
                  <Button size="sm" variant="danger" onClick={() => deleteTournament(t.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editTournament ? 'Edit Tournament' : 'Create Tournament'}
      >
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tournament Name</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Summer Invitational"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm"
              rows={2}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Format</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-white"
              value={form.format}
              onChange={e => setForm({ ...form, format: e.target.value as TournamentFormat })}
            >
              <option value="single-elimination">Single Elimination</option>
              <option value="round-robin">Round Robin</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.endDate}
                onChange={e => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Prize</label>
              <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.prize}
                onChange={e => setForm({ ...form, prize: e.target.value })}
                placeholder="$500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Participants</label>
              <input
                type="number"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.maxParticipants}
                onChange={e => setForm({ ...form, maxParticipants: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Invite Members</label>
            <div className="border rounded-md max-h-40 overflow-y-auto">
              {members.map(m => (
                <label key={m.id} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(m.id)}
                    onChange={() => toggleMember(m.id)}
                  />
                  <span className="text-sm">{m.name} ({m.email})</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editTournament ? 'Save Changes' : 'Create Tournament'}</Button>
          </div>
        </div>
      </Modal>

      {/* Invite Status Modal */}
      <Modal
        isOpen={!!inviteModal}
        onClose={() => setInviteModal(null)}
        title={`Invites: ${inviteModal?.name}`}
      >
        <div className="p-6">
          {inviteModal?.participants.length === 0 ? (
            <p className="text-slate-500">No members invited yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {inviteModal?.participants.map(p => {
                const user = users.find(u => u.id === p.userId);
                return (
                  <div key={p.userId} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="text-sm font-medium">{user?.name || p.userId}</span>
                    <Badge variant={
                      p.status === 'accepted' ? 'success' :
                      p.status === 'declined' ? 'danger' : 'warning'
                    }>
                      {p.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={() => setInviteModal(null)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
