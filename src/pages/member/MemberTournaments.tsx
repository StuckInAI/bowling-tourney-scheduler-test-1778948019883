import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export default function MemberTournaments() {
  const { currentUser, tournaments, updateTournament } = useAppContext();

  const isRegistered = (tournamentId: string) => {
    const t = tournaments.find(t => t.id === tournamentId);
    return t?.participants.some(p => p.userId === currentUser?.id) ?? false;
  };

  const handleRegister = (tournamentId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament || !currentUser) return;
    const updated = {
      ...tournament,
      participants: [
        ...tournament.participants,
        { userId: currentUser.id, name: currentUser.name, status: 'registered' as const },
      ],
    };
    updateTournament(tournament.id, { participants: updated.participants });
  };

  const getMyStatus = (tournamentId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    return tournament?.participants.find(p => p.userId === currentUser?.id)?.status;
  };

  const statusVariant = (status: string) => {
    if (status === 'upcoming') return 'info';
    if (status === 'ongoing') return 'success';
    return 'neutral';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Tournaments</h1>
      {tournaments.length === 0 ? (
        <Card>
          <p className="text-slate-500 text-center py-8">No tournaments available.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {tournaments.map(t => {
            const registered = isRegistered(t.id);
            const myStatus = getMyStatus(t.id);
            const full = t.participants.length >= t.maxParticipants;
            return (
              <Card key={t.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-800">{t.name}</h3>
                      <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                    </div>
                    {t.description && (
                      <p className="text-sm text-slate-500 mb-2">{t.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>📅 {formatDate(new Date(t.startDate + 'T12:00:00'))}</span>
                      {t.format && <span>🎮 {t.format}</span>}
                      <span>👥 {t.participants.length} / {t.maxParticipants} participants</span>
                      {t.entryFee !== undefined && <span>💰 Entry: ${t.entryFee}</span>}
                      {t.prize && <span>🏆 Prize: {t.prize}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {registered ? (
                      <Badge variant="success">Registered</Badge>
                    ) : t.status === 'upcoming' && !full ? (
                      <Button size="sm" onClick={() => handleRegister(t.id)}>
                        Register
                      </Button>
                    ) : full ? (
                      <Badge variant="warning">Full</Badge>
                    ) : null}
                    {myStatus && (
                      <span className="text-xs text-slate-400">My status: {myStatus}</span>
                    )}
                  </div>
                </div>
                {t.matches && t.matches.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <p className="text-xs font-semibold text-slate-600 mb-2">My Matches</p>
                    {t.matches
                      .filter(m => m.participant1Id === currentUser?.id || m.participant2Id === currentUser?.id)
                      .map(m => (
                        <div key={m.id} className="text-xs text-slate-500">
                          Match vs opponent
                          {m.winnerId && (
                            <span className="ml-2 font-medium">
                              {m.winnerId === currentUser?.id ? '✅ Won' : '❌ Lost'}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
