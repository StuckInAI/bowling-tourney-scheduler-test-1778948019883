import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export default function MemberTournaments() {
  const { tournaments, currentUser } = useAppContext();

  const statusVariant = (status: string) => {
    if (status === 'upcoming') return 'info';
    if (status === 'ongoing') return 'success';
    return 'neutral';
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Tournaments</h2>
      {tournaments.length === 0 && <p>No tournaments available.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tournaments.map((t) => (
          <Card key={t.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>{t.name}</h3>
                <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>📅 {formatDate(new Date(t.startDate))} – {formatDate(new Date(t.endDate))}</div>
                <div>👥 {t.currentParticipants} / {t.maxParticipants} participants</div>
                {t.entryFee !== undefined && t.entryFee > 0 && <div>💰 Entry fee: ${t.entryFee}</div>}
                <div>🏆 Prize: {t.prize}</div>
              </div>
            </div>
            {t.description && <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#475569' }}>{t.description}</p>}
            {t.status === 'upcoming' && currentUser && (
              <div style={{ marginTop: '1rem' }}>
                {t.registeredUserIds.includes(currentUser.id) ? (
                  <Badge variant="success">Registered</Badge>
                ) : (
                  <Button size="sm" onClick={() => {/* register logic */}}>Register</Button>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
