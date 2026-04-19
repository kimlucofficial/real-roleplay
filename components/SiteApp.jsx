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
  { title: 'Ưu tiên nhân vật', text: 'Nhân vật luôn đứng trước kỹ năng bấm phím. Câu chuyện của bạn phải có động lực, điểm yếu, lựa chọn và hậu quả.', accent: 'gold', icon: ScrollText },
  { title: 'Whitelist có giá trị', text: 'Cổng vào nghiêm túc là thứ giữ chất lượng cộng đồng. Chúng tôi ưu tiên người chơi thật sự muốn xây câu chuyện dài hơi.', accent: 'red', icon: Shield },
  { title: 'Trật tự và hỗn loạn', text: 'Law và Chaos không chỉ là 2 phe đối lập. Đó là triết lý vận hành mọi tình huống, quyền lực và lựa chọn trong thành phố.', accent: 'neutral', icon: Gavel },
  { title: 'Đạo diễn hình ảnh', text: 'Mỗi trang, mỗi block, mỗi thẻ nội dung đều phục vụ cùng một mood: dark, premium, điện ảnh và có chiều sâu thương hiệu.', accent: 'gold', icon: Sparkles },
  { title: 'Community có chọn lọc', text: 'Mục tiêu không phải đông nhanh, mà là đúng người. Một cộng đồng có gu sẽ tạo nên một server có đẳng cấp.', accent: 'blue', icon: Users }
];

