import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProductsList.css";
import CardItem from "../../../components/CardItem";

const ProductsList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/search/top24")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className="top-selling-product">
      <div className="title-componet">
        <h3>DANH SÁCH SẢN PHẨM</h3>
        <Link to="/list" className="viewAll">
          Xem tất cả
        </Link>
      </div>
      <div className="products-container">
        {books.map((book) => (
          <CardItem book={book} key={book._id} />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
