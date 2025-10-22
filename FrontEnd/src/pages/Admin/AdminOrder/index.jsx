import { useState, useEffect } from "react";
import axios from "axios";
import './AdminOrder.css';
import { FaArrowLeft } from "react-icons/fa6";

function AdminOrder() {
    const [dh, setDh] = useState(null);
    const [products, setProducts] = useState([]);
    const [ldh, setLdh] = useState("cxn");
    const [ord, setOrd] = useState(null);
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3001/product")
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const jwt = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/order', {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                if (response.data.status === 'success') {
                    setOrders(response.data.data);
                } else {
                    console.error('Failed to fetch orders:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    const handleViewO = (orderid) => {
        const od = orders.find(o => o._id === orderid)
        setDh(orderid);
        setOrd(od);
        setStatus(od.status);
    }

    useEffect(() => {
        console.log(dh)
    }, [dh]);

    const handleChangeStatus = async (newStatus) => {
        try {
            const jwt = localStorage.getItem('token'); // Lấy token nếu cần
            const response = await axios.put(
                `http://localhost:3001/order/${ord._id}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`, // Gửi token trong header
                    },
                }
            );
            if (response.data.status === 'success') {
                // Cập nhật trạng thái đơn hàng trong state
                setOrders(orders.map(o => o._id === ord._id ? { ...o, status: newStatus } : o));
                setOrd({ ...ord, status: newStatus });
                alert('Cập nhật trạng thái thành công');
            } else {
                alert('Cập nhật trạng thái thất bại');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Đã có lỗi xảy ra khi cập nhật trạng thái.');
        }
    };



    return (
        <>{dh ?
            (<div className="adorxtt">
                <div className="adorttdh">
                    <h1>Thông tin đơn hàng</h1>
                    <button onClick={() => { setDh(null); setOrd(null); }}><FaArrowLeft /></button>
                </div>
                <div className="ps">
                    <p>Mã đơn hàng: {ord._id}</p>
                    <p>Mã khách hàng: {ord.userId}</p>
                    <p>Tổng giá trị đơn hàng: {ord?.total?.toLocaleString("vi-VN")}₫</p>
                    <p>Giảm giá: {ord?.discount.toLocaleString("vi-VN")}₫</p>
                    <p>Phương thức thanh toán: {ord.type}</p>
                    <div style={{ display: "flex" }}>
                        <p>Trạng thái: </p>
                        <div style={{ fontWeight: "bold", marginLeft: "5px" }}>{ord.status}</div>
                    </div>
                    {status === "pending" &&
                        <div className="cnbton">
                            <button onClick={() => handleChangeStatus("Đang chờ vận chuyển")}>Xác nhận</button>
                            <button onClick={() => handleChangeStatus("Đơn hủy")}>Hủy đơn</button>
                        </div>}
                    {status === "Đang chờ vận chuyển" &&
                        <div className="cnbton">
                            <button onClick={() => handleChangeStatus("Đang vận chuyển")}>Cập nhật</button>
                        </div>}
                    {status === "Đang vận chuyển" &&
                        <div className="cnbton">
                            <button onClick={() => handleChangeStatus("Hoàn tất")}>Cập nhật</button>
                            <button onClick={() => handleChangeStatus("Đơn hoàn")}>Đơn hoàn</button>
                        </div>}
                    <p>Ngày đặt: {ord.createdAt}</p><br />
                </div>
                <h2>Thông tin người đặt</h2>
                <div className="adorttnn">
                    <p>Họ và tên: {ord.name}</p>
                    <p>Số điện thoại: {ord.phone}</p>
                    <p>Email: {ord.email}</p>
                    <p>Địa chỉ: {ord.address}</p>
                </div>
                <h2>Thông tin sản phẩm</h2>
                <div>
                    {ord.products.map((sp, index) => {
                        const p = products.find(p => p._id === sp.productId);
                        return (
                            <div className="cardgh" key={index}>
                                <img src={p.imgSrc} />
                                <div className="cardghh-text">
                                    <p style={{ "height": "70px" }}>{p.title}</p>
                                    <p>Số lượng: {sp.quantity}</p>
                                    <p>Giá: {p?.price?.toLocaleString("vi-VN")}₫</p>
                                    <div className="cardghprice">
                                        <div className="cargh-pr">Tổng: </div>
                                        <div className="cardgh-price">{(p.price * sp.quantity).toLocaleString("vi-VN")}₫</div>
                                    </div>
                                </div>
                            </div>)
                    })}
                </div>
            </div>)
            :
            (<>
                <div className="adorderbut">
                    <button className="dhbutton" onClick={() => setLdh("cxn")}>Chờ xác nhận</button>
                    <button className="dhbutton" onClick={() => setLdh("cvc")}>Chờ vận chuyển</button>
                    <button className="dhbutton" onClick={() => setLdh("dvc")}>Đang vận chuyển</button>
                    <button className="dhbutton" onClick={() => setLdh("ht")}>Hoàn tất</button>
                    <button className="dhbutton" onClick={() => setLdh("dh")}>Đơn hoàn</button>
                    <button className="dhbutton" onClick={() => setLdh("dhh")}>Đơn hủy</button>
                </div>
                <h1 style={{ textAlign: "center" }}>Danh sách đơn hàng</h1>
                {ldh === "cxn" &&
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn</th>
                                <th>Họ và tên</th>
                                <th>SĐT</th>
                                <th>Tổng đơn</th>
                                <th>Phương thức thanh toán</th>
                                <th>Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.filter(od => od.status === "pending").map((o, index) =>
                                <tr key={index}>
                                    <td className="stt">{index + 1}</td>
                                    <td className="adormadh" onClick={() => handleViewO(o._id)}>{o._id}</td>
                                    <td>{o.name}</td>
                                    <td className="stt">{o.phone}</td>
                                    <td>{o?.total?.toLocaleString("vi-VN")}₫</td>
                                    <td className="stt" style={{ width: "120px" }}>{o.type}</td>
                                    <td>{o.createdAt}</td>
                                </tr>)}
                        </tbody>
                    </table>}

                {ldh === "cvc" &&
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn</th>
                                <th>Họ và tên</th>
                                <th>SĐT</th>
                                <th>Tổng đơn</th>
                                <th>Phương thức thanh toán</th>
                                <th>Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.filter(od => od.status === "Đang chờ vận chuyển").map((o, index) =>
                                <tr key={index}>
                                    <td className="stt">{index + 1}</td>
                                    <td className="adormadh" onClick={() => handleViewO(o._id)}>{o._id}</td>
                                    <td>{o.name}</td>
                                    <td className="stt">{o.phone}</td>
                                    <td>{o?.total?.toLocaleString("vi-VN")}₫</td>
                                    <td className="stt" style={{ width: "120px" }}>{o.type}</td>
                                    <td>{o.createdAt}</td>
                                </tr>)}
                        </tbody>
                    </table>}

                {ldh === "dvc" &&
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn</th>
                                <th>Họ và tên</th>
                                <th>SĐT</th>
                                <th>Tổng đơn</th>
                                <th>Phương thức thanh toán</th>
                                <th>Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.filter(od => od.status === "Đang vận chuyển").map((o, index) =>
                                <tr key={index}>
                                    <td className="stt">{index + 1}</td>
                                    <td className="adormadh" onClick={() => handleViewO(o._id)}>{o._id}</td>
                                    <td>{o.name}</td>
                                    <td className="stt">{o.phone}</td>
                                    <td>{o?.total?.toLocaleString("vi-VN")}₫</td>
                                    <td className="stt" style={{ width: "120px" }}>{o.type}</td>
                                    <td>{o.createdAt}</td>
                                </tr>)}
                        </tbody>
                    </table>}

                {ldh === "ht" &&
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn</th>
                                <th>Họ và tên</th>
                                <th>SĐT</th>
                                <th>Tổng đơn</th>
                                <th>Phương thức thanh toán</th>
                                <th>Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.filter(od => od.status === "Hoàn tất").map((o, index) =>
                                <tr key={index}>
                                    <td className="stt">{index + 1}</td>
                                    <td className="adormadh" onClick={() => handleViewO(o._id)}>{o._id}</td>
                                    <td>{o.name}</td>
                                    <td className="stt">{o.phone}</td>
                                    <td>{o?.total?.toLocaleString("vi-VN")}₫</td>
                                    <td className="stt" style={{ width: "120px" }}>{o.type}</td>
                                    <td>{o.createdAt}</td>
                                </tr>)}
                        </tbody>
                    </table>}

                {ldh === "dh" &&
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn</th>
                                <th>Họ và tên</th>
                                <th>SĐT</th>
                                <th>Tổng đơn</th>
                                <th>Phương thức thanh toán</th>
                                <th>Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.filter(od => od.status === "Đơn hoàn").map((o, index) =>
                                <tr key={index}>
                                    <td className="stt">{index + 1}</td>
                                    <td className="adormadh" onClick={() => handleViewO(o._id)}>{o._id}</td>
                                    <td>{o.name}</td>
                                    <td className="stt">{o.phone}</td>
                                    <td>{o?.total?.toLocaleString("vi-VN")}</td>
                                    <td className="stt" style={{ width: "120px" }}>{o.type}</td>
                                    <td>{o.createdAt}</td>
                                </tr>)}
                        </tbody>
                    </table>}

                {ldh === "dhh" &&
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn</th>
                                <th>Họ và tên</th>
                                <th>SĐT</th>
                                <th>Tổng đơn</th>
                                <th>Phương thức thanh toán</th>
                                <th>Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.filter(od => od.status === "Đơn hủy").map((o, index) =>
                                <tr key={index}>
                                    <td className="stt">{index + 1}</td>
                                    <td className="adormadh" onClick={() => handleViewO(o._id)}>{o._id}</td>
                                    <td>{o.name}</td>
                                    <td className="stt">{o.phone}</td>
                                    <td>{o?.total?.toLocaleString("vi-VN")}</td>
                                    <td className="stt" style={{ width: "120px" }}>{o.type}</td>
                                    <td>{o.createdAt}</td>
                                </tr>)}
                        </tbody>
                    </table>}
            </>)
        }</>
    )
}

export default AdminOrder