const icRules = [
  { title: 'Tôn trọng nhận thức của nhân vật', text: 'Chỉ hành động theo những gì nhân vật thật sự biết, thấy hoặc được kể lại một cách hợp lệ.' },
  { title: 'Giữ động cơ và tính cách nhất quán', text: 'Mọi lựa chọn lớn phải phản ánh quá khứ, tham vọng, điểm mạnh và điểm yếu của nhân vật.' },
  { title: 'Không ép tình huống vô lý', text: 'Không đẩy diễn biến đi quá nhanh hoặc quá cực đoan nếu bối cảnh chưa đủ thuyết phục.' },
  { title: 'Tôn trọng hậu quả sau hành động', text: 'Mọi hành vi có rủi ro đều phải chấp nhận phản ứng từ pháp luật, cộng đồng hoặc đối thủ.' },
  { title: 'Không powergaming', text: 'Không áp đặt kết quả hành động lên người khác và không biến roleplay thành thao tác một chiều.' , important: true},
  { title: 'Không metagaming', text: 'Không sử dụng thông tin lấy từ Discord, stream, voice ngoài game hoặc OOC để dẫn dắt quyết định IC.', important: true },
  { title: 'Không mix cảm xúc OOC vào IC', text: 'Mâu thuẫn ngoài đời không được phép làm thay đổi hành vi của nhân vật trong thành phố.' },
  { title: 'Ưu tiên đối thoại trước leo thang', text: 'Khi bối cảnh cho phép, hãy để roleplay, thương lượng và tension dẫn chuyện trước bạo lực.' },
  { title: 'Tôn trọng tuyến vai của người khác', text: 'Không cắt ngang hoặc phá vỡ arc của người chơi khác chỉ để giành spotlight ngắn hạn.' },
  { title: 'Giữ nhịp độ tình huống hợp lý', text: 'Những tuyến lớn cần được xây theo lớp, tránh đốt giai đoạn hoặc đẩy conflict quá nhanh.' },
  { title: 'Không abuse cơ chế để thắng IC', text: 'Cơ chế gameplay không được dùng như công cụ lách logic hoặc phá trải nghiệm câu chuyện.' },
  { title: 'Bảo toàn giá trị rủi ro', text: 'Khi bước vào tình huống nguy hiểm, nhân vật phải cư xử như đang thật sự có thứ để mất.' },
  { title: 'Tài sản và quyền lực phải có nguồn gốc', text: 'Xe, nhà, doanh nghiệp, quan hệ hoặc ảnh hưởng lớn cần được xây bằng roleplay hợp lý.' },
  { title: 'Hợp tác khi có tuyến chung', text: 'Khi nhiều người cùng tham gia một kịch bản, cần giữ tính phối hợp để tình huống tròn và có nhịp.' },
  { title: 'Không biến mọi việc thành combat', text: 'Bạo lực là một nhánh của roleplay, không phải đáp án mặc định cho mọi mâu thuẫn.' },
  { title: 'Phản ứng theo mức độ thông tin', text: 'Chỉ được nghi ngờ, truy xét hoặc trả đũa ở mức phù hợp với chứng cứ mà nhân vật đang có.' },
  { title: 'Tôn trọng không gian công cộng', text: 'Các hành vi phá phách, gây náo loạn hoặc lạm dụng phương tiện phải đi kèm nguy cơ bị xử lý IC.' },
  { title: 'Giữ logic nghề nghiệp', text: 'Người làm luật, doanh nhân, dân thường hay tội phạm đều cần hành xử đúng với tuyến vai của mình.' },
  { title: 'Mọi giao dịch phải có bối cảnh', text: 'Trao đổi tiền, hàng, dịch vụ hoặc thông tin cần diễn ra trong bối cảnh hợp lý và có diễn biến.' },
  { title: 'Không lạm dụng việc quên ký ức', text: 'Mất trí nhớ, bỏ qua hậu quả hoặc chối bỏ tình huống chỉ được dùng khi có lý do IC chặt chẽ.' },
  { title: 'Tôn trọng hiện trường và chứng cứ', text: 'Những vụ việc lớn nên để lại dấu vết, nhân chứng hoặc hệ quả thay vì tự biến mất vô lý.' },
  { title: 'Giữ chuẩn nhập vai khi bị bắt giữ', text: 'Các tình huống kiểm tra, thẩm vấn, truy đuổi hoặc xét xử cần được roleplay đủ và không qua loa.' },
  { title: 'Tôn trọng ranh giới năng lực nhân vật', text: 'Không tự biến nhân vật thành người giỏi mọi thứ nếu câu chuyện chưa từng xây điều đó.' },
  { title: 'Xây quan hệ theo thời gian', text: 'Tin tưởng, thù hằn, liên minh hay phản bội đều nên được tích lũy bằng nhiều tương tác thực tế.' },
  { title: 'Giữ giá trị danh tiếng', text: 'Tên tuổi của nhân vật trong thành phố phải đến từ hành vi lặp lại và ảnh hưởng được công nhận.' },
  { title: 'Không lạm dụng danh nghĩa tổ chức', text: 'Factions, doanh nghiệp hay nhóm riêng không được dùng như lá chắn để né trách nhiệm cá nhân.' },
  { title: 'Tôn trọng nhịp phục hồi sau sự kiện lớn', text: 'Sau những biến cố nặng, nhân vật cần thời gian phản ứng thay vì quay lại bình thường ngay lập tức.' },
  { title: 'Chấp nhận thua khi câu chuyện đòi hỏi', text: 'Một nhân vật tốt không phải lúc nào cũng thắng; biết thua đúng lúc sẽ làm arc có giá trị hơn.', important: true },
  { title: 'Giữ chất lượng trình bày IC', text: 'Tin nhắn, thoại, hành động và mô tả nên rõ ràng, có chủ đích và đủ để người khác bắt nhịp.' },
  { title: 'Bảo vệ tính liên tục của thành phố', text: 'Hãy chơi như thể thành phố vẫn tiếp tục sống sau khi bạn rời khỏi màn hình, không chỉ tồn tại cho riêng bạn.' }
];

