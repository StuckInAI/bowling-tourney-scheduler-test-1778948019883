import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function MemberTournaments() {
  const { currentUser, tournaments, registerForTournament } = useAppContext();

  if (!currentUser) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tournaments</h1>
        <p style={{ color: '#64748b' }}>Participate in local leagues and competitive events.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {tournaments.map(t => {
          const isRegistered = t.registeredUserIds.includes(currentUser.id);
          const isFull = t.participants.length >= t.maxParticipants;

          return (
            <Card key={t.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 700 }}>{t.title}</h3>
                <Badge variant={t.status === 'upcoming' ? 'info' : 'neutral'}>{t.status}</Badge>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>{t.description}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                <div style={{ color: '#475569' }}>📅 {formatDate(new Date(t.date))} at {t.time}</div>
                <div style={{ color: '#475569' }}>👥 {t.participants.length} / {t.maxParticipants} participants</div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                {isRegistered ? (
                  <Button fullWidth variant="secondary" disabled>Already Registered</Button>
                ) : (
                  <Button 
                    fullWidth 
                    variant="primary"
                    disabled={t.status !== 'upcoming' || isFull}
                    onClick={() => registerForTournament(t.id)}
                  >
                    {isFull ? 'Tournament Full' : 'Register Now'}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}