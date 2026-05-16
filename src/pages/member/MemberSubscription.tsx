import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function MemberSubscription() {
  const { currentUser, updateSubscription } = useAppContext();

  const isActive = currentUser?.subscriptionStatus === 'active';
  const expiry = currentUser?.subscriptionExpiry;

  const handleSubscribe = () => {
    if (!currentUser) return;
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    updateSubscription(currentUser.id, 'active', expiryDate.toISOString().split('T')[0]);
  };

  const handleCancel = () => {
    if (!currentUser) return;
    updateSubscription(currentUser.id, 'inactive');
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold text-slate-800">Subscription</h1>
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-700">Status</span>
            <Badge variant={isActive ? 'success' : 'neutral'}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {expiry && (
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700">Expires</span>
              <span className="text-slate-600">{formatDate(new Date(expiry + 'T12:00:00'))}</span>
            </div>
          )}
          <div className="pt-2">
            {isActive ? (
              <Button variant="danger" onClick={handleCancel} className="w-full">
                Cancel Subscription
              </Button>
            ) : (
              <Button onClick={handleSubscribe} className="w-full">
                Subscribe (1 Year)
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
