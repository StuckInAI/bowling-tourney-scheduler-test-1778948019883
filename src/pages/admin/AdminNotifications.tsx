import { useState } from 'react';
import { Bell, Plus, Trash2, Send } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import type { Notification } from '@/types';

export default function AdminNotifications() {
  const { notifications, addNotification } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' as Notification['type'] });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.message.trim()) return;
    addNotification({
      id: crypto.randomUUID(),
      title: form.title,
      message: form.message,
      type: form.type,
      date: new Date().toISOString(),
      read: false,
    });
    setForm({ title: '', message: '', type: 'info' });
    setIsModalOpen(false);
  };

  const variantMap: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    alert: 'danger',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and send notifications to members.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          New Notification
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 && (
          <Card>
            <div className="text-center py-8 text-slate-400">
              <Bell size={40} className="mx-auto mb-3 opacity-40" />
              <p>No notifications yet.</p>
            </div>
          </Card>
        )}
        {notifications.map((n) => (
          <Card key={n.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-800">{n.title}</span>
                  <Badge variant={variantMap[n.type] ?? 'info'}>{n.type}</Badge>
                </div>
                <p className="text-slate-600 text-sm">{n.message}</p>
                <p className="text-slate-400 text-xs mt-1">{new Date(n.date).toLocaleString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Notification">
        <div className="p-6 space-y-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Notification title"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Message</label>
            <textarea
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Notification message"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Type</label>
            <select
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Notification['type'] }))}
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="alert">Alert</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>
              <Send size={15} />
              Send
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
