import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function MemberTournaments() {
  const { tournaments, currentUser, registerForTournament } = useAppContext();
  if (!currentUser) return null;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Tournaments</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tournaments.map(t => (
          <Card key={t.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>{t.name}</h3>
                <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
                  <div>📅 {formatDate(new Date(t.startDate))} – {formatDate(new Date(t.endDate))}</div>
                  <div>👥 {t.currentParticipants} / {t.maxParticipants} participants</div>
                  {t.entryFee !== undefined && t.entryFee > 0 && <div>💰 Entry fee: ${t.entryFee}</div>}
                  <div>🏆 Prize: {t.prize}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                <Badge variant={t.status === 'upcoming' ? 'info' : t.status === 'ongoing' ? 'success' : 'neutral'}>
                  {t.status}
                </Badge>
                {t.registeredUserIds.includes(currentUser.id) ? (
                  <Badge variant="success">Registered</Badge>
                ) : (
                  <Button
                    size="sm"
                    disabled={t.status !== 'upcoming' || t.currentParticipants >= t.maxParticipants}
                    onClick={() => registerForTournament(t.id, currentUser.id)}
                  >
                    Register
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
