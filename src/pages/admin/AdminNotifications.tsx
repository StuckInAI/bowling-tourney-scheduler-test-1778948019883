import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { AppNotification } from '@/types';

type RecipientType = AppNotification['recipientType'];

export default function AdminNotifications() {
  const { notifications, addNotification } = useAppContext();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<RecipientType>('all');
  const [submitted, setSubmitted] = useState(false);

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return;
    addNotification({
      title,
      message,
      recipientType,
    });
    setTitle('');
    setMessage('');
    setRecipientType('all');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>

      <Card>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Send Notification</h2>
        {submitted && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 mb-4">
            Notification sent successfully!
          </div>
        )}
        <div className="space-y-4">
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
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Notification message..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Recipients</label>
            <select
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={recipientType}
              onChange={e => setRecipientType(e.target.value as RecipientType)}
            >
              <option value="all">All Users</option>
              <option value="members">Members Only</option>
              <option value="specific">Specific User</option>
            </select>
          </div>
          <Button onClick={handleSend} disabled={!title.trim() || !message.trim()}>
            Send Notification
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Sent Notifications ({notifications.length})</h2>
        {notifications.length === 0 ? (
          <p className="text-slate-500 text-sm">No notifications sent yet.</p>
        ) : (
          <div className="space-y-3">
            {[...notifications].reverse().map(n => (
              <div key={n.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">{n.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{n.createdAt}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {n.recipientType === 'all' ? 'All Users' : n.recipientType === 'members' ? 'Members' : 'Specific'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
