import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function MemberSubscription() {
  const { currentUser, updateSubscription } = useAppContext();
  const isActive = currentUser?.subscriptionStatus === 'active';
  const expiry = currentUser?.subscriptionExpiry;
  const tier = currentUser?.subscriptionTier ?? 'none';
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (selectedTier: 'basic' | 'premium') => {
    if (!currentUser) return;
    setLoading(true);
    const expDate = new Date();
    expDate.setMonth(expDate.getMonth() + 1);
    setTimeout(() => {
      updateSubscription(currentUser.id, 'active', selectedTier, expDate.toISOString());
      setLoading(false);
    }, 500);
  };

  const handleCancel = () => {
    if (!currentUser) return;
    setLoading(true);
    setTimeout(() => {
      updateSubscription(currentUser.id, 'inactive', 'none');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Subscription</h1>

      <Card>
        <h2 className="text-lg font-semibold mb-3">Current Plan</h2>
        <div className="flex items-center gap-3 mb-4">
          <Badge variant={isActive ? 'success' : 'neutral'}>{isActive ? 'Active' : 'Inactive'}</Badge>
          <Badge variant={tier === 'premium' ? 'purple' : tier === 'basic' ? 'info' : 'neutral'}>{tier}</Badge>
        </div>
        {expiry && <p className="text-sm text-slate-500">Expires: {new Date(expiry).toLocaleDateString()}</p>}
        {isActive && (
          <Button variant="danger" className="mt-4" onClick={handleCancel} disabled={loading}>
            Cancel Subscription
          </Button>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-base font-semibold mb-1">Basic Plan</h3>
          <p className="text-2xl font-bold text-blue-600 mb-2">$9.99<span className="text-sm font-normal text-slate-500">/mo</span></p>
          <ul className="text-sm text-slate-600 space-y-1 mb-4">
            <li>✓ 5 lane bookings/month</li>
            <li>✓ Tournament access</li>
            <li>✓ Member discounts</li>
          </ul>
          <Button onClick={() => handleSubscribe('basic')} disabled={loading || (isActive && tier === 'basic')}>
            {isActive && tier === 'basic' ? 'Current Plan' : 'Subscribe'}
          </Button>
        </Card>

        <Card>
          <h3 className="text-base font-semibold mb-1">Premium Plan</h3>
          <p className="text-2xl font-bold text-purple-600 mb-2">$19.99<span className="text-sm font-normal text-slate-500">/mo</span></p>
          <ul className="text-sm text-slate-600 space-y-1 mb-4">
            <li>✓ Unlimited lane bookings</li>
            <li>✓ Priority tournament registration</li>
            <li>✓ Exclusive member events</li>
            <li>✓ All Basic features</li>
          </ul>
          <Button onClick={() => handleSubscribe('premium')} disabled={loading || (isActive && tier === 'premium')}>
            {isActive && tier === 'premium' ? 'Current Plan' : 'Subscribe'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
