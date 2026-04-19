'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  ChevronRight,
  ExternalLink,
  Gavel,
  Landmark,
  MessageSquare,
  ScrollText,
  Shield,
  Sparkles,
  Users
} from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Navbar from './Navbar';
import { useMemo, useState } from 'react';

const introCards = [
  { title: 'Định hướng thành phố', text: 'Real Roleplay được xây như một thành phố có nhịp sống riêng: trật tự, xung đột, kinh tế, cộng đồng và hệ quả dài hạn.', accent: 'blue', icon: Landmark },
  { title: 'Character first', text: 'Nhân vật luôn đứng trước kỹ năng bấm phím. Câu chuyện của bạn phải có động lực, điểm yếu, lựa chọn và hậu quả.', accent: 'gold', icon: ScrollText },
  { title: 'Whitelist có giá trị', text: 'Cổng vào nghiêm túc là thứ giữ chất lượng cộng đồng. Chúng tôi ưu tiên người chơi thật sự muốn xây câu chuyện dài hơi.', accent: 'red', icon: Shield },
  { title: 'Trật tự và hỗn loạn', text: 'Law và Chaos không chỉ là 2 phe đối lập. Đó là triết lý vận hành mọi tình huống, quyền lực và lựa chọn trong thành phố.', accent: 'neutral', icon: Gavel },
  { title: 'Đạo diễn hình ảnh', text: 'Mỗi trang, mỗi block, mỗi thẻ nội dung đều phục vụ cùng một mood: dark, premium, điện ảnh và có chiều sâu thương hiệu.', accent: 'gold', icon: Sparkles },
  { title: 'Community có chọn lọc', text: 'Mục tiêu không phải đông nhanh, mà là đúng người. Một cộng đồng có gu sẽ tạo nên một server có đẳng cấp.', accent: 'blue', icon: Users }
];

const icRules = [
  { title: 'Giữ logic nhân vật', text: 'Mọi quyết định IC phải xuất phát từ tính cách, hoàn cảnh và thông tin mà nhân vật thật sự có.' },
  { title: 'Tôn trọng hậu quả', text: 'Hành động lớn phải kéo theo phản ứng tương xứng. Không có lựa chọn nào hoàn toàn miễn phí.' },
  { title: 'Ưu tiên diễn xuất', text: 'Roleplay, đàm phán, căng thẳng và xây tình huống luôn có giá trị hơn việc đẩy mọi thứ thành combat vô nghĩa.' }
];

const ocRules = [
  { title: 'Không kéo OOC vào IC', text: 'Mâu thuẫn ngoài đời hoặc trong chat không được phép làm hỏng câu chuyện của nhân vật trong thành phố.' },
  { title: 'Tôn trọng staff và người chơi', text: 'Góp ý văn minh, không toxic, không công kích cá nhân. Một community tốt bắt đầu từ thái độ tốt.' },
  { title: 'Không lạm dụng meta', text: 'Thông tin lấy từ stream, Discord, voice ngoài game hoặc chat OOC không được dùng để ra quyết định IC.' }
];

const updates = [
  { title: 'Season Update 1.2', tag: 'Major Patch', text: 'Mở rộng khu downtown, cân bằng economy và thêm tuyến tình huống mới giữa lực lượng luật pháp với thế giới ngầm.' },
  { title: 'Live Event Protocol', tag: 'Event', text: 'Chuỗi sự kiện live theo tuần với hệ quả trực tiếp lên các faction, doanh nghiệp và narrative của thành phố.' },
  { title: 'Whitelist Standard', tag: 'Policy', text: 'Tiêu chuẩn duyệt đơn được nâng cao để ưu tiên người chơi có tiểu sử tốt, thái độ đúng và định hướng RP rõ ràng.' }
];

