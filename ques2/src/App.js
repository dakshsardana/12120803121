import React, { useEffect, useState } from "react";
import UserData from "./components/UserData";
import axios from "axios";
import "./style.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [category, setCategory] = useState("Laptop"); // Default category

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/categories/${category}/products`,
        {
          params: {
            n: productsPerPage * currentPage,
            sort: sortKey,
            order: sortOrder,
            minPrice: 1,
            maxPrice: 10000,
          },
        }
      );
      setProducts(response.data);
      // console.log(products);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setShowSortOptions(false);
    fetchProducts();
  };

  const sortIcon = (key) => {
    if (sortKey === key) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchProducts();
  }, [category, currentPage, sortKey, sortOrder]);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <ul className="pagination">
        {currentPage > 1 && (
          <li className="page-item">
            <button
              onClick={() => paginate(currentPage - 1)}
              className="page-link">
              Previous
            </button>
          </li>
        )}
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${number === currentPage ? "active" : ""}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
        {currentPage < Math.ceil(products.length / productsPerPage) && (
          <li className="page-item">
            <button
              onClick={() => paginate(currentPage + 1)}
              className="page-link">
              Next
            </button>
          </li>
        )}
      </ul>
    );
  };

  const categoryOptions = [
    "Phone",
    "Computer",
    "TV",
    "Earphone",
    "Tablet",
    "Charger",
    "Mouse",
    "Keypad",
    "Bluetooth",
    "Pendrive",
    "Remote",
    "Speaker",
    "Headset",
    "Laptop",
    "PC",
  ];

  return (
    <>
      <h1>Product Comparison</h1>
      <div className="category-selector">
        <label>Select Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="sort-container">
        <button
          className="sort-button"
          onClick={() => setShowSortOptions(!showSortOptions)}>
          Sort By
        </button>
        {showSortOptions && (
          <div className="sort-options">
            <button onClick={() => handleSort("price")}>
              Price {sortIcon("price")}
            </button>
            <button onClick={() => handleSort("rating")}>
              Rating {sortIcon("rating")}
            </button>
            <button onClick={() => handleSort("discount")}>
              Discount {sortIcon("discount")}
            </button>
          </div>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Discount</th>
          </tr>
        </thead>
        <tbody>
          <UserData
            products={currentProducts}
            sortKey={sortKey}
            sortOrder={sortOrder}
          />
        </tbody>
      </table>
      {/* {renderPagination()} */}
    </>
  );
};

export default App;
