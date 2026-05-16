import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const plans = [
  {
    tier: 'basic' as const,
    name: 'Basic',
    price: '$9.99/mo',
    features: ['5 bookings/month', 'Standard lanes', 'Email support'],
    badge: 'neutral' as const,
  },
  {
    tier: 'premium' as const,
    name: 'Premium',
    price: '$19.99/mo',
    features: ['15 bookings/month', 'Priority lanes', 'Tournament access', 'Phone support'],
    badge: 'info' as const,
  },
  {
    tier: 'vip' as const,
    name: 'VIP',
    price: '$39.99/mo',
    features: ['Unlimited bookings', 'VIP lanes', 'All tournaments', '24/7 support', 'Guest passes'],
    badge: 'purple' as const,
  },
];

export default function MemberSubscription() {
  const { currentUser, updateUser } = useAppContext();

  if (!currentUser) return null;

  const handleUpgrade = (tier: 'basic' | 'premium' | 'vip') => {
    updateUser({ ...currentUser, subscription: tier, subscriptionTier: tier });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Subscription Plans</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {plans.map((plan) => (
          <Card key={plan.tier}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3>{plan.name}</h3>
              <Badge variant={plan.badge}>{plan.name}</Badge>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{plan.price}</div>
            <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
              {plan.features.map((f) => <li key={f} style={{ fontSize: '0.875rem', marginBottom: '4px' }}>{f}</li>)}
            </ul>
            <Button
              variant={currentUser.subscription === plan.tier ? 'secondary' : 'primary'}
              disabled={currentUser.subscription === plan.tier}
              fullWidth
              onClick={() => handleUpgrade(plan.tier)}
            >
              {currentUser.subscription === plan.tier ? 'Current Plan' : 'Upgrade'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