const pedCards = [
  { name: 'Urban Professional', text: 'Gương mặt doanh nhân, luật sư, tay môi giới hoặc một ông trùm thích khoác lên mình vẻ ngoài sạch sẽ.' },
  { name: 'Street Operator', text: 'Hợp với chất đời, các tuyến nhân vật bụi bặm, underground và sống trong vùng xám của thành phố.' },
  { name: 'Tactical Officer', text: 'Dành cho tuyến luật pháp, bảo vệ hoặc nhân vật có màu sắc kỷ luật và quyền lực.' }
];

function Label({ children }) { return <div className="eyebrow">{children}</div>; }
function Panel({ children, className = '' }) { return <div className={`panel ${className}`}>{children}</div>; }

function PageHero({ eyebrow, title, description, rightTitle, rightItems = [], rightNote, accent = 'blue' }) {
  return (
    <section className={`page-hero accent-${accent}`}>
      <div className="page-hero-art" />
      <div className="container page-hero-grid">
        <div className="page-hero-copy">
          <Label>{eyebrow}</Label>
          <h1 className="page-hero-title">{title}</h1>
          <p className="page-hero-body">{description}</p>
        </div>
        <Panel className="page-hero-panel">
          <div className="panel-body">
            <Label>Curated focus</Label>
            <div className="page-hero-side-title">{rightTitle}</div>
            <div className="panel-stack compact">
              {rightItems.map(([a, b]) => (
                <div className="info-tile" key={a}>
                  <div className="info-title">{a}</div>
                  <div className="info-text">{b}</div>
                </div>
              ))}
            </div>
            {rightNote ? <div className="panel-highlight"><div className="info-text strong-note">{rightNote}</div></div> : null}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function Hero({ setPage, discordUrl }) {
  return (
    <section className="hero">
      <div className="hero-art" />
      <div className="hero-side-glow-left" />
      <div className="hero-side-glow-right" />
      <div className="container hero-grid">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="hero-copy">
          <Label>Director vision • art driven • whitelist first</Label>
          <h1 className="hero-title">Law <span className="muted">vs</span><span style={{ display: 'block' }}>Chaos</span></h1>
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
            <div className="panel-body hero-panel-body">
              <div>
                <Label>Luke.ng program</Label>
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
            {introCards.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <div className="feature-card premium-card">
                    <div className="content">
                      <div className={`accent-bar accent-${item.accent}`}></div>
                      <div className="icon-chip"><Icon size={18} /></div>
                      <div className="card-title">{item.title}</div>
                      <div className="card-text">{item.text}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function IntroductionPage() {
  return (
    <>
      <PageHero eyebrow="About the city" title="Giới thiệu" description="Real Roleplay không được xây theo kiểu vào chơi cho nhanh. Đây là một thế giới được dẫn dắt bằng mood, nhân vật và sự chọn lọc cộng đồng. Mọi trang trong website đều phải cho thấy cùng một đẳng cấp đó." rightTitle="World Standard" rightItems={[['Brand-first visual', 'Tối, sang, điện ảnh và có nhận diện rõ ràng.'], ['Roleplay priority', 'Câu chuyện nhân vật luôn là trung tâm.'], ['Long-term quality', 'Chỉ giữ lại những thứ phục vụ đẳng cấp chung của server.']]} rightNote="Đây là phần giới thiệu tổng quan cho người mới: họ phải hiểu server này là gì, khác ở đâu và vì sao đáng để bước vào." accent="blue" />
      <section className="section section-tight"><div className="container"><div className="features-grid">{introCards.map((item, i) => { const Icon = item.icon; return (<motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}><div className="feature-card premium-card"><div className="content"><div className={`accent-bar accent-${item.accent}`}></div><div className="icon-chip"><Icon size={18} /></div><div className="card-title">{item.title}</div><div className="card-text">{item.text}</div></div></div></motion.div>); })}</div></div></section>
    </>
  );
}

function RulesPage({ type }) {
  const ruleSet = type === 'oc' ? ocRules : icRules;
  const title = type === 'oc' ? 'Luật OC' : 'Luật IC';
  const eyebrow = type === 'oc' ? 'Out of character standards' : 'In character standards';
  const description = type === 'oc' ? 'Luật OC bảo vệ chất lượng cộng đồng bên ngoài nhân vật: thái độ, ứng xử, meta và cách mọi người tôn trọng nhau khi xây một server lâu dài.' : 'Luật IC giữ cho thành phố có logic, có trọng lượng và có hậu quả. Nó là khung để mọi câu chuyện được diễn ra một cách đáng tin.';

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} rightTitle={type === 'oc' ? 'Community Discipline' : 'Narrative Discipline'} rightItems={ruleSet.map((item) => [item.title, item.text])} rightNote={type === 'oc' ? 'OC tốt giữ community bền. IC tốt giữ thành phố sống.' : 'Mỗi luật tồn tại để câu chuyện có trọng lượng và để mọi quyết định đều có giá trị.'} accent={type === 'oc' ? 'red' : 'gold'} />
      <section className="section section-tight"><div className="container rules-grid">{ruleSet.map((item, index) => (<div className="feature-card premium-card" key={item.title}><div className="content"><div className="rule-number">0{index + 1}</div><div className="card-title">{item.title}</div><div className="card-text">{item.text}</div></div></div>))}</div></section>
    </>
  );
}

function WhitelistPage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ full_name: '', age: '', rp_experience: '', online_time: '', source: '', short_description: '', backstory: '', why_join: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/whitelist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
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
    <>
      <PageHero eyebrow="Whitelist priority" title="Enter the City" description="Đây không phải một form bình thường. Nó phải giống một cánh cổng tuyển chọn, nơi những người chơi nghiêm túc chứng minh họ xứng đáng bước vào thế giới này." rightTitle="Admission Logic" rightItems={[['Staff Reviewed', 'Mỗi hồ sơ được đội ngũ kiểm tra thủ công.'], ['Story Driven', 'Tiểu sử nhân vật là trọng tâm của đơn xét duyệt.'], ['Quality Filter', 'Whitelist giữ nhịp roleplay và chất lượng cộng đồng.']]} rightNote="Những hồ sơ có câu chuyện rõ ràng, thái độ tốt và động cơ roleplay nghiêm túc sẽ luôn có giá trị hơn mọi thứ khác." accent="gold" />
      <section className="section section-tight" style={{ position: 'relative' }}><div className="container whitelist-grid"><Panel><div className="panel-body"><Label>Admission note</Label><h2 className="section-title" style={{ marginTop: 12 }}>Before You Apply</h2><p className="section-sub" style={{ marginTop: 18 }}>Người được chấp nhận không chỉ là người trả lời đủ câu hỏi. Đó là người cho thấy mình hiểu roleplay, hiểu cộng đồng và có khả năng xây một nhân vật đáng nhớ.</p><div className="panel-stack">{[['Character First', 'Nhân vật cần có động lực, tính cách và mục tiêu rõ ràng.'], ['Serious Entry', 'Chỉ người chơi phù hợp mới được bước vào.'], ['Manual Review', 'Từng hồ sơ được xem xét cẩn thận thay vì auto accept.']].map(([a, b]) => <div className="info-tile" key={a}><div className="info-title">{a}</div><div className="info-text">{b}</div></div>)}</div></div></Panel><Panel><div className="panel-body"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16 }}><div><Label>Application form</Label><h3 className="section-title" style={{ fontSize: '2.6rem', marginTop: 12 }}>Submit Your Application</h3><p className="section-sub" style={{ marginTop: 12 }}>Trả lời nghiêm túc. Đây là lần đầu tiên thành phố đọc câu chuyện của bạn.</p></div><div className="badge"><BadgeCheck size={14} style={{ marginRight: 8 }} /> verified</div></div>{status !== 'authenticated' ? (<div className="form-note" style={{ marginTop: 24 }}>Bạn cần đăng nhập bằng Discord trước khi nộp whitelist.<div style={{ marginTop: 16 }}><button className="btn-primary" onClick={() => signIn('discord')}>LOGIN WITH DISCORD</button></div></div>) : (<><div className="form-note" style={{ marginTop: 24 }}>Đăng nhập với: <strong style={{ color: '#fff' }}>{session?.user?.globalName || session?.user?.name}</strong><button style={{ marginLeft: 12, border: 0, background: 'transparent', color: '#f4c53a', fontWeight: 700 }} onClick={() => signOut()}>Đổi tài khoản</button></div><form onSubmit={submit}><div className="form-grid-2" style={{ marginTop: 18 }}><input className="input" name="full_name" value={form.full_name} onChange={onChange} placeholder="Họ và tên" required /><input className="input" value={session?.user?.username || ''} disabled placeholder="Discord username" /></div><div className="form-grid-2" style={{ marginTop: 14 }}><input className="input" name="age" type="number" min="16" value={form.age} onChange={onChange} placeholder="Tuổi" required /><input className="input" name="rp_experience" value={form.rp_experience} onChange={onChange} placeholder="Kinh nghiệm roleplay" required /></div><div className="form-grid-2" style={{ marginTop: 14 }}><input className="input" name="online_time" value={form.online_time} onChange={onChange} placeholder="Khung giờ thường online" required /><input className="input" name="source" value={form.source} onChange={onChange} placeholder="Bạn biết đến server từ đâu?" required /></div><textarea className="textarea" style={{ marginTop: 14 }} name="short_description" value={form.short_description} onChange={onChange} placeholder="Mô tả ngắn về bạn: bạn thích kiểu roleplay nào, thái độ khi chơi và điều bạn muốn đóng góp cho cộng đồng." required /><textarea className="textarea long" style={{ marginTop: 14 }} name="backstory" value={form.backstory} onChange={onChange} placeholder="Tiểu sử nhân vật: quá khứ, mục tiêu, động lực, mối quan hệ, điểm mạnh - điểm yếu và cách nhân vật của bạn tồn tại trong thành phố." required /><textarea className="textarea" style={{ marginTop: 14 }} name="why_join" value={form.why_join} onChange={onChange} placeholder="Vì sao đội ngũ nên chấp nhận bạn? Hãy trả lời ngắn gọn nhưng đủ thuyết phục." required /><div className="form-note">Đơn whitelist sẽ được đội ngũ staff kiểm tra thủ công. Hãy coi đây là bước giới thiệu bản thân với thành phố, không chỉ là một form để điền cho xong.</div>{message && <div className="form-note" style={{ color: message.includes('thành công') ? '#fde68a' : '#fca5a5' }}>{message}</div>}<button type="submit" className="btn-full" disabled={loading} style={{ marginTop: 18 }}>{loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}</button></form></>)}</div></Panel></div></section>
    </>
  );
}

