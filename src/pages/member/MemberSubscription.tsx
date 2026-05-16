import { useAppContext } from '@/context/AppContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import type { SubscriptionType } from '@/types';

const plans: { tier: SubscriptionType; name: string; price: number; features: string[] }[] = [
  { tier: 'basic', name: 'Basic', price: 9.99, features: ['5 bookings/month', 'Standard lanes', 'Email support'] },
  { tier: 'premium', name: 'Premium', price: 19.99, features: ['15 bookings/month', 'Priority lanes', 'Tournament access', 'Phone support'] },
  { tier: 'vip', name: 'VIP', price: 39.99, features: ['Unlimited bookings', 'VIP lanes', 'All tournaments', 'Dedicated support', 'Guest passes'] },
];

export default function MemberSubscription() {
  const { currentUser, updateUser } = useAppContext();
  if (!currentUser) return null;

  const handleUpgrade = (tier: SubscriptionType) => {
    updateUser({ ...currentUser, subscription: tier, subscriptionTier: tier });
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Subscription Plans</h1>
      <p style={{ marginBottom: '2rem', color: 'var(--color-gray-600)' }}>
        Current plan: <strong>{currentUser.subscription === 'none' ? 'No subscription' : currentUser.subscription}</strong>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {plans.map(plan => (
          <Card key={plan.tier}>
            <h2 style={{ marginBottom: '0.5rem' }}>{plan.name}</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>${plan.price}<span style={{ fontSize: '0.875rem', fontWeight: 400 }}>/mo</span></p>
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.25rem' }}>
              {plan.features.map(f => <li key={f} style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>{f}</li>)}
            </ul>
            <Button
              variant={currentUser.subscription === plan.tier ? 'secondary' : 'primary'}
              disabled={currentUser.subscription === plan.tier}
              onClick={() => handleUpgrade(plan.tier)}
              fullWidth
            >
              {currentUser.subscription === plan.tier ? 'Current Plan' : 'Upgrade'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
