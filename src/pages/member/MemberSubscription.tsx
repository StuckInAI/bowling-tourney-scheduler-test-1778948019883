import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const plans = [
  { id: 'basic', name: 'Basic', price: 29, features: ['5 bookings/month', 'Standard lanes', 'Email support'] },
  { id: 'standard', name: 'Standard', price: 49, features: ['15 bookings/month', 'Priority lanes', 'Tournament access', 'Phone support'] },
  { id: 'premium', name: 'Premium', price: 79, features: ['Unlimited bookings', 'VIP lanes', 'All tournaments', '24/7 support', 'Guest passes'] },
];

export default function MemberSubscription() {
  const { currentUser, updateSubscription } = useAppContext();

  const handleSubscribe = (planId: string) => {
    if (!currentUser) return;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    updateSubscription(currentUser.id, planId as 'basic' | 'standard' | 'premium', expiresAt);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Subscription Plans</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>Choose the plan that fits your bowling lifestyle.</p>
      </div>

      {currentUser?.subscriptionPlan && (
        <Card style={{ marginBottom: '1.5rem', background: 'var(--color-primary)', color: 'white' } as React.CSSProperties}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Current Plan</div>
              <div style={{ marginTop: '0.25rem', textTransform: 'capitalize' }}>{currentUser.subscriptionPlan}</div>
            </div>
            {currentUser.subscriptionExpiresAt && (
              <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>
                Expires {new Date(currentUser.subscriptionExpiresAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {plans.map(plan => {
          const isCurrent = currentUser?.subscriptionPlan === plan.id;
          return (
            <Card key={plan.id} style={{ border: isCurrent ? '2px solid var(--color-primary)' : undefined } as React.CSSProperties}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{plan.name}</h2>
                {isCurrent && <Badge variant="info">Current</Badge>}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
                ${plan.price}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--color-gray-500)' }}>/mo</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--color-primary)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button
                fullWidth
                variant={isCurrent ? 'secondary' : 'primary'}
                disabled={isCurrent}
                onClick={() => handleSubscribe(plan.id)}
              >
                {isCurrent ? 'Current Plan' : 'Subscribe'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
