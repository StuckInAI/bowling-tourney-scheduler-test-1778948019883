import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function MemberTournaments() {
  const { tournaments, currentUser, updateTournament } = useAppContext();

  const handleRegister = (tournamentId: string) => {
    if (!currentUser) return;
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;
    const alreadyRegistered = tournament.participants.some(p => p.userId === currentUser.id);
    if (alreadyRegistered) return;
    const newParticipant = {
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      name: currentUser.name,
      status: 'registered' as const,
      joinedAt: new Date().toISOString(),
    };
    const updated = {
      ...tournament,
      participants: [...tournament.participants, newParticipant],
    };
    updateTournament(tournament.id, { participants: updated.participants });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Tournaments</h1>
      {tournaments.length === 0 ? (
        <Card><p className="text-slate-500">No tournaments available.</p></Card>
      ) : (
        <div className="space-y-4">
          {tournaments.map(t => {
            const isRegistered = t.participants.some(p => p.userId === currentUser?.id);
            const isFull = t.participants.length >= t.maxParticipants;
            const myMatches = t.matches
              .filter(m => m.participant1Id === currentUser?.id || m.participant2Id === currentUser?.id);

            return (
              <Card key={t.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{t.name}</h2>
                    <p className="text-sm text-slate-500 mt-0.5">{t.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-600 mt-2">
                      <span>📅 {t.date}</span>
                      <span>⏰ {t.startTime} - {t.endTime}</span>
                      <span>👥 {t.participants.length}/{t.maxParticipants}</span>
                      <span>💰 Entry: ${t.entryFee}</span>
                      {t.prize && <span>🏆 Prize: {t.prize}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={
                      t.status === 'upcoming' ? 'info' :
                      t.status === 'ongoing' ? 'warning' :
                      t.status === 'completed' ? 'success' : 'danger'
                    }>{t.status}</Badge>
                    {t.status === 'upcoming' && (
                      <Button
                        size="sm"
                        variant={isRegistered ? 'secondary' : 'primary'}
                        disabled={isRegistered || isFull}
                        onClick={() => handleRegister(t.id)}
                      >
                        {isRegistered ? 'Registered' : isFull ? 'Full' : 'Register'}
                      </Button>
                    )}
                  </div>
                </div>

                {myMatches.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <h3 className="text-sm font-semibold mb-2">My Matches</h3>
                    <div className="space-y-1">
                      {myMatches.map(m => (
                        <div key={m.id} className="text-xs text-slate-600 flex gap-2">
                          <span>Round {m.round}</span>
                          <span>•</span>
                          <span>{m.status}</span>
                          {m.winnerId && <span>• Winner: {m.winnerId === currentUser?.id ? 'You' : 'Opponent'}</span>}
                        </div>
                      ))}
                    </div>
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
