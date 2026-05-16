import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function AdminBookings() {
  const { bookings, cancelBooking } = useAppContext();
  const [filterDate, setFilterDate] = useState('');

  const filtered = filterDate
    ? bookings.filter((b) => b.date === filterDate)
    : bookings;

  const statusVariant = (status: string) => {
    if (status === 'confirmed') return 'success';
    if (status === 'cancelled') return 'danger';
    return 'neutral';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>All Bookings</h1>
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, marginRight: '0.5rem' }}>Filter by date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><p style={{ textAlign: 'center', color: '#64748b' }}>No bookings found.</p></Card>
      ) : (
        filtered.map((b) => (
          <Card key={b.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{b.userName}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{b.userEmail}</div>
                <div style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.5rem' }}>
                  📅 {formatDate(new Date(b.date))} · Lane {b.lane} · {b.startTime}–{b.endTime}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>Type: {b.userType}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
                {b.status === 'confirmed' && (
                  <Button size="sm" variant="danger" onClick={() => cancelBooking(b.id)}>Cancel</Button>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