function UpdatePage() {
  return (
    <>
      <PageHero eyebrow="Changelog" title="Update" description="Thành phố không đứng yên. Các bản cập nhật phải vừa rõ ràng, vừa giữ được cảm giác brand và chiều sâu của server." rightTitle="Release Focus" rightItems={[['Narrative', 'Bản cập nhật nên tác động đến câu chuyện chứ không chỉ thêm đồ.'], ['Economy', 'Mọi chỉnh sửa đều phải có lý do vận hành.'], ['Quality', 'Tốc độ cập nhật không quan trọng bằng độ hoàn thiện.']]} rightNote="Update page nên trông như một changelog cao cấp, không phải blog ngẫu hứng." accent="red" />
      <section className="section section-tight"><div className="container"><div className="updates-grid">{updates.map((item) => (<div key={item.title} className="update-card premium-card"><div className="content"><div className="badge">{item.tag}</div><div className="card-title">{item.title}</div><div className="card-text">{item.text}</div><div className="update-link">Read more <ChevronRight size={16} /></div></div></div>))}</div></div></section>
    </>
  );
}

function PedPage() {
  return (
    <>
      <PageHero eyebrow="Identity library" title="PED" description="Mỗi ngoại hình nên phục vụ cho một kiểu nhân vật cụ thể. Trình bày PED theo hướng catalogue cao cấp sẽ làm cả website đồng bộ hơn." rightTitle="Visual Identity" rightItems={[['Profession', 'Sạch sẽ, chỉnh chu, quyền lực.'], ['Street', 'Đời, bụi, góc tối và màu xám.'], ['Authority', 'Kỷ luật, tactical, kiểm soát.']]} rightNote="PED page nên cho cảm giác tuyển chọn hình ảnh, không chỉ là một danh sách model." accent="blue" />
      <section className="section section-tight"><div className="container"><div className="ped-grid">{pedCards.map((item, i) => (<div key={item.name} className="ped-card premium-card"><div className={`ped-visual ${i === 0 ? 'ped-v1' : i === 1 ? 'ped-v2' : 'ped-v3'}`}></div><div className="content"><div className="card-title">{item.name}</div><div className="card-text">{item.text}</div></div></div>))}</div></div></section>
    </>
  );
}

