import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function MemberProfile() {
  const { currentUser, updateUser } = useAppContext();
  const [name, setName] = useState(currentUser?.name ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (currentUser) {
      updateUser(currentUser.id, { name, email });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
      <Card>
        <div className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button onClick={handleSave} disabled={!name || !email}>
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
