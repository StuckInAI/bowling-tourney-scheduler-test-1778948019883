import { useAppContext } from '@/context/AppContext';
import { formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function MemberTournaments() {
  const { currentUser, tournaments, joinTournament, leaveTournament } = useAppContext();

  const isJoined = (tournamentId: string) =>
    currentUser ? tournaments.find(t => t.id === tournamentId)?.registeredParticipants.includes(currentUser.id) : false;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tournaments 🏆</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>Join exciting bowling competitions.</p>
      </div>

      {tournaments.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' } as React.CSSProperties}>
          <div style={{ fontSize: '3rem' }}>🏆</div>
          <p style={{ marginTop: '1rem', color: 'var(--color-gray-500)' }}>No tournaments available yet.</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {tournaments.map(t => (
            <Card key={t.id}>
              <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{t.name}</h2>
                <Badge variant={t.status === 'upcoming' ? 'info' : t.status === 'ongoing' ? 'success' : 'neutral'}>
                  {t.status}
                </Badge>
              </div>
              <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{t.description}</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', marginBottom: '1rem' }}>
                <div>📅 {formatDate(t.date)}</div>
                <div>👥 {t.registeredParticipants.length} / {t.maxParticipants} participants</div>
                {t.entryFee > 0 && <div>💰 Entry fee: ${t.entryFee}</div>}
              </div>
              {t.status === 'upcoming' && currentUser && (
                isJoined(t.id) ? (
                  <Button variant="danger" size="sm" onClick={() => leaveTournament(t.id, currentUser.id)}>Leave</Button>
                ) : (
                  <Button size="sm" disabled={t.registeredParticipants.length >= t.maxParticipants} onClick={() => joinTournament(t.id, currentUser.id)}>
                    {t.registeredParticipants.length >= t.maxParticipants ? 'Full' : 'Join'}
                  </Button>
                )
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
