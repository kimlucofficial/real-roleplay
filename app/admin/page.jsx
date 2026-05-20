import { getServerSession } from 'next-auth';
import { authOptions, isAdminDiscordId } from '@/lib/auth';
import AdminClient from './view';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.discordId || !isAdminDiscordId(session.user.discordId)) {
    return (
      <div className="page-shell" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
        <div className="panel" style={{ width: 'min(640px, 100%)' }}>
          <div className="panel-body">
            <div className="eyebrow">Restricted area</div>
            <h1 className="section-title" style={{ marginTop: 12 }}>Admin Access Required</h1>
            <p className="section-sub" style={{ marginTop: 16 }}>Tài khoản Discord này không nằm trong danh sách admin được phép duyệt whitelist.</p>
          </div>
        </div>
      </div>
    );
  }

  return <AdminClient />;
}
