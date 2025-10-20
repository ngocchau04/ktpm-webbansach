import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import voucherImage from "../../assets/voucher.png"
import "./VoucherPage.css";

const VoucherPage = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3001/voucher")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setVouchers(data.data);
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

    const handleCopy = (voucherCode) => {
        navigator.clipboard.writeText(voucherCode)
            .then(() => {
                alert("Voucher code copied!");
            })
            .catch((error) => {
                console.error("Error copying!:", error);
            });
    };

    if (loading) {
        return <div className="voucher-loading">Đang tải danh sách voucher...</div>;
    }

    return (
        <div>
            <Header />
            <div className="voucher-list">
                <h2>Danh sách Voucher</h2>
                <div id="voucher-list-div">
                    {vouchers.map((voucher) => (
                        <div className="voucher" key={voucher.voucherCode}>
                            <img src={voucherImage} alt="Voucher" />
                            <p><b onClick={() => handleCopy(voucher.voucherCode)} style={{ cursor: "pointer", color: "#CD0000" }}>{voucher.voucherCode}</b></p>
                            <p><b>
                                Giảm: {voucher.voucherType === 1
                                    ? `${voucher.voucherValue.toLocaleString('vi-VN')}₫`
                                    : `${voucher.voucherValue}%, tối đa ${voucher.maxDiscountValue.toLocaleString('vi-VN')}₫`}
                            </b></p>
                            <p>Đơn tối thiểu: {voucher.minOrderValue.toLocaleString('vi-VN')}₫</p>
                            <p>HSD: {new Intl.DateTimeFormat("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(voucher.voucherExpiration))}</p>
                            <p>Đã sử dụng: {voucher.usedCount}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default VoucherPage;
