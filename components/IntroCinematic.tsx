"use client";
import { useEffect, useState } from "react";

export default function IntroCinematic() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 300);
  }, []);

  return (
    <section className="ultra-cinematic">
      <div className="bg layer1"></div>
      <div className="bg layer2"></div>
      <div className="bg layer3"></div>

      <div className={`content ${visible ? "show" : ""}`}>
        <h1>
          CONTROL.<br/>
          CONSEQUENCE.<br/>
          POWER.
        </h1>

        <p className="line">Đây không phải là một thành phố dễ sống.</p>
        <p className="line">Mỗi lựa chọn đều mang theo hệ quả.</p>
        <p className="line">Mỗi hành động đều được ghi nhớ.</p>

        <p className="highlight">
          Một khi đã bước vào — không có đường quay lại.
        </p>

        <button className="cta">ENTER THE CITY</button>
      </div>
    </section>
  );
}
