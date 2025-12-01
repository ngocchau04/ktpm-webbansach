import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Cart.css";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [cartItems, setCartItems] = useState([]);
  const [checkeds, setCheckeds] = useState([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [discount, setDiscount] = useState(0);

  // Helper: luôn trả về danh sách item hợp lệ, tránh null
  const getValidItems = (items) =>
    Array.isArray(items)
      ? items.filter(
          (item) => item && item.product && item.product._id
        )
      : [];

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const jwt = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3001/cart", {
          headers: { Authorization: `Bearer ${jwt}` },
        });

        const rawCart = res.data?.cart;

        // Lọc bỏ phần tử null / product null
        const cleaned = Array.isArray(rawCart)
          ? rawCart.filter((item) => item && item.product)
          : [];

        setCartItems(cleaned);

        // 👉 Đồng bộ lại context user để icon giỏ hàng không “ảo”
        setUser((prev) => ({
          ...prev,
          cart: cleaned.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
        }));
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, [setUser]);


  const handleCheck = (e) => {
    const { name, checked } = e.target;
    const items = getValidItems(cartItems);
    const item = items.find((it) => it.product._id === name);
    if (!item) return;

    const itemTotal = item.product.price * item.quantity;
    const itemDiscount =
      (item.product.discount * item.product.price * item.quantity) / 100;

    if (checked) {
      setCheckeds([...checkeds, name]);
      setTotal(total + itemTotal);
      setDiscount(discount + itemDiscount);
      setCount(count + 1);
    } else {
      setCheckeds(checkeds.filter((id) => id !== name));
      setTotal(total - itemTotal);
      setDiscount(discount - itemDiscount);
      setCount(Math.max(0, count - 1));
    }
  };

  const handleDelete = async (id) => {
    try {
      const jwt = localStorage.getItem("token");
      if (
        !window.confirm(
          "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
        )
      ) {
        return;
      }
      await axios.delete("http://localhost:3001/cart", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          productId: id,
        },
      });

      const newCartItems = getValidItems(cartItems).filter(
        (item) => item.product._id !== id
      );
      setCartItems(newCartItems);

      setUser((prevUsers) => ({
        ...prevUsers,
        cart: prevUsers?.cart
          ? prevUsers.cart.filter((item) => item.product !== id)
          : [],
      }));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const handleDecreaseQuantity = async (id) => {
    try {
      const jwt = localStorage.getItem("token");
      const items = getValidItems(cartItems);
      const item = items.find((it) => it.product._id === id);
      if (!item) return;
      if (item.quantity === 1) return;

      const quantity = item.quantity - 1;
      await axios.post(
        "http://localhost:3001/cart",
        {
          productId: id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const newCartItems = [...items];
      const index = newCartItems.findIndex(
        (it) => it.product._id === id
      );
      if (index !== -1) {
        newCartItems[index].quantity = quantity;
        setCartItems(newCartItems);
      }
    } catch (error) {
      console.error("Lỗi khi giảm số lượng sản phẩm:", error);
    }
  };

  const handleIncreaseQuantity = async (id) => {
    try {
      const jwt = localStorage.getItem("token");
      const items = getValidItems(cartItems);
      const item = items.find((it) => it.product._id === id);
      if (!item) return;

      const quantity = item.quantity + 1;
      await axios.post(
        "http://localhost:3001/cart",
        {
          productId: id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const newCartItems = [...items];
      const index = newCartItems.findIndex(
        (it) => it.product._id === id
      );
      if (index !== -1) {
        newCartItems[index].quantity = quantity;
        setCartItems(newCartItems);
      }
    } catch (error) {
      console.error("Lỗi khi tăng số lượng sản phẩm:", error);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

    const handleCheckout = async () => {
      const listCheckeds = cartItems.filter(item =>
          checkeds.includes(item.product._id)
      );

      // Nếu chưa chọn sản phẩm nào thì thôi
      if (listCheckeds.length === 0) return;

      // ❌ BỎ TOÀN BỘ ĐOẠN DELETE /cart/list + setCartItems + setUser.cart
      // => KHÔNG xoá giỏ hàng ở bước này nữa

      // Chỉ tạo order tạm thời từ các sản phẩm đã chọn
      const order = {
          products: listCheckeds.map(item => ({
              id: item.product._id,
              quantity: item.quantity
          }))
      };

      // Lưu order tạm vào context để trang /order dùng
      setUser(prevUsers => ({
          ...prevUsers,
          order
      }));

      // Điều hướng sang trang đặt hàng
      navigate('/order');
    };

  const handleCheckAll = () => {
    const items = getValidItems(cartItems);
    const ids = items.map((item) => item.product._id);

    const totalPrice = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const totalDiscount = items.reduce(
      (sum, item) =>
        sum +
        (item.product.discount *
          item.product.price *
          item.quantity) /
          100,
      0
    );

    setCheckeds(ids);
    setTotal(totalPrice);
    setDiscount(totalDiscount);
    setCount(items.length);
  };

  const handleUncheckAll = () => {
    setCheckeds([]);
    setTotal(0);
    setDiscount(0);
    setCount(0);
  };

  const validItems = getValidItems(cartItems);

  return (
    <div className="cart-container">
      <h2>Giỏ hàng của bạn</h2>
      <div className="cart-items">
        {validItems.map((item) => (
          <div key={item._id} className="cart-item">
            <input
              type="checkbox"
              name={item.product._id}
              checked={checkeds.includes(item.product._id)}
              onChange={handleCheck}
            />
            <img
              src={item.product.imgSrc}
              alt={item.product.title}
              className="cart-item-image"
            />
            <div className="cart-item-info">
              <h3 className="cart-item-title">
                {item.product.title}
              </h3>
              <p>Giá: {formatPrice(item.product.price)}</p>
              <p>Giảm giá: {item.product.discount}%</p>
              <h4>Số lượng: {item.quantity}</h4>
              <p>
                Thành tiền:{" "}
                {formatPrice(
                  item.product.price * item.quantity
                )}
              </p>
            </div>
            <div className="cart-item-actions">
              <button
                onClick={() =>
                  handleDecreaseQuantity(item.product._id)
                }
              >
                -
              </button>
              <button
                onClick={() =>
                  handleIncreaseQuantity(item.product._id)
                }
              >
                +
              </button>
              <button
                onClick={() => handleDelete(item.product._id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button
          className="buttonCheckAll"
          onClick={handleCheckAll}
        >
          Chọn tất cả
        </button>
        <button
          className="buttonCheckAll"
          onClick={handleUncheckAll}
        >
          Bỏ chọn tất cả
        </button>
      </div>

      <div className="cart-summary">
        <p>Số lượng sản phẩm đã chọn: {count}</p>
        <p>Giảm giá: {formatPrice(discount)}</p>
        <p>Tổng tiền: {formatPrice(total)}</p>
        <button
          className="checkout-button"
          onClick={handleCheckout}
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
}

export default Cart;
