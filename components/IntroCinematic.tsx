"use client";
import { useEffect, useState } from "react";
import "../styles/cinematic.css";

export default function IntroCinematic() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="ultra2">
      <div className="bg-wrapper">
        <img src="/cinematic/1.jpg" className={step === 0 ? "active" : ""} />
        <img src="/cinematic/2.jpg" className={step === 1 ? "active" : ""} />
        <img src="/cinematic/3.jpg" className={step === 2 ? "active" : ""} />
      </div>

      <div className="overlay" />

      <div className="content">
        <h1>
          CONTROL.<br/>
          CONSEQUENCE.<br/>
          POWER.
        </h1>

        <p className="fade">Đây không phải là một thành phố dễ sống.</p>
        <p className="fade delay1">Mỗi lựa chọn đều mang theo hệ quả.</p>
        <p className="fade delay2">Mỗi hành động đều được ghi nhớ.</p>

        <p className="highlight">
          Một khi đã bước vào — không có đường quay lại.
        </p>

        <button className="cta">ENTER THE CITY</button>
      </div>
    </section>
  );
}
