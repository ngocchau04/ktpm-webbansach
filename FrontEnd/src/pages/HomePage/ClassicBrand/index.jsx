import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const ClassicBrand = () => {
  const [classicBrand, setClassicBrand] = useState([]);
  const navigate = useNavigate(); // Hook để điều hướng

  useEffect(() => {
    const fetchClassicBrand = async () => {
      try {
        const response = await axios.get("http://localhost:3001/search/topAuthors");
        setClassicBrand(response.data);
      } catch (error) {
        console.error("Error fetching classic brand:", error);
      }
    };
    fetchClassicBrand();
  }, []);

  const formatBook = (book) => {
    if (book.length > 50) {
      return book.slice(0, 50) + "...";
    }
    return book;
  };

  const showBooks = (books) => {
    return books.map((book, index) => (
      <p key={index}>{index + 1}: {formatBook(book)}</p>
    ));
  };

  // Hàm xử lý khi nhấp vào một phần tử
  const handleClick = (author) => {
    navigate(`/list?author=${author}`); // Chuyển hướng đến trang chi tiết tác giả
  };

  return (
    <div className="classic-brand">
      <h3>CÁC TÁC GIẢ NỔI BẬT</h3>
      <div className="clabra-container">
        {classicBrand.map((brand, index) => (
          <div
            className="clabra-item"
            key={index}
            onClick={() => handleClick(brand._id)} // Gắn sự kiện onClick
          >
            <h2>{brand._id}</h2>
            <div>{showBooks(brand.books)}</div>
          </div>
        ))}
      </div>
      <div className="clabra-more">
        <Link to="/list" className="viewAll">Xem tất cả</Link>
      </div>
    </div>
  );
};

export default ClassicBrand;
