import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { formatDate, formatTime } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

export default function AdminBookings() {
  const { bookings, cancelBooking, deleteBooking } = useAppContext();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = bookings
    .filter(b =>
      b.userName.toLowerCase().includes(search.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      String(b.laneNumber).includes(search)
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const statusVariant: Record<string, 'success' | 'danger' | 'neutral'> = {
    confirmed: 'success',
    cancelled: 'danger',
    completed: 'neutral',
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Bookings</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>All lane reservations.</p>
      </div>

      <Card style={{ marginBottom: '1rem' } as React.CSSProperties}>
        <Input placeholder="Search by name, email or lane…" value={search} onChange={e => setSearch(e.target.value)} />
      </Card>

      {filtered.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' } as React.CSSProperties}>
          <p style={{ color: 'var(--color-gray-400)' }}>No bookings found.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(b => (
            <Card key={b.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{b.userName} <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)' }}>({b.userType})</span></div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{b.userEmail}</div>
                  <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Lane {b.laneNumber} · {formatDate(b.date)} · {formatTime(b.startTime)} – {formatTime(b.endTime)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Badge variant={statusVariant[b.status] ?? 'neutral'}>{b.status}</Badge>
                  {b.status === 'confirmed' && (
                    <Button size="sm" variant="ghost" onClick={() => cancelBooking(b.id)}>Cancel</Button>
                  )}
                  <Button size="sm" variant="danger" onClick={() => setDeleteId(b.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Booking">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p>Permanently delete this booking?</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { if (deleteId) { deleteBooking(deleteId); setDeleteId(null); } }}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
