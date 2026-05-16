import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export default function MemberTournaments() {
  const { currentUser, tournaments, registerForTournament } = useAppContext();
  if (!currentUser) return null;

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' => {
    if (status === 'upcoming') return 'info';
    if (status === 'ongoing') return 'success';
    if (status === 'completed') return 'neutral';
    return 'danger';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tournaments</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>Join upcoming bowling tournaments</p>
      </div>

      {tournaments.length === 0 ? (
        <Card><p style={{ textAlign: 'center', color: 'var(--color-gray-500)', padding: '2rem' }}>No tournaments available.</p></Card>
      ) : (
        tournaments.map(t => (
          <Card key={t.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontWeight: 700 }}>{t.name}</h3>
                  <Badge variant={getStatusVariant(t.status)}>{t.status}</Badge>
                </div>
                <p style={{ color: 'var(--color-gray-600)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{t.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                  <div>📅 {formatDate(new Date(t.startDate))} – {formatDate(new Date(t.endDate))}</div>
                  <div>👥 {t.currentParticipants} / {t.maxParticipants} participants</div>
                  {t.prize && <div>🏆 Prize: {t.prize}</div>}
                </div>
              </div>
              <div>
                {t.registeredUserIds.includes(currentUser.id) ? (
                  <Badge variant="success">Registered</Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => registerForTournament(t.id, currentUser.id)}
                    disabled={t.status !== 'upcoming' || t.currentParticipants >= t.maxParticipants}
                  >
                    Register
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
