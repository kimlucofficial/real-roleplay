'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Bell, CalendarDays, ChevronRight, ExternalLink, MessageSquare, Shield, Skull, Users } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Navbar from './Navbar';
import { useMemo, useState } from 'react';

const features = [
  { title: 'Law Enforcement', text: 'Lực lượng luật pháp có định hướng rõ: điều tra, phản ứng nhanh, quản trị thành phố và áp lực quyền lực thực sự.', accent: 'blue' },
  { title: 'Criminal Network', text: 'Thế giới ngầm không chỉ là bắn nhau. Nó là cấu trúc quyền lực, giao dịch, ảnh hưởng và chiến tranh lãnh địa.', accent: 'red' },
  { title: 'City Economy', text: 'Một thành phố sống cần dòng tiền, lao động, tài sản và doanh nghiệp có giá trị. Kinh tế là nhịp thở của roleplay.', accent: 'neutral' },
  { title: 'Selective Whitelist', text: 'Cổng vào không dành cho số đông. Whitelist là bộ lọc để giữ nhịp roleplay, thái độ chơi và chất lượng cộng đồng.', accent: 'gold' },
  { title: 'Live Events', text: 'Các sự kiện được dựng theo tư duy đạo diễn: có xung đột, có cao trào, có hình ảnh và có hậu quả dài hạn.', accent: 'neutral' },
  { title: 'Identity First', text: 'Mỗi người chơi bước vào thành phố với một câu chuyện, không phải một cái nick. Câu chuyện là thứ định nghĩa bạn.', accent: 'gold' }
];

const updates = [
  { title: 'Season Update 1.2', tag: 'Major Patch', text: 'Mở rộng khu downtown, cân bằng lại economy và thêm tuyến tình huống mới giữa lực lượng luật pháp và thế giới ngầm.' },
  { title: 'Live Event Protocol', tag: 'Event', text: 'Chuỗi sự kiện live theo tuần với hệ quả trực tiếp lên các faction, doanh nghiệp và narrative thành phố.' },
  { title: 'Whitelist Standard', tag: 'Policy', text: 'Tiêu chuẩn duyệt đơn được nâng cao để ưu tiên người chơi có tiểu sử tốt, thái độ đúng và định hướng RP rõ ràng.' }
];

const pedCards = [
  { name: 'Urban Professional', text: 'Gương mặt doanh nhân, luật sư, tay môi giới hoặc một ông trùm thích khoác lên mình vẻ ngoài sạch sẽ.' },
  { name: 'Street Operator', text: 'Hợp với chất đời, các tuyến nhân vật bụi bặm, underground và sống trong vùng xám của thành phố.' },
  { name: 'Tactical Officer', text: 'Dành cho tuyến luật pháp, bảo vệ hoặc nhân vật có màu sắc kỷ luật và quyền lực.' }
];

function Label({ children }) { return <div className="eyebrow">{children}</div>; }
function Panel({ children, className = '' }) { return <div className={`panel ${className}`}>{children}</div>; }

