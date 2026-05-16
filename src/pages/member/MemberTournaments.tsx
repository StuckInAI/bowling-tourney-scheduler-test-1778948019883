import { useAppContext } from '@/context/AppContext';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

export default function MemberTournaments() {
  const { tournaments, currentUser, joinTournament } = useAppContext();

  const isRegistered = (tournamentId: string) =>
    currentUser ? tournaments.find(t => t.id === tournamentId)?.participants.includes(currentUser.id) : false;

  if (tournaments.length === 0) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
          <h2>No Tournaments Available</h2>
          <p style={{ color: '#64748b' }}>Check back later for upcoming tournaments.</p>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Tournaments</h1>
      {tournaments.map((t) => (
        <Card key={t.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{t.name}</h2>
                <Badge variant={t.status === 'open' ? 'success' : t.status === 'closed' ? 'warning' : 'neutral'}>
                  {t.status}
                </Badge>
              </div>
              <p style={{ color: '#64748b', marginBottom: '0.75rem' }}>{t.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: '#475569' }}>
                <div>📅 {formatDate(new Date(t.startDate))} – {formatDate(new Date(t.endDate))}</div>
                <div>👥 {t.participants.length} / {t.maxParticipants} participants</div>
                {t.entryFee !== undefined && t.entryFee > 0 && <div>💰 Entry fee: ${t.entryFee}</div>}
                {t.prize && <div>🏆 Prize: {t.prize}</div>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              {t.status === 'open' && currentUser && (
                isRegistered(t.id) ? (
                  <Badge variant="success">✓ Registered</Badge>
                ) : (
                  <Button size="sm" disabled={t.participants.length >= t.maxParticipants} onClick={() => joinTournament(t.id, currentUser.id)}>
                    {t.participants.length >= t.maxParticipants ? 'Full' : 'Join'}
                  </Button>
                )
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
