import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function MemberTournaments() {
  const { currentUser, tournaments, registerForTournament } = useAppContext();

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Tournaments</h1>
        <p style={{ color: '#64748b' }}>Join competitive events and win prizes.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {tournaments.map((t) => {
          const isRegistered = currentUser ? t.participants.includes(currentUser.id) : false;
          const isFull = t.participants.length >= t.maxParticipants;

          return (
            <Card key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontWeight: 700 }}>{t.title}</h3>
                <Badge variant={t.status === 'upcoming' ? 'info' : 'neutral'}>
                  {t.status.toUpperCase()}
                </Badge>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#475569', flex: 1 }}>{t.description}</p>
              <div style={{ fontSize: '0.875rem' }}>
                <div style={{ color: '#475569' }}>📅 {formatDate(new Date(t.date))} at {t.time}</div>
                <div style={{ color: '#475569' }}>👥 {t.participants.length} / {t.maxParticipants} participants</div>
              </div>
              
              <Button 
                fullWidth 
                variant={isRegistered ? 'secondary' : 'accent'}
                disabled={isRegistered || isFull || t.status !== 'upcoming'}
                onClick={() => currentUser && registerForTournament(t.id, currentUser.id)}
              >
                {isRegistered ? 'Already Registered' : isFull ? 'Tournament Full' : 'Register Now'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}