import { useState } from 'react';
import { Bell, Send, Trash2 } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { Notification } from '@/types';

export default function AdminNotifications() {
  const { notifications, addNotification, deleteNotification } = useStore();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<Notification['target']>('all');

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return;
    addNotification({
      title,
      message,
      target,
      createdAt: new Date().toISOString(),
      read: false,
    });
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
        <p className="text-slate-500 text-sm mt-1">Send announcements to members</p>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Send Notification</h2>
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
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Notification message"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Target</label>
            <select
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={target}
              onChange={e => setTarget(e.target.value as Notification['target'])}
            >
              <option value="all">All Members</option>
              <option value="members">Members Only</option>
              <option value="admin">Admin Only</option>
            </select>
          </div>
          <Button onClick={handleSend} className="flex items-center gap-2">
            <Send size={16} />
            Send Notification
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Sent Notifications</h2>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Bell size={32} className="mx-auto mb-2 opacity-50" />
            <p>No notifications sent yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800">{n.title}</p>
                  <p className="text-slate-600 text-sm mt-0.5">{n.message}</p>
                  <p className="text-slate-400 text-xs mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="ml-4 text-red-400 hover:text-red-600 flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
