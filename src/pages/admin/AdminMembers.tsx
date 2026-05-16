import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function AdminMembers() {
  const { users, toggleUserStatus } = useAppContext();
  const members = users.filter(u => u.role === 'member');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Members</h1>
      <Card>
        {members.length === 0 ? (
          <p className="text-slate-500 text-sm">No members registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-semibold text-slate-600">Name</th>
                  <th className="text-left py-2 pr-4 font-semibold text-slate-600">Email</th>
                  <th className="text-left py-2 pr-4 font-semibold text-slate-600">Tier</th>
                  <th className="text-left py-2 pr-4 font-semibold text-slate-600">Status</th>
                  <th className="text-left py-2 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(u => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{u.name}</td>
                    <td className="py-2 pr-4">{u.email}</td>
                    <td className="py-2 pr-4">
                      <Badge variant={u.subscriptionTier === 'premium' ? 'purple' : u.subscriptionTier === 'basic' ? 'info' : 'neutral'}>
                        {u.subscriptionTier}
                      </Badge>
                    </td>
                    <td className="py-2 pr-4">
                      <Badge variant={u.subscriptionStatus === 'active' ? 'success' : 'danger'}>
                        {u.subscriptionStatus}
                      </Badge>
                    </td>
                    <td className="py-2">
                      <Button size="sm" variant={u.subscriptionStatus === 'active' ? 'danger' : 'secondary'} onClick={() => toggleUserStatus(u.id)}>
                        {u.subscriptionStatus === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
