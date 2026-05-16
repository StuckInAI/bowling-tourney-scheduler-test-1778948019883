import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import type { SubscriptionTier } from '@/types';

const plans: { tier: SubscriptionTier; name: string; price: string; features: string[] }[] = [
  { tier: 'basic', name: 'Basic', price: '$19/mo', features: ['5 bookings/month', 'Standard slots', 'Email notifications'] },
  { tier: 'premium', name: 'Premium', price: '$39/mo', features: ['Unlimited bookings', 'Priority slots', 'SMS + Email', 'Tournament priority'] },
  { tier: 'vip', name: 'VIP', price: '$69/mo', features: ['Unlimited bookings', 'VIP lanes', 'Free tournaments', 'Dedicated support'] },
];

export default function MemberSubscription() {
  const { currentUser, updateUser } = useAppContext();

  if (!currentUser) return null;

  const handleUpgrade = (tier: SubscriptionTier) => {
    updateUser(currentUser.id, {
      subscriptionTier: tier,
      subscriptionStatus: 'active',
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Subscription</h1>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Current Plan</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {currentUser.subscriptionExpiry
                ? `Expires: ${formatDate(new Date(currentUser.subscriptionExpiry))}`
                : 'No active plan'}
            </div>
          </div>
          <Badge variant={currentUser.subscriptionTier === 'vip' ? 'purple' : currentUser.subscriptionTier === 'premium' ? 'info' : 'neutral'}>
            {(currentUser.subscriptionTier || 'none').toUpperCase()}
          </Badge>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {plans.map((plan) => (
          <Card key={plan.tier}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{plan.name}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a5f', marginBottom: '1rem' }}>{plan.price}</div>
            <ul style={{ listStyle: 'none', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {plan.features.map((f) => <li key={f} style={{ fontSize: '0.875rem', color: '#475569' }}>✓ {f}</li>)}
            </ul>
            <Button
              fullWidth
              variant={currentUser.subscriptionTier === plan.tier ? 'secondary' : 'primary'}
              disabled={currentUser.subscriptionTier === plan.tier}
              onClick={() => handleUpgrade(plan.tier)}
            >
              {currentUser.subscriptionTier === plan.tier ? 'Current Plan' : 'Upgrade'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
