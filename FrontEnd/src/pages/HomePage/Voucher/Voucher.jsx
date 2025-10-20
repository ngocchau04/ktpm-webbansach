import React, { useEffect, useState } from "react";
// import Slide from "../../../components/Slide";
import "./Voucher.css";
import { Link } from "react-router-dom";
import voucherImage from "../../../assets/voucher.png"

// Hien thi chi tiet 1 voucher
const Voucher = ({
  voucherCode,
  voucherValue,
  maxDiscountValue,
  minOrderValue,
  voucherType,
  voucherDescription,
  voucherExpiration,
  usedCount,
}) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(voucherCode)
      .then(() => {
        alert("Voucher code copied!");
      })
      .catch((error) => {
        console.error("Error copying!:", error);
      });
  };

  return (
    <div className="voucher">
      <img src={voucherImage} alt="Voucher" />
      <p>
        <b onClick={handleCopy} style={{ cursor: "pointer", color: "#CD0000" }}>
          {voucherCode}
        </b>
      </p>
      <p>
        <b>
          Giảm{" "}
          {voucherType === 1
            ? `${voucherValue.toLocaleString("vi-VN")}₫`
            : `${voucherValue}%, tối đa ${maxDiscountValue.toLocaleString(
              "vi-VN"
            )}₫`}
        </b>
      </p>
      <p>Đơn tối thiểu: {minOrderValue.toLocaleString("vi-VN")}₫</p>
      <p>
        HSD:{" "}
        {new Intl.DateTimeFormat("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(voucherExpiration))}
      </p>
      <p>Đã sử dụng: {usedCount}</p>
    </div>
  );
};

// Hien thi danh sach voucher
const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/voucher")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          const sortedData = data.data
            .sort((a, b) => b.usedCount - a.usedCount)
            .slice(0, 5);
          setVouchers(sortedData);
        } else {
          console.error("Error fetching vouchers:", data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching vouchers:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="voucher-loading">Đang tải danh sách voucher...</div>;
  }

  return (
    <div className="voucher-list">
      <div className="title-componet">
        <h3>
          VOUCHER
        </h3>
        <Link to="/voucher" className="viewAll">
          Xem tất cả
        </Link>
      </div>
      <div id="voucher-list-div">
        {vouchers.map((voucher) => (
          <Voucher
            key={voucher.voucherCode}
            voucherCode={voucher.voucherCode}
            voucherValue={voucher.voucherValue}
            maxDiscountValue={voucher.maxDiscountValue}
            minOrderValue={voucher.minOrderValue}
            voucherType={voucher.voucherType}
            voucherDescription={voucher.voucherDescription}
            voucherExpiration={voucher.voucherExpiration}
            usedCount={voucher.usedCount}
          />
        ))}
      </div>
    </div>
  );
};

export default VoucherList;
