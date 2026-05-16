import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function MemberSubscription() {
  const { currentUser, updateSubscription } = useAppContext();

  const isActive = currentUser?.subscriptionStatus === 'active';
  const expiry = currentUser?.subscriptionExpiry;

  const handleActivate = () => {
    if (!currentUser) return;
    updateSubscription(currentUser.id, 'yearly');
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-slate-500">Manage your yearly membership.</p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Yearly Membership</h2>
          <Badge variant={isActive ? 'success' : 'danger'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <div className="flex flex-col gap-2 text-sm text-slate-600 mb-6">
          <div className="flex items-center gap-2">✅ <span>Book lanes any time online</span></div>
          <div className="flex items-center gap-2">✅ <span>Join exclusive tournaments</span></div>
          <div className="flex items-center gap-2">✅ <span>Priority lane selection</span></div>
          <div className="flex items-center gap-2">✅ <span>Cancel bookings up to 2 hours before</span></div>
        </div>
        {isActive && expiry ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
            <strong>Active until:</strong> {formatDate(new Date(expiry))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800">
              Your membership is inactive. Activate to access member features.
            </div>
            <Button onClick={handleActivate} className="w-full">
              Activate Yearly Membership ($99/year)
            </Button>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-bold mb-3">Plan Details</h2>
        <div className="flex justify-between text-sm py-2 border-b">
          <span className="text-slate-500">Plan</span>
          <span className="font-medium">Yearly</span>
        </div>
        <div className="flex justify-between text-sm py-2 border-b">
          <span className="text-slate-500">Price</span>
          <span className="font-medium">$99 / year</span>
        </div>
        <div className="flex justify-between text-sm py-2">
          <span className="text-slate-500">Status</span>
          <span className={`font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </Card>
    </div>
  );
}
