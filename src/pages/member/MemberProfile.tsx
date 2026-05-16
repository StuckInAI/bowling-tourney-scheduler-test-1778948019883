import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getInitials, formatDate } from '@/lib/utils';

export default function MemberProfile() {
  const { currentUser, updateUser } = useAppContext();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!currentUser) return;
    updateUser({ ...currentUser, name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-slate-500">Manage your account details.</p>
      </div>

      <Card className="flex flex-col items-center gap-4 py-8">
        <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
          {getInitials(currentUser.name)}
        </div>
        <div className="text-center">
          <div className="font-bold text-lg">{currentUser.name}</div>
          <div className="text-slate-500 text-sm">{currentUser.email}</div>
          {currentUser.joinedAt && (
            <div className="text-slate-400 text-xs mt-1">Member since {formatDate(new Date(currentUser.joinedAt))}</div>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold mb-4">Edit Profile</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={handleSave}>
            {saved ? '✅ Saved!' : 'Save Changes'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
