import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import type { Notification } from '@/types';

export default function AdminNotifications() {
  const { notifications, addNotification, deleteNotification } = useAppContext();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState<'admin' | 'member' | 'all'>('all');

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return;
    const newNotification: Omit<Notification, 'id'> = {
      title,
      message,
      targetRole,
      createdAt: new Date().toISOString(),
      type: 'info',
      read: false,
    };
    addNotification(newNotification);
    setTitle('');
    setMessage('');
    setTargetRole('all');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
        <p className="text-slate-500 text-sm mt-1">Send notifications to members or admins.</p>
      </div>

      <Card>
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Send New Notification</h2>
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
          <Select
            label="Target Audience"
            value={targetRole}
            onChange={e => setTargetRole(e.target.value as 'admin' | 'member' | 'all')}
            options={[
              { value: 'all', label: 'All Users' },
              { value: 'member', label: 'Members Only' },
              { value: 'admin', label: 'Admins Only' },
            ]}
          />
          <Button onClick={handleSend}>Send Notification</Button>
        </div>
      </Card>

      <Card>
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Sent Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-slate-500 text-sm">No notifications sent yet.</p>
          ) : (
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className="flex items-start justify-between border rounded-lg p-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-800 text-sm">{n.title}</span>
                      <Badge variant="info">{n.targetRole}</Badge>
                    </div>
                    <p className="text-slate-600 text-sm">{n.message}</p>
                    <p className="text-slate-400 text-xs mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => deleteNotification(n.id)}>Delete</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