function DiscordPage({ discordUrl }) {
  return (
    <>
      <PageHero eyebrow="Community hub" title="Discord" description="Discord không thay thế whitelist. Nó là nơi giữ nhịp cộng đồng, thông báo, hỗ trợ và toàn bộ luồng giao tiếp bên ngoài thành phố." rightTitle="Community Flow" rightItems={[['Announcements', 'Mọi thay đổi quan trọng đều đi qua đây.'], ['Support', 'Ticket và hướng dẫn luôn rõ ràng.'], ['Culture', 'Discord phải mang cùng mood với website và server.']]} rightNote="Một community sang không chỉ đến từ visual, mà còn đến từ cách tổ chức và giọng điệu giao tiếp." accent="gold" />
      <section className="section section-tight"><div className="container discord-grid"><div className="discord-card premium-card"><div className="content"><Label>Community</Label><h2 className="section-title">Discord Access</h2><p className="section-sub" style={{ marginTop: 18 }}>Discord là trung tâm cộng đồng, thông báo, hỗ trợ và nhịp sống ngoài thành phố.</p><div className="panel-stack">{['Thông báo server', 'Kênh cộng đồng', 'Ticket hỗ trợ', 'Cập nhật sự kiện'].map((item) => <div className="info-tile" key={item}>{item}</div>)}</div><button className="btn-primary" style={{ marginTop: 28 }} onClick={() => window.open(discordUrl, '_blank', 'noopener,noreferrer')}>JOIN DISCORD <ExternalLink size={15} style={{ marginLeft: 8 }} /></button></div></div><div className="discord-card premium-card"><div className="content"><div className="info-tile"><div className="eyebrow">Invite link</div><div style={{ marginTop: 16, fontSize: 18, wordBreak: 'break-all' }}>{discordUrl}</div></div><div className="features-grid icon-grid" style={{ marginTop: 20 }}>{[['Live announcements', Bell], ['Community channels', Users], ['Event notices', CalendarDays], ['Staff support', MessageSquare]].map(([title, Icon]) => (<div className="info-tile" key={title}><Icon size={18} color="#a1a1aa" /><div className="info-title" style={{ marginTop: 14 }}>{title}</div></div>))}</div></div></div></div></section>
    </>
  );
}

export default function SiteApp({ discordUrl, initialPage = 'home' }) {
  const [page, setPage] = useState(initialPage);
  const [mobileOpen, setMobileOpen] = useState(false);

  const view = useMemo(() => {
    switch (page) {
      case 'intro': return <IntroductionPage />;
      case 'rules-ic': return <RulesPage type="ic" />;
      case 'rules-oc': return <RulesPage type="oc" />;
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
