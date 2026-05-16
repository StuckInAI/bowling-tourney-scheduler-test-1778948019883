import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function MemberProfile() {
  const { currentUser, updateUser } = useAppContext();
  const [name, setName] = useState(currentUser?.name ?? '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!currentUser) return;
    updateUser(currentUser.id, { name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
      <Card>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Email" value={currentUser?.email ?? ''} disabled />
          <Input label="Role" value={currentUser?.role ?? ''} disabled />
          {saved && <p className="text-green-600 text-sm">Profile updated!</p>}
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