function Hero({ setPage, discordUrl }) {
  return (
    <section className="hero">
      <div className="hero-art" />
      <div className="hero-side-glow-left" />
      <div className="hero-side-glow-right" />
      <div className="container hero-grid">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="hero-copy">
          <Label>Director vision • art driven • whitelist first</Label>
          <h1 className="hero-title">Law <span className="muted">vs</span><span style={{display:'block'}}>Chaos</span></h1>
          <p className="hero-body">Không phải một server. Đây là một thành phố bị xé đôi giữa trật tự và hỗn loạn. Ở đây, câu chuyện của bạn không bắt đầu bằng việc bấm chơi — nó bắt đầu từ việc được chấp nhận bước vào thành phố.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setPage('whitelist')}>APPLY FOR ACCESS <ArrowRight size={16} style={{ marginLeft: 8 }} /></button>
            <button className="btn-secondary" onClick={() => window.open(discordUrl, '_blank', 'noopener,noreferrer')}>COMMUNITY</button>
          </div>
          <div className="stats">
            {[['3700+', 'Players across the city'], ['24/7', 'City never sleeps'], ['100+', 'Jobs & identities']].map(([v, l]) => (
              <div className="stat-box" key={l}><div className="stat-value">{v}</div><div className="stat-label">{l}</div></div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75 }} className="hero-card">
          <Panel>
            <div className="panel-body" style={{ minHeight: 580, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <Label>luke.ng program</Label>
                <div className="section-title" style={{ marginTop: 12 }}>Whitelist is the Gate</div>
              </div>
              <div className="panel-stack">
                {[
                  ['Character First', 'Tiểu sử tốt quan trọng hơn lời hứa suông.'],
                  ['Serious Entry', 'Chỉ người chơi phù hợp mới được bước vào.'],
                  ['Staff Reviewed', 'Tất cả hồ sơ được xem xét cẩn thận.']
                ].map(([a, b]) => (
                  <div className="info-tile" key={a}><div className="info-title">{a}</div><div className="info-text">{b}</div></div>
                ))}
              </div>
              <div className="panel-highlight">
                <div className="eyebrow" style={{ color: '#f4c53a' }}>Main action</div>
                <div className="card-title" style={{ marginTop: 10 }}>Enter the City</div>
                <div className="card-text" style={{ color: '#d4d4d8' }}>Không phải ai cũng vào được. Điều đó tạo ra giá trị cho community và cho chính câu chuyện của bạn.</div>
              </div>
            </div>
          </Panel>
        </motion.div>
      </div>
    </section>
  );
}

function HomePage({ setPage, discordUrl }) {
  return (
    <>
      <Hero setPage={setPage} discordUrl={discordUrl} />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <Label>World pillars</Label>
              <h2 className="section-title">The City System</h2>
            </div>
            <button className="btn-secondary" onClick={() => setPage('whitelist')}>GO TO WHITELIST</button>
          </div>
          <div className="features-grid">
            {features.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <div className="feature-card"><div className="content"><div className={`accent-bar accent-${item.accent}`}></div><div className="card-title">{item.title}</div><div className="card-text">{item.text}</div></div></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FeaturesPage() {
  return <section className="section"><div className="container"><Label></Label><h2 className="section-title">Features</h2><div className="features-grid" style={{ marginTop: 28 }}>{features.map((item) => <div key={item.title} className="feature-card"><div className="content"><div className="card-title">{item.title}</div><div className="card-text">{item.text}</div></div></div>)}</div></div></section>;
}

function WhitelistPage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({
    full_name: '', age: '', rp_experience: '', online_time: '', source: '', short_description: '', backstory: '', why_join: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submit failed');
      setMessage('Đơn whitelist đã được gửi thành công.');
      setForm({ full_name: '', age: '', rp_experience: '', online_time: '', source: '', short_description: '', backstory: '', why_join: '' });
    } catch (err) {
      setMessage(err.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ position: 'relative' }}>
      <div className="container whitelist-grid">
        <Panel>
          <div className="panel-body">
            <Label>Whitelist priority</Label>
            <h2 className="section-title" style={{ marginTop: 12 }}>Enter the City</h2>
            <p className="section-sub" style={{ marginTop: 18 }}>Đây là phần quan trọng nhất của toàn bộ website. Nó không được trông như một form bình thường. Nó phải giống một cánh cổng tuyển chọn, nơi những người chơi nghiêm túc chứng minh họ xứng đáng bước vào thế giới này.</p>
            <div className="panel-stack">
              {[
                ['Staff Reviewed', 'Mỗi hồ sơ được đội ngũ kiểm tra thủ công.'],
                ['Story Driven', 'Tiểu sử nhân vật là trọng tâm của đơn xét duyệt.'],
                ['Web First', 'Duyệt đơn ngay trên dashboard, không cần vào VPS.']
              ].map(([a, b]) => <div className="info-tile" key={a}><div className="info-title">{a}</div><div className="info-text">{b}</div></div>)}
            </div>
            <div className="panel-highlight"><div className="eyebrow" style={{ color: '#f4c53a' }}>Admission note</div><div className="info-text" style={{ marginTop: 10, color: '#d4d4d8' }}>Những hồ sơ có câu chuyện rõ ràng, thái độ tốt và động cơ roleplay nghiêm túc sẽ luôn có giá trị hơn mọi thứ khác.</div></div>
          </div>
        </Panel>

        <Panel>
          <div className="panel-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16 }}>
              <div>
                <Label>Application form</Label>
                <h3 className="section-title" style={{ fontSize: '2.6rem', marginTop: 12 }}>Submit Your Application</h3>
                <p className="section-sub" style={{ marginTop: 12 }}>Trả lời nghiêm túc. Đây không phải bước đăng ký cho có. Đây là lần đầu tiên thành phố đọc câu chuyện của bạn.</p>
              </div>
              <div className="badge"><BadgeCheck size={14} style={{ marginRight: 8 }} /> verified</div>
            </div>

            {status !== 'authenticated' ? (
              <div className="form-note" style={{ marginTop: 24 }}>
                Bạn cần đăng nhập bằng Discord trước khi nộp whitelist.
                <div style={{ marginTop: 16 }}>
                  <button className="btn-primary" onClick={() => signIn('discord')}>LOGIN WITH DISCORD</button>
                </div>
              </div>
            ) : (
              <>
                <div className="form-note" style={{ marginTop: 24 }}>
                  Đăng nhập với: <strong style={{ color: '#fff' }}>{session?.user?.globalName || session?.user?.name}</strong>
                  <button style={{ marginLeft: 12, border: 0, background: 'transparent', color: '#f4c53a', fontWeight: 700 }} onClick={() => signOut()}>Đổi tài khoản</button>
                </div>
                <form onSubmit={submit}>
                  <div className="form-grid-2" style={{ marginTop: 18 }}>
                    <input className="input" name="full_name" value={form.full_name} onChange={onChange} placeholder="Họ và tên" required />
                    <input className="input" value={session?.user?.username || ''} disabled placeholder="Discord username" />
                  </div>
                  <div className="form-grid-2" style={{ marginTop: 14 }}>
                    <input className="input" name="age" type="number" min="16" value={form.age} onChange={onChange} placeholder="Tuổi" required />
                    <input className="input" name="rp_experience" value={form.rp_experience} onChange={onChange} placeholder="Kinh nghiệm roleplay" required />
                  </div>
                  <div className="form-grid-2" style={{ marginTop: 14 }}>
                    <input className="input" name="online_time" value={form.online_time} onChange={onChange} placeholder="Khung giờ thường online" required />
                    <input className="input" name="source" value={form.source} onChange={onChange} placeholder="Bạn biết đến server từ đâu?" required />
                  </div>
                  <textarea className="textarea" style={{ marginTop: 14 }} name="short_description" value={form.short_description} onChange={onChange} placeholder="Mô tả ngắn về bạn: bạn thích kiểu roleplay nào, thái độ khi chơi và điều bạn muốn đóng góp cho cộng đồng." required />
                  <textarea className="textarea long" style={{ marginTop: 14 }} name="backstory" value={form.backstory} onChange={onChange} placeholder="Tiểu sử nhân vật: quá khứ, mục tiêu, động lực, mối quan hệ, điểm mạnh - điểm yếu và cách nhân vật của bạn tồn tại trong thành phố." required />
                  <textarea className="textarea" style={{ marginTop: 14 }} name="why_join" value={form.why_join} onChange={onChange} placeholder="Vì sao đội ngũ nên chấp nhận bạn? Hãy trả lời ngắn gọn nhưng đủ thuyết phục." required />
                  <div className="form-note">Đơn whitelist sẽ được đội ngũ staff kiểm tra thủ công. Hãy coi đây là bước giới thiệu bản thân với thành phố, không chỉ là một form để điền cho xong.</div>
                  {message && <div className="form-note" style={{ color: message.includes('thành công') ? '#fde68a' : '#fca5a5' }}>{message}</div>}
                  <button type="submit" className="btn-full" disabled={loading} style={{ marginTop: 18 }}>{loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}</button>
                </form>
              </>
            )}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function UpdatePage() {
  return <section className="section"><div className="container"><Label></Label><h2 className="section-title">Update</h2><div className="updates-grid" style={{ marginTop: 28 }}>{updates.map((item) => <div key={item.title} className="update-card"><div className="content"><div className="badge">{item.tag}</div><div className="card-title">{item.title}</div><div className="card-text">{item.text}</div><div className="update-link">Read more <ChevronRight size={16} /></div></div></div>)}</div></div></section>;
}

function PedPage() {
  return <section className="section"><div className="container"><Label></Label><h2 className="section-title">PED</h2><div className="ped-grid" style={{ marginTop: 28 }}>{pedCards.map((item, i) => <div key={item.name} className="ped-card"><div className={`ped-visual ${i === 0 ? 'ped-v1' : i === 1 ? 'ped-v2' : 'ped-v3'}`}></div><div className="content"><div className="card-title">{item.name}</div><div className="card-text">{item.text}</div></div></div>)}</div></div></section>;
}

function DiscordPage({ discordUrl }) {
  return <section className="section"><div className="container discord-grid"><div className="discord-card"><div className="content"><Label>Community</Label><h2 className="section-title">Discord</h2><p className="section-sub" style={{ marginTop: 18 }}>Discord không phải nơi thay thế whitelist. Nó là trung tâm cộng đồng, thông báo, hỗ trợ và nhịp sống ngoài thành phố.</p><div className="panel-stack">{['Thông báo server', 'Kênh cộng đồng', 'Ticket hỗ trợ', 'Cập nhật sự kiện'].map((item) => <div className="info-tile" key={item}>{item}</div>)}</div><button className="btn-primary" style={{ marginTop: 28 }} onClick={() => window.open(discordUrl, '_blank', 'noopener,noreferrer')}>JOIN DISCORD <ExternalLink size={15} style={{ marginLeft: 8 }} /></button></div></div><div className="discord-card"><div className="content"><div className="info-tile"><div className="eyebrow">Invite link</div><div style={{ marginTop: 16, fontSize: 18, wordBreak: 'break-all' }}>{discordUrl}</div></div><div className="features-grid" style={{ marginTop: 20, gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>{[[ 'Live announcements', Bell ], ['Community channels', Users], ['Event notices', CalendarDays], ['Staff support', MessageSquare]].map(([title, Icon]) => <div className="info-tile" key={title}><Icon size={18} color="#a1a1aa" /><div className="info-title" style={{ marginTop: 14 }}>{title}</div></div>)}</div></div></div></div></section>;
}

export default function SiteApp({ discordUrl, initialPage = 'home' }) {
  const [page, setPage] = useState(initialPage);
  const [mobileOpen, setMobileOpen] = useState(false);

  const view = useMemo(() => {
    switch (page) {
      case 'features': return <FeaturesPage />;
      case 'whitelist': return <WhitelistPage />;
      case 'update': return <UpdatePage />;
      case 'ped': return <PedPage />;
      case 'discord': return <DiscordPage discordUrl={discordUrl} />;
      default: return <HomePage setPage={setPage} discordUrl={discordUrl} />;
    }
  }, [page, discordUrl]);

  return (
    <div className="page-shell">
      <Navbar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} discordUrl={discordUrl} />
      <main>{view}</main>
    </div>
  );
}
