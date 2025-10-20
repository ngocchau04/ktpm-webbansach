import React, { useEffect } from 'react';
import QrCode from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './styles.css';

function PaymentPage() {

    const navigate = useNavigate();
    const { user } = useUser();
    const location = useLocation();
    const total = location.state?.total || 0;

    useEffect(() => {
        if (!location.state) {
            navigate('/order'); // Redirect to cart if no state is found
        }
    }, [location, navigate]);

    

    const handleCompletePayment = async (e) => {
        e.preventDefault();
        alert('Bạn đã đặt hàng thành công!');
        navigate('/');
    };

    return (
        <div>
            <Header />
        <div className='paymentpage'>
            <h1>Thanh Toán</h1>
           
            <button onClick={handleCompletePayment}>Hoàn tất</button>
        </div>
            <Footer />
        </div>
    );
}

export default PaymentPage;
