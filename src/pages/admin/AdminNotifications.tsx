import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import type { AppNotification } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminNotifications() {
  const { notifications, addNotification } = useAppContext();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<AppNotification['recipientType']>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    addNotification({
      title,
      message,
      recipientType,
    });
    setTitle('');
    setMessage('');
    setRecipientType('all');
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
            onChange={e => setTitle(e.target.value)}
            placeholder="Notification title"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Message</label>
            <textarea
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Notification message"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Recipients</label>
            <select
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={recipientType}
              onChange={e => setRecipientType(e.target.value as AppNotification['recipientType'])}
            >
              <option value="all">All Users</option>
              <option value="members">Members Only</option>
              <option value="specific">Specific User</option>
            </select>
          </div>
          <Button type="submit">Send Notification</Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Sent Notifications ({notifications.length})</h2>
        {notifications.length === 0 ? (
          <p className="text-slate-500 text-sm">No notifications sent yet.</p>
        ) : (
          <div className="space-y-3">
            {[...notifications].reverse().map(n => (
              <div key={n.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-800">{n.title}</div>
                    <div className="text-sm text-slate-600 mt-1">{n.message}</div>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {n.recipientType === 'all' ? 'All Users' : n.recipientType === 'members' ? 'Members' : 'Specific'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
