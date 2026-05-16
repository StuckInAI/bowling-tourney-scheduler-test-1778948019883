import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function MemberTournaments() {
  const { currentUser, tournaments, updateTournament } = useAppContext();

  const myTournaments = tournaments.filter(t =>
    t.participants.some(p => p.userId === currentUser?.id)
  );

  const handleRespond = (tournamentId: string, response: 'accepted' | 'declined') => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament || !currentUser) return;
    const updated = {
      ...tournament,
      participants: tournament.participants.map(p =>
        p.userId === currentUser.id ? { ...p, status: response } : p
      ),
    };
    updateTournament(updated);
  };

  const getMyStatus = (tournament: typeof tournaments[0]) =>
    tournament.participants.find(p => p.userId === currentUser?.id)?.status;

  const statusVariant = (status: string) => {
    switch (status) {
      case 'accepted': return 'success' as const;
      case 'declined': return 'danger' as const;
      case 'pending': return 'warning' as const;
      default: return 'neutral' as const;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">My Tournaments</h1>
        <p className="text-slate-500">View tournament invites and your bracket status.</p>
      </div>

      {myTournaments.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">🏆</div>
          <p className="text-slate-500">No tournament invites yet.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {myTournaments.map(t => {
            const myStatus = getMyStatus(t);
            return (
              <Card key={t.id}>
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg">{t.name}</h3>
                      <Badge variant={t.status === 'active' ? 'success' : t.status === 'draft' ? 'warning' : 'neutral'}>
                        {t.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">{t.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <span>📅 {formatDate(new Date(t.startDate + 'T12:00:00'))}</span>
                      <span>🎮 {t.format}</span>
                      <span>👥 {t.participants.length} participants</span>
                      {t.prize && <span>🏆 {t.prize}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusVariant(myStatus || '')}>
                      {myStatus || 'unknown'}
                    </Badge>
                    {myStatus === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleRespond(t.id, 'accepted')}>Accept</Button>
                        <Button size="sm" variant="danger" onClick={() => handleRespond(t.id, 'declined')}>Decline</Button>
                      </div>
                    )}
                  </div>
                </div>

                {t.matches && t.matches.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-sm mb-2">Match Schedule</h4>
                    <div className="flex flex-col gap-1">
                      {t.matches.filter(m => m.participant1Id === currentUser?.id || m.participant2Id === currentUser?.id).map(m => (
                        <div key={m.id} className="text-sm bg-slate-50 rounded p-2 flex justify-between">
                          <span>Round {m.round}</span>
                          {m.winnerId && <Badge variant="success">Won</Badge>}
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
