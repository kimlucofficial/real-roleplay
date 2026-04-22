"use client";

export default function IntroCinematic() {
  return (
    <section className="cinematic">
      <div className="bg chess"></div>
      <div className="bg puppet"></div>
      <div className="bg chaos"></div>

      <div className="content">
        <h1>CONTROL. CONSEQUENCE. POWER.</h1>

        <p>
          Đây không phải là một thành phố dễ sống. Mỗi lựa chọn đều mang theo hệ quả.
          Mỗi hành động đều được ghi nhớ.
        </p>

        <p>
          Quyền lực không đến từ may mắn — mà từ cách bạn kiểm soát cuộc chơi.
          Bạn có thể xây dựng trật tự, hoặc trở thành một phần của hỗn loạn.
        </p>

        <p className="highlight">
          Một khi đã bước vào — không có đường quay lại.
        </p>
      </div>
    </section>
  );
}
