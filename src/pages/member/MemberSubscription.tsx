import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { SubscriptionType } from '@/types';

const plans: { tier: SubscriptionType; name: string; price: string; features: string[] }[] = [
  {
    tier: 'none',
    name: 'Free Member',
    price: '$0',
    features: ['Pay per game', 'Basic booking', 'No discounts']
  },
  {
    tier: 'basic',
    name: 'Basic Member',
    price: '$19.99/mo',
    features: ['10% discount on games', 'Priority booking', 'Free shoe rental']
  },
  {
    tier: 'premium',
    name: 'Premium Member',
    price: '$39.99/mo',
    features: ['Unlimited games', 'Exclusive tournaments', '25% discount on food', 'Guest passes']
  }
];

export default function MemberSubscription() {
  const { currentUser, updateUser } = useAppContext();

  if (!currentUser) return null;

  const handleUpdate = (tier: SubscriptionType) => {
    updateUser({ ...currentUser, subscription: tier });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Membership Plans</h1>
        <p style={{ color: '#64748b' }}>Choose a plan that fits your bowling lifestyle.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {plans.map(plan => {
          const isActive = currentUser.subscription === plan.tier;
          return (
            <Card key={plan.tier} className={isActive ? 'active-plan' : ''} style={{ display: 'flex', flexDirection: 'column', border: isActive ? '2px solid var(--color-primary)' : '' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{plan.name}</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>{plan.price}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: '0.9rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✅ {f}</li>
                ))}
              </ul>
              <Button 
                fullWidth 
                variant={isActive ? 'secondary' : 'primary'} 
                disabled={isActive}
                onClick={() => handleUpdate(plan.tier)}
              >
                {isActive ? 'Current Plan' : 'Select Plan'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}