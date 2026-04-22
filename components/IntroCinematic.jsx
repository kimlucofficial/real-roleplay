'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const scenes = [
  {
    key: 'chess',
    title: 'CONTROL. CONSEQUENCE. POWER.',
    body: 'Đây không phải là một thành phố dễ sống. Mỗi lựa chọn đều mang theo hệ quả. Mỗi hành động đều được ghi nhớ, và quyền lực không đến từ may mắn mà từ cách bạn kiểm soát cuộc chơi.'
  },
  {
    key: 'puppet',
    title: 'EVERY MOVE HAS A PRICE.',
    body: 'Ở Los Santos, con người không chỉ đối đầu với nhau. Họ còn đối đầu với tham vọng, ảnh hưởng, sự thao túng và những quyết định tưởng nhỏ nhưng có thể xoay chuyển cả cục diện.'
  },
  {
    key: 'chaos',
    title: 'ORDER HOLDS BY A THREAD.',
    body: 'Bạn có thể xây dựng trật tự, trở thành một phần của hỗn loạn, hoặc đứng giữa ranh giới đó để định nghĩa con đường riêng của mình. Nhưng một khi đã bước vào, không có đường quay lại.'
  }
];

export default function IntroCinematic({ onEnter }) {
  return (
    <section className="intro-cinematic">
      <div className="intro-cinematic-stack">
        {scenes.map((scene, index) => (
          <motion.article
            key={scene.key}
            className={`intro-cinematic-card scene-${scene.key}`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.08, duration: 0.6 }}
          >
            <div className="intro-cinematic-visual" />
            <div className="intro-cinematic-overlay" />
            <div className="intro-cinematic-copy">
              <div className="intro-cinematic-kicker">Introduction frame 0{index + 1}</div>
              <h3>{scene.title}</h3>
              <p>{scene.body}</p>
              {index === 0 ? (
                <button type="button" className="intro-cinematic-action" onClick={onEnter}>
                  Request Access
                  <ArrowRight size={16} />
                </button>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
