'use client';

import { useEffect, useState } from 'react';

export default function AdminClient() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/whitelist');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Load failed');
      setRows(data.rows || []);
    } catch (err) {
      setError(err.message || 'Load failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    const res = await fetch(`/api/admin/whitelist/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Update failed');
      return;
    }
    load();
  }

  const pending = rows.filter((r) => r.status === 'pending').length;
  const review = rows.filter((r) => r.status === 'review').length;
  const approved = rows.filter((r) => r.status === 'approved').length;
  const rejected = rows.filter((r) => r.status === 'rejected').length;

  return (
    <div className="page-shell">
      <section className="admin-wrap">
        <div className="container">
          <div className="eyebrow">Staff panel</div>
          <h1 className="section-title" style={{ marginTop: 12 }}>Whitelist Dashboard</h1>
          <p className="section-sub" style={{ marginTop: 16 }}>Duyệt hồ sơ ngay trên web. Các nút Discord cũng sẽ cập nhật cùng một database MySQL.</p>

          <div className="admin-grid" style={{ marginTop: 24 }}>
            {[
              [pending, 'Pending'],
              [review, 'Review'],
              [approved, 'Approved'],
              [rejected, 'Rejected']
            ].map(([value, label]) => (
              <div key={label} className="panel admin-stat">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>

          {error && <div className="form-note" style={{ color: '#fca5a5', marginTop: 20 }}>{error}</div>}
          {loading && <div className="form-note" style={{ marginTop: 20 }}>Đang tải dữ liệu...</div>}

          {!loading && (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Details</th>
                    <th>Story</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.full_name}</strong>
                        <div style={{ marginTop: 6, color: '#a1a1aa' }}>{row.discord_username}</div>
                      </td>
                      <td>
                        <div>Age: {row.age}</div>
                        <div style={{ marginTop: 6 }}>RP: {row.rp_experience}</div>
                        <div style={{ marginTop: 6, color: '#a1a1aa' }}>{row.online_time}</div>
                      </td>
                      <td>
                        <div style={{ maxWidth: 360, color: '#d4d4d8' }}>{row.short_description}</div>
                        <details style={{ marginTop: 10 }}>
                          <summary style={{ cursor: 'pointer', color: '#f4c53a' }}>Xem tiểu sử</summary>
                          <div style={{ marginTop: 10, color: '#a1a1aa', lineHeight: 1.7 }}>{row.backstory}</div>
                          <div style={{ marginTop: 10, color: '#d4d4d8' }}><strong>Tại sao tham gia:</strong> {row.why_join}</div>
                        </details>
                      </td>
                      <td>
                        <span className={`status ${row.status}`}>{row.status}</span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button className="small-btn gold" onClick={() => updateStatus(row.id, 'approved')}>Approve</button>
                          <button className="small-btn" onClick={() => updateStatus(row.id, 'review')}>Review</button>
                          <button className="small-btn" onClick={() => updateStatus(row.id, 'rejected')}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
