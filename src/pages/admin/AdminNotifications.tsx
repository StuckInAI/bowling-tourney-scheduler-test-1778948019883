import { useState, type ChangeEvent } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { Notification } from '@/types';

export default function AdminNotifications() {
  const { notifications, addNotification } = useAppContext();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState<Notification['targetRole']>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    addNotification({
      title,
      message,
      targetRole,
      createdAt: new Date().toISOString(),
    });
    setTitle('');
    setMessage('');
    setTargetRole('all');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Send Notification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification title"
            required
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Message</label>
            <textarea
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification message"
              required
            />
          </div>
          <Select
            label="Audience"
            value={targetRole}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setTargetRole(e.target.value as Notification['targetRole'])
            }
            options={[
              { value: 'all', label: 'Everyone' },
              { value: 'member', label: 'Members Only' },
              { value: 'admin', label: 'Admins Only' },
            ]}
          />
          <Button type="submit">Send Notification</Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Sent Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-slate-500 text-sm">No notifications sent yet.</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li key={n.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">{n.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      To: {n.targetRole} &middot; {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
