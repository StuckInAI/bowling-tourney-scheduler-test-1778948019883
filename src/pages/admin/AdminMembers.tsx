import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate, getInitials } from '@/lib/utils';

export default function AdminMembers() {
  const { users, updateUser, updateSubscription } = useAppContext();
  const [search, setSearch] = useState('');

  const members = users.filter(u => u.role === 'member');
  const filtered = members.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSubscription = (userId: string, current: string | undefined) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    if (current === 'active') {
      updateUser({ ...user, subscriptionStatus: 'inactive', subscriptionExpiry: undefined });
    } else {
      updateSubscription(userId, 'yearly');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Member Management</h1>
          <p className="text-slate-500">{members.length} registered members.</p>
        </div>
        <input
          type="text"
          placeholder="Search members..."
          className="border rounded-md px-3 py-2 text-sm w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-slate-500">No members found.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(u => (
            <Card key={u.id}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                    {getInitials(u.name)}
                  </div>
                  <div>
                    <div className="font-bold">{u.name}</div>
                    <div className="text-sm text-slate-500">{u.email}</div>
                    {u.joinedAt && (
                      <div className="text-xs text-slate-400">Joined {formatDate(new Date(u.joinedAt))}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={u.subscriptionStatus === 'active' ? 'success' : 'danger'}>
                    {u.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                  {u.subscriptionExpiry && u.subscriptionStatus === 'active' && (
                    <span className="text-xs text-slate-400">until {formatDate(new Date(u.subscriptionExpiry))}</span>
                  )}
                  <Button
                    size="sm"
                    variant={u.subscriptionStatus === 'active' ? 'danger' : 'primary'}
                    onClick={() => toggleSubscription(u.id, u.subscriptionStatus)}
                  >
                    {u.subscriptionStatus === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
