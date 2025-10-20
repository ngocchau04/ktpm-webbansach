import axios from "axios";
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './AdminRevenue.css';

function AdminRevenue() {
    const [products, setProducts] = useState([]);
    const [products_sold, setProducts_sold] = useState(products.sort((a, b) => b.soldCount - a.soldCount).slice(0, 5));
    const [products_revenue, setProducts_revenue] = useState(products.sort((a, b) =>
        (b.soldCount * b.originalPrice) - (a.soldCount * a.originalPrice)).slice(0, 5));
    const [revenue, setRevenue] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [averageIncome, setAverageIncome] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        fetch("http://localhost:3001/product")
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/revenue')
            .then((response) => {
                setRevenue(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
        axios.get('http://localhost:3001/api/users/number')
            .then((response) => {
                setTotalUsers(response.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const [options, setOptions] = useState({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Doanh thu theo tháng'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Doanh thu (VND)'
            }
        },
        series: []
    });

    useEffect(() => {
        let data = [];
        revenue.forEach((item) => {
            data.push({
                name: item.year,
                data: item.revenue
            });
        });
        console.log(data);
        setOptions({ ...options, series: data })
    }, [revenue]);

    useEffect(() => {
        let total = 0;
        let count = 0;
        revenue.forEach((item) => {
            item.revenue.forEach((month) => {
                total += month;
                if (month > 0) count++;
            });
        });
        setTotalIncome(total);
        setAverageIncome(Math.floor(total / count));
    }, [revenue]);

    useEffect(() => {
        setProducts_sold(products.sort((a, b) => b.soldCount - a.soldCount).slice(0, 5));
        setProducts_revenue(products.sort((a, b) =>
            (b.soldCount * b.originalPrice) - (a.soldCount * a.originalPrice)).slice(0, 5));
    }, [products]);

    return (
        <>
            <HighchartsReact highcharts={Highcharts} options={options} />
            <div>
                <p>Tổng doanh thu: {totalIncome.toLocaleString("vi-VN")}₫</p>
                <p>Doanh thu trung bình mỗi tháng: {averageIncome.toLocaleString("vi-VN")}₫</p>
                <p>Số lượng khách hàng: {totalUsers - 1}</p><br />
            </div>
            <div>
                <h2>Top 5 sản phẩm bán chạy nhất</h2><br />
                <div style={{ display: "flex" }}>
                    {products_sold.map((product, index) => (
                        <div key={index} className="cardspp">
                            <img className="cardspp-image" src={product.imgSrc} />
                            <p className="cardspp-title">{product.title}</p>
                            <p className="cardspp-price">Giá: {product.price.toLocaleString("vi-VN")}₫</p>
                            <p className="cardspp-price" style={{ display: "flex" }}>
                                <div>Đã bán: </div>
                                <div style={{ color: "red" }}>{product.soldCount}</div>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div><br />
                <h2>Top 5 sản phẩm có doanh thu cao nhất</h2><br />
                <div style={{ display: "flex" }}>
                    {products_revenue.map((product, index) => (
                        <div key={index} className="cardspp">
                            <img className="cardspp-image" src={product.imgSrc} />
                            <p className="cardspp-title">{product.title}</p>
                            <p className="cardspp-price">Giá: {product.price.toLocaleString("vi-VN")}₫</p>
                            <p className="cardspp-price">Doanh thu:
                                <div style={{ color: "red" }}>{(product.soldCount * product.price).toLocaleString("vi-VN")}₫</div>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default AdminRevenue