const ocRules = [
  { title: 'Tôn trọng staff và người chơi', text: 'Góp ý đúng mực, không công kích cá nhân và không tạo không khí độc hại trong cộng đồng.', important: true },
  { title: 'Không kéo drama ngoài đời vào server', text: 'Mâu thuẫn cá nhân, chuyện riêng hoặc nhóm riêng không được làm ảnh hưởng trải nghiệm chung.' },
  { title: 'Không phát tán thông tin sai lệch', text: 'Mọi thắc mắc về luật, án phạt hoặc quy trình nên xác minh với staff trước khi lan truyền.' },
  { title: 'Không toxic trong chat hoặc voice', text: 'Cách giao tiếp bên ngoài nhân vật phải giữ được sự lịch sự và mức tôn trọng tối thiểu.' },
  { title: 'Không quấy rối người chơi khác', text: 'Spam, bám đuôi OOC, gây áp lực hoặc xúc phạm lặp lại đều không được chấp nhận.', important: true },
  { title: 'Không dùng thông tin OOC để dẫn IC', text: 'Những gì biết ngoài game không được phép trở thành lợi thế bên trong thành phố.', important: true },
  { title: 'Tôn trọng quyết định điều hành', text: 'Nếu có tranh cãi, xử lý qua kênh hỗ trợ thay vì kéo đám đông hoặc gây náo loạn công khai.' },
  { title: 'Không chia phe phá cộng đồng', text: 'Không tạo tâm lý bè phái, cô lập người khác hoặc kích động sự đối đầu ngoài phạm vi roleplay.' },
  { title: 'Không lợi dụng bug hoặc lỗi hệ thống', text: 'Mọi lỗi phát hiện cần báo lại; việc khai thác bug để có lợi thế sẽ bị xử lý nặng.', important: true },
  { title: 'Giữ văn hóa trao đổi trưởng thành', text: 'Bất đồng là bình thường, nhưng cách nói chuyện phải giữ tiêu chuẩn của một cộng đồng có chọn lọc.' },
  { title: 'Không spam ticket hoặc staff', text: 'Hãy gom thông tin rõ ràng trước khi gửi để đội ngũ xử lý nhanh và chính xác hơn.' },
  { title: 'Tôn trọng quyền riêng tư', text: 'Không tự ý phát tán hình ảnh, tin nhắn riêng hoặc thông tin cá nhân của người khác.' },
  { title: 'Không mạo danh đội ngũ', text: 'Không sử dụng danh nghĩa staff, partner hoặc người có quyền hạn để dẫn dắt cộng đồng sai lệch.' },
  { title: 'Không kích động bypass quy trình', text: 'Mọi whitelist, khiếu nại hoặc hỗ trợ đều đi theo luồng chính thức thay vì nhờ vả vòng ngoài.' },
  { title: 'Tôn trọng kết quả xử lý', text: 'Nếu không đồng ý với quyết định, hãy kháng nghị đúng quy trình thay vì công kích công khai.' },
  { title: 'Không lạm dụng ping hoặc mention', text: 'Việc gọi đích danh staff hoặc cộng đồng hàng loạt chỉ nên dùng khi thực sự cần thiết.' },
  { title: 'Giữ môi trường giao tiếp sạch', text: 'Không đăng nội dung phản cảm, kích động hoặc làm giảm hình ảnh chung của server.' },
  { title: 'Không chia sẻ công cụ trái phép', text: 'Script, cheat, exploit hoặc hướng dẫn lách luật tuyệt đối không được tồn tại trong cộng đồng.' },
  { title: 'Tôn trọng thời gian phản hồi', text: 'Không phải mọi ticket đều được trả lời ngay; kiên nhẫn là một phần của văn hóa cộng đồng.' },
  { title: 'Giữ uy tín khi đại diện cộng đồng', text: 'Khi xuất hiện ở nơi khác dưới tên server, bạn đang góp phần xây hoặc làm xấu đi hình ảnh chung.' }
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
            <button className="btn-primary elite-primary" onClick={() => setPage('whitelist')}>NỘP ĐƠN <ArrowRight size={16} style={{ marginLeft: 8 }} /></button>
            <button className="btn-secondary elite-secondary" onClick={() => setPage('intro')}>CITY STANDARD</button>
          </div>
          <div className="stats">
            {[['50+', 'Người chơi trên toàn thành phố'], ['24/7', 'Thành phố không bao giờ ngủ'], ['100+', 'Jobs & identities']].map(([v, l]) => (
              <div className="stat-box" key={l}><div className="stat-value">{v}</div><div className="stat-label">{l}</div></div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75 }} className="hero-card">
          <Panel>
            <div className="panel-body hero-panel-body">
              <div>
                <Label>Private access</Label>
                <div className="section-title" style={{ marginTop: 12 }}>QUYỀN TRUY CẬP THÀNH PHỐ</div>
              </div>
              <div className="panel-stack">
                {[
                  ['Ưu tiên nhân vật', 'Tiểu sử tốt quan trọng hơn lời hứa suông.'],
                  ['Tuyển chọn nghiêm túc', 'Chỉ người chơi phù hợp mới được bước vào.'],
                  ['Được kiểm duyệt bởi đội ngũ', 'Tất cả hồ sơ được xem xét cẩn thận.']
                ].map(([a, b]) => (
                  <div className="info-tile" key={a}><div className="info-title">{a}</div><div className="info-text">{b}</div></div>
                ))}
              </div>
              <div className="panel-highlight">
                <div className="eyebrow" style={{ color: '#f4c53a' }}>Main action</div>
                <div className="card-title" style={{ marginTop: 10 }}>Whitelist</div>
                <div className="card-text" style={{ color: '#d4d4d8' }}>Một cánh cổng duy nhất giữ lại đúng người, đúng thái độ và đúng chất lượng cho thành phố.</div>
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
            <div className="badge elite-badge">PRIVATE ACCESS ONLY</div>
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
  const description = type === 'oc'
    ? 'Luật OC giữ cho cộng đồng sạch, văn minh và có kỷ luật. Mục tiêu là bảo vệ trải nghiệm chung mà không làm mất chất premium của toàn bộ hệ thống.'
    : 'Luật IC giữ cho thành phố có trọng lượng, logic và hậu quả. Cách trình bày được thiết kế để bạn đọc nhanh, nhớ lâu và vẫn giữ được cảm giác luxury của website.';
  const importantRules = ruleSet.filter((item) => item.important).slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        rightTitle={type === 'oc' ? 'Community Discipline' : 'Narrative Discipline'}
        rightItems={[
          [type === 'oc' ? '20 rule capacity' : '30 rule capacity', type === 'oc' ? 'Layout chia 2 cột để đọc nhanh và không bị nặng mắt.' : 'Layout chia 3 cột để chứa nhiều luật mà vẫn giữ nhịp luxury.'],
          ['Important notes', 'Các luật đặc biệt quan trọng được đánh dấu rõ để người đọc không bỏ sót.'],
          ['Controlled palette', 'Giữ bảng màu tối, điểm vàng tinh tế thay vì nhiều màu game UI.']
        ]}
        rightNote={type === 'oc'
          ? 'Important: ưu tiên sự văn minh, tôn trọng quy trình và bảo vệ trải nghiệm cộng đồng.'
          : 'Important: ưu tiên logic nhân vật, không meta, không powergaming và luôn tôn trọng hậu quả.'}
        accent={type === 'oc' ? 'red' : 'gold'}
      />
      <section className="section section-tight">
        <div className="container rules-shell">
          <div className="rules-topbar">
            <div>
              <Label>{type === 'oc' ? 'Community code' : 'City doctrine'}</Label>
              <h2 className="section-title rules-title">{type === 'oc' ? 'Outside the Character' : 'Inside the Character'}</h2>
              <p className="section-sub rules-sub">{type === 'oc' ? 'Thiết kế ưu tiên sự gọn gàng, tôn trọng và dễ rà soát khi số lượng luật tăng lên.' : 'Thiết kế này được dựng để bạn có thể mở rộng lên 30 luật IC mà vẫn giữ cảm giác gọn và cao cấp.'}</p>
            </div>
            <div className="rules-summary">
              <div className="badge elite-badge">{ruleSet.length} RULES</div>
              <div className="badge rules-important-badge">IMPORTANT NOTES INCLUDED</div>
            </div>
          </div>

          {importantRules.length ? (
            <div className="important-strip">
              {importantRules.map((item) => (
                <div className="important-chip" key={item.title}>
                  <span className="important-label">IMPORTANT</span>
                  <span className="important-text">{item.title}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className={`rules-lux-grid ${type === 'oc' ? 'rules-lux-grid-oc' : 'rules-lux-grid-ic'}`}>
            {ruleSet.map((item, index) => (
              <div className="rule-lux-card" key={item.title}>
                <div className="rule-lux-top">
                  <div className="rule-lux-index">{String(index + 1).padStart(2, '0')}</div>
                  {item.important ? <div className="rule-lux-tag">Important</div> : null}
                </div>
                <div className="rule-lux-title">{item.title}</div>
                <div className="rule-lux-text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function WhitelistPage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ full_name: '', age: '', rp_experience: '', online_time: '', source: 'Discord Community', short_description: '', backstory: '', why_join: '' });

  const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  const restrictedFields = {
    full_name: /[^a-zA-ZÀ-ỹ\s]/g,
    age: /[^0-9]/g
  };

  const wordLimitedFields = new Set(['short_description', 'backstory', 'why_join']);

  const getWordError = (value, minWords = 50) => {
    const words = countWords(value);
    if (words === 0) return '';
    if (words < minWords) return `Ít nhất ${minWords} chữ`;
    if (words > 300) return 'Tối đa 300 chữ';
    return '';
  };
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;

    if (restrictedFields[name]) {
      setForm((prev) => ({ ...prev, [name]: value.replace(restrictedFields[name], '') }));
      return;
    }

    if (wordLimitedFields.has(name) && countWords(value) > 300) return;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const wordErrors = [
      getWordError(form.short_description, 50),
      getWordError(form.backstory, 50),
      getWordError(form.why_join, 30)
    ].filter(Boolean);
    if (wordErrors.length) {
      setMessage('Mô tả phải từ 50 đến 300 chữ, tiểu sử phải từ 50 đến 300 chữ và phần vì sao phải từ 30 đến 300 chữ.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/whitelist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submit failed');
      setMessage('Đơn whitelist đã được gửi thành công.');
      setForm({ full_name: '', age: '', rp_experience: '', online_time: '', source: 'Discord Community', short_description: '', backstory: '', why_join: '' });
    } catch (err) {
      setMessage(err.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero eyebrow="Whitelist priority" title="Request Access" description="Đây là cánh cổng vào duy nhất của thành phố. Mọi hồ sơ đều đi qua cùng một luồng tuyển chọn: gọn, rõ và đủ tinh tế để giữ đúng chất lượng cộng đồng." rightTitle="Admission Logic" rightItems={[['Single Entry', 'Mọi hồ sơ đều đi qua một nguồn duy nhất: Discord Community.'], ['Story Driven', 'Tiểu sử nhân vật là trọng tâm của đơn xét duyệt.'], ['Manual Review', 'Mỗi hồ sơ được đội ngũ kiểm tra thủ công.']]} rightNote="Một cánh cổng duy nhất khiến whitelist trở thành đặc quyền, không còn là một nút bấm xuất hiện ở khắp nơi." accent="gold" />
      <section className="section section-tight" style={{ position: 'relative' }}><div className="container whitelist-grid"><Panel><div className="panel-body"><Label>Admission note</Label><h2 className="section-title" style={{ marginTop: 12 }}>Before You Apply</h2><p className="section-sub" style={{ marginTop: 18 }}>Người được chấp nhận không chỉ là người trả lời đủ câu hỏi. Đó là người cho thấy mình hiểu roleplay, hiểu cộng đồng và có khả năng xây một nhân vật đáng nhớ.</p><div className="panel-stack">{[['Ưu tiên nhân vật', 'Nhân vật cần có động lực, tính cách và mục tiêu rõ ràng.'], ['Tuyển chọn nghiêm túc', 'Chỉ người chơi phù hợp mới được bước vào.'], ['Manual Review', 'Từng hồ sơ được xem xét cẩn thận thay vì auto accept.']].map(([a, b]) => <div className="info-tile" key={a}><div className="info-title">{a}</div><div className="info-text">{b}</div></div>)}</div></div></Panel><Panel><div className="panel-body"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16 }}><div><Label>Application form</Label><h3 className="section-title" style={{ fontSize: '2.6rem', marginTop: 12 }}>Submit Your Application</h3><p className="section-sub" style={{ marginTop: 12 }}>Trả lời nghiêm túc. Đây là lần đầu tiên thành phố đọc câu chuyện của bạn.</p></div><div className="badge"><BadgeCheck size={14} style={{ marginRight: 8 }} /> verified</div></div>{status !== 'authenticated' ? (<div className="form-note" style={{ marginTop: 24 }}>Bạn cần đăng nhập bằng Discord trước khi nộp whitelist.<div style={{ marginTop: 16 }}><button className="btn-primary" onClick={() => signIn('discord')}>LOGIN WITH DISCORD</button></div></div>) : (<><div className="form-note" style={{ marginTop: 24 }}>Đăng nhập với: <strong style={{ color: '#fff' }}>{session?.user?.globalName || session?.user?.name}</strong><button style={{ marginLeft: 12, border: 0, background: 'transparent', color: '#f4c53a', fontWeight: 700 }} onClick={() => signOut()}>Đổi tài khoản</button></div><form onSubmit={submit}><div className="form-grid-2" style={{ marginTop: 18 }}><input className="input" name="full_name" value={form.full_name} onChange={onChange} placeholder="Họ và tên" inputMode="text" required /><input className="input" value={session?.user?.username || ''} disabled placeholder="Discord username" /></div><div className="form-grid-2" style={{ marginTop: 14 }}><input className="input" name="age" type="text" inputMode="numeric" value={form.age} onChange={onChange} placeholder="Tuổi" required /><input className="input" name="rp_experience" value={form.rp_experience} onChange={onChange} placeholder="Kinh nghiệm roleplay" required /></div><div className="form-grid-2" style={{ marginTop: 14 }}><input className="input" name="online_time" value={form.online_time} onChange={onChange} placeholder="Khung giờ thường online" required /><div className="source-lock"><div className="eyebrow">Nguồn vào duy nhất</div><div className="source-lock-value">Discord Community</div><div className="source-lock-note">Whitelist hiện chỉ nhận hồ sơ từ một nguồn duy nhất để giữ luồng tuyển chọn rõ ràng.</div></div></div><input type="hidden" name="source" value={form.source} /><div className="field-wrap" style={{ marginTop: 14 }}><textarea className="textarea" name="short_description" value={form.short_description} onChange={onChange} placeholder="Mô tả ngắn về bạn: bạn thích kiểu roleplay nào, thái độ khi chơi và điều bạn muốn đóng góp cho cộng đồng." required /><div className="field-meta"><span>{countWords(form.short_description)} / 300 chữ</span><span>Tối thiểu 50 chữ</span></div>{getWordError(form.short_description) && <div className="field-error">{getWordError(form.short_description)}</div>}</div><div className="field-wrap" style={{ marginTop: 14 }}><textarea className="textarea long" name="backstory" value={form.backstory} onChange={onChange} placeholder="Tiểu sử nhân vật: quá khứ, mục tiêu, động lực, mối quan hệ, điểm mạnh - điểm yếu và cách nhân vật của bạn tồn tại trong thành phố." required /><div className="field-meta"><span>{countWords(form.backstory)} / 300 chữ</span><span>Tối thiểu 50 chữ</span></div>{getWordError(form.backstory) && <div className="field-error">{getWordError(form.backstory)}</div>}</div><div className="field-wrap" style={{ marginTop: 14 }}><textarea className="textarea" name="why_join" value={form.why_join} onChange={onChange} placeholder="Vì sao đội ngũ nên chấp nhận bạn? Hãy trả lời ngắn gọn nhưng đủ thuyết phục." required /><div className="field-meta"><span>{countWords(form.why_join)} / 300 chữ</span><span>Tối thiểu 30 chữ</span></div>{getWordError(form.why_join, 30) && <div className="field-error">{getWordError(form.why_join, 30)}</div>}</div><div className="form-note">Đơn whitelist sẽ được đội ngũ staff kiểm tra thủ công. Hãy coi đây là bước giới thiệu bản thân với thành phố, không chỉ là một form để điền cho xong.</div>{message && <div className="form-note" style={{ color: message.includes('thành công') ? '#fde68a' : '#fca5a5' }}>{message}</div>}<button type="submit" className="btn-full" disabled={loading} style={{ marginTop: 18 }}>{loading ? 'SUBMITTING...' : 'REQUEST ACCESS'}</button></form></>)}</div></Panel></div></section>
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
