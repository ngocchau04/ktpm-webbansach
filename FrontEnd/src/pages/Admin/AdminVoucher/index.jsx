import axios from "axios";
import { useState, useEffect } from "react";
import './AdminVoucher.css'
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";

function AdminVoucher() {
    const [currentPage, setCurrentPage] = useState(1);
    const vouchersPerPage = 5;
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for adding a voucher
    const [newVoucher, setNewVoucher] = useState({
        voucherCode: "",
        voucherValue: "",
        voucherType: "", // 1: tiền, 2: %
        maxDiscountValue: "",
        minOrderValue: "",
        voucherExpiration: "",
    });

    // Fetch voucher data from backend
    useEffect(() => {
        fetch("http://localhost:3001/voucher")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    const sortedData = data.data.sort((a, b) => b.usedCount - a.usedCount);
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

    // // Add voucher
    // const handleAddVoucher = async () => {
    //     try {
    //         const jwt = localStorage.getItem('token');
    //         const response = await axios.post("http://localhost:3001/voucher", newVoucher, {
    //             headers: {
    //                 Authorization: `Bearer ${jwt}`,
    //             },
    //         });

    //         if (response.status === 201 && response.data.status === "success") {
    //             setVouchers([...vouchers, response.data.data]); // Cập nhật danh sách voucher
    //             alert("Thêm voucher thành công!");

    //             // Reset form
    //             setNewVoucher({
    //                 voucherCode: "",
    //                 voucherValue: "",
    //                 voucherType: 1,
    //                 maxDiscountValue: "",
    //                 minOrderValue: "",
    //                 voucherExpiration: "",
    //             });
    //         } else {
    //             alert("Đã xảy ra lỗi khi thêm voucher!");
    //         }
    //     } catch (error) {
    //         console.error("Error adding voucher:", error);
    //         alert("Không thể thêm voucher, vui lòng thử lại!");
    //     }
    // };

    // Add voucher
    const handleAddVoucher = async () => {
        // Kiểm tra các trường bắt buộc
        if (!newVoucher.voucherCode) {
            alert("Vui lòng nhập Mã voucher!");
            return;
        }
        if (!newVoucher.voucherType) {
            alert("Vui lòng chọn Loại voucher!");
            return;
        }
        if (!newVoucher.voucherValue) {
            alert("Vui lòng nhập Giá trị voucher!");
            return;
        }
        if (newVoucher.voucherType === 2 && !newVoucher.maxDiscountValue) {
            alert("Vui lòng nhập Giá trị giảm tối đa cho voucher!");
            return;
        }
        if (!newVoucher.minOrderValue) {
            alert("Vui lòng nhập Giá trị đơn hàng tối thiểu!");
            return;
        }
        if (!newVoucher.voucherExpiration) {
            alert("Vui lòng nhập Ngày hết hạn!");
            return;
        }

        // Kiểm tra mã voucher đã tồn tại
        const isVoucherExist = vouchers.some(voucher => voucher.voucherCode === newVoucher.voucherCode);
        if (isVoucherExist) {
            alert("Mã voucher đã tồn tại!");
            return;
        }

        try {
            const jwt = localStorage.getItem('token');
            const response = await axios.post("http://localhost:3001/voucher", newVoucher, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            if (response.status === 201 && response.data.status === "success") {
                setVouchers([...vouchers, response.data.data]); // Cập nhật danh sách voucher
                alert("Thêm voucher thành công!");

                // Reset form
                setNewVoucher({
                    voucherCode: "",
                    voucherValue: "",
                    voucherType: "",
                    maxDiscountValue: "",
                    minOrderValue: "",
                    voucherExpiration: "",
                });
            } else {
                alert("Đã xảy ra lỗi khi thêm voucher!");
            }
        } catch (error) {
            console.error("Error adding voucher:", error);
            alert("Không thể thêm voucher, vui lòng thử lại!");
        }
    };

    // Delete voucher
    const handleDelete = async (voucherId) => {
        // Hiển thị cảnh báo xác nhận trước khi xóa
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá voucher này không?");
        if (!confirmDelete) {
            return; // Người dùng chọn "Hủy"
        }

        try {
            const jwt = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3001/voucher/${voucherId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`, // Gửi token trong header
                },
            });
            if (response.status === 200 && response.data.status === "success") {
                // Xóa voucher khỏi danh sách hiển thị
                setVouchers(vouchers.filter((voucher) => voucher._id !== voucherId));
                alert("Xoá voucher thành công!"); // Thông báo thành công
            } else {
                console.error("Error deleting voucher:", response.data.message);
                alert("Đã xảy ra lỗi khi xoá voucher!"); // Thông báo lỗi
            }
        } catch (error) {
            console.error("Error deleting voucher:", error);
            alert("Không thể xoá voucher, vui lòng thử lại!"); // Thông báo lỗi
        }
    };

    if (loading) {
        return <div className="voucher-loading">Đang tải danh sách voucher...</div>;
    }

    const indexOfLastVoucher = currentPage * vouchersPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
    const currentVouchers = vouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(vouchers.length / vouchersPerPage)));
    };

    return (
        <>
            <div style={{ height: "20px" }} />
            <h1>Quản lý voucher</h1>
            <div style={{ height: "20px" }} />

            {/* Viewing voucher */}
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã voucher</th>
                        <th>Giá trị</th>
                        <th>Giảm tối đa</th>
                        <th>Đơn hàng tối thiểu</th>
                        <th>Hạn sử dụng</th>
                        <th>Đã sử dụng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentVouchers.map((voucher, index) => (
                        <tr key={voucher._id}>
                            <td className="stt">{indexOfFirstVoucher + index + 1}</td>
                            <td>{voucher.voucherCode}</td>
                            <td>
                                {voucher.voucherType === 1
                                    ? `${voucher.voucherValue.toLocaleString()}₫`
                                    : `${voucher.voucherValue}%`}
                            </td>
                            <td>
                                {voucher.voucherType === 1
                                    ? `${voucher.voucherValue.toLocaleString()}₫`
                                    : voucher.maxDiscountValue === null ? '' : `${voucher.maxDiscountValue.toLocaleString()}₫`}
                            </td>
                            <td>{voucher.minOrderValue.toLocaleString()}₫</td>
                            <td>{voucher.voucherExpiration}</td>
                            <td>{voucher.usedCount}</td>
                            <td>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(voucher._id)}
                                >
                                    Xoá
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button className="arrow" onClick={handlePrevPage} disabled={currentPage === 1}>
                    <IoMdArrowDropleft style={{ marginBottom: "-3px" }} />
                </button>
                <span> {currentPage} </span>
                <button
                    className="arrow"
                    onClick={handleNextPage}
                    disabled={currentPage === Math.ceil(vouchers.length / vouchersPerPage)}
                >
                    <IoMdArrowDropright style={{ marginBottom: "-3px" }} />
                </button>
            </div>

            {/* Adding voucher */}
            <div className="add-voucher-title">
                <h1>Thêm voucher mới</h1>
            </div>
            <div className="add-voucher-form">
                <input
                    type="text"
                    placeholder="Mã voucher"
                    value={newVoucher.voucherCode}
                    onChange={(e) => setNewVoucher({ ...newVoucher, voucherCode: e.target.value })}
                />

                <select
                    value={newVoucher.voucherType}
                    onChange={(e) => setNewVoucher({ ...newVoucher, voucherType: Number(e.target.value) })}
                    required
                    style={{
                        color: newVoucher.voucherType === "" ? "#666" : "#000"
                    }}
                >
                    <option value="" disabled hidden>Loại voucher</option>
                    <option value={1}>Tiền</option>
                    <option value={2}>Phần trăm</option>
                </select>

                <input
                    type="number"
                    placeholder="Giá trị"
                    value={newVoucher.voucherValue}
                    onChange={(e) => setNewVoucher({ ...newVoucher, voucherValue: e.target.value })}
                />

                <input
                    type="number"
                    placeholder="Giảm tối đa (nếu là %)"
                    value={newVoucher.maxDiscountValue}
                    onChange={(e) => setNewVoucher({ ...newVoucher, maxDiscountValue: e.target.value })}
                />

                <input
                    type="number"
                    placeholder="Đơn hàng tối thiểu"
                    value={newVoucher.minOrderValue}
                    onChange={(e) => setNewVoucher({ ...newVoucher, minOrderValue: e.target.value })}
                />

                <input className="date-input"
                    type="date"
                    style={{ color: "#666" }}
                    placeholder="Hạn sử dụng"
                    value={newVoucher.voucherExpiration}
                    onChange={(e) => setNewVoucher({ ...newVoucher, voucherExpiration: e.target.value })}
                />

                <button className="add-btn" onClick={handleAddVoucher}>Thêm voucher</button>
            </div>
        </>
    );
}

export default AdminVoucher;
