import { useAppContext } from '@/context/AppContext';
import type { SubscriptionType } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const plans: { tier: SubscriptionType; name: string; price: number; features: string[] }[] = [
  { tier: 'basic', name: 'Basic', price: 9.99, features: ['5 bookings/month', 'Standard lanes', 'Email support'] },
  { tier: 'premium', name: 'Premium', price: 19.99, features: ['15 bookings/month', 'Priority lanes', 'Tournament access', 'Phone support'] },
  { tier: 'vip', name: 'VIP', price: 39.99, features: ['Unlimited bookings', 'VIP lanes', 'All tournaments', 'Dedicated support', 'Guest passes'] },
];

export default function MemberSubscription() {
  const { currentUser, updateUser } = useAppContext();
  if (!currentUser) return null;

  const handleSubscribe = (tier: SubscriptionType) => {
    updateUser({ ...currentUser, subscription: tier });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Subscription</h1>
        <p style={{ color: 'var(--color-gray-600)' }}>Choose a plan that fits your bowling lifestyle</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {plans.map(plan => {
          const isActive = currentUser.subscription === plan.tier;
          return (
            <Card key={plan.tier}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{plan.name}</h3>
                {isActive && <Badge variant="success">Active</Badge>}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
                ${plan.price}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--color-gray-500)' }}>/mo</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>✓ {f}</li>
                ))}
              </ul>
              <Button
                fullWidth
                variant={isActive ? 'secondary' : 'primary'}
                disabled={isActive}
                onClick={() => handleSubscribe(plan.tier)}
              >
                {isActive ? 'Current Plan' : 'Subscribe'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
