import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookDetail from "./pages/BookDetail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyAccount from "./pages/VerifyAccount";
import ListProduct from "./pages/ListProduct";
import Order from "./pages/Order";
import VoucherPage from "./pages/VoucherPage";
import Admin from "./pages/Admin";
import { useEffect } from "react";
import axios from "axios";
import { useUser } from "./context/UserContext";
import PaymentPage from "./pages/Order/PaymentPage";

function App() {
  const { user,setUser } = useUser();

  useEffect(() => {
    const refreshToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.post("http://localhost:3001/refresh-token", { token });
          localStorage.setItem("token", res.data.token);
          setUser(res.data.user);
        } catch (error) {
          localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          console.error("Error refreshing token:", error);
        }
      }
      else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    };
    refreshToken();
  }, []);

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<HomePage />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyAccount />} />
          <Route path="/list" element={<ListProduct />} />
          <Route path="/order" element={<Order />} />
          <Route path="/forgot-password" element={<VerifyAccount isresetpass={true} />} />
          <Route path="/voucher" element={<VoucherPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          {
            user && user.role === "admin" ? <Route path="/admin" element={<Admin />} /> : null
          }
        </Routes>
      </BrowserRouter>
  );
}

export default App;
