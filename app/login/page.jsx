'use client';

import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function LoginPage() {
  const { status } = useSession();
  if (status === 'authenticated') redirect('/');

  return (
    <div className="page-shell" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: 16 }}>
      <div className="panel" style={{ width: 'min(560px, 100%)' }}>
        <div className="panel-body">
          <div className="eyebrow">Discord authentication</div>
          <h1 className="section-title" style={{ marginTop: 12 }}>Login</h1>
          <p className="section-sub" style={{ marginTop: 16 }}>Đăng nhập bằng Discord để nộp whitelist bằng danh tính thật của bạn. Đây là bước bắt buộc để staff xác minh hồ sơ dễ dàng hơn.</p>
          <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => signIn('discord')}>LOGIN WITH DISCORD</button>
        </div>
      </div>
    </div>
  );
}
