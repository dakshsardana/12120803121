import React, { useEffect, useState } from "react";
import UserData from "./components/UserData";
import axios from "axios";
import "./style.css";

const App = () => {
  const [product, setProduct] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [order, setOrder] = useState("asc");
  const [sortOptions, setSortOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsInPage] = useState(10);
  const [category, setCategory] = useState("TV"); // Default category

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/categories/${category}/products`,
        {
          params: {
            n: productsInPage * currentPage,
            sort: sortKey,
            order: order,
            minP: 1,
            maxP: 10000,
          },
        }
      );
    setProduct([response.data]);
      console.log(product);
    } catch (error) {
      console.error("Error fetching :", error.message);
    }
  };

  const sortProd = (key) => {
    if (sortKey === key) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setOrder("asc");
    }
    setSortOptions(false);
    getProducts();
  };

  const sortIcon = (key) => {
    if (sortKey === key) {
      return order === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const indexLast = currentPage * productsInPage;

  const indexFirst = indexLast - productsInPage;

  const currentProducts = product.slice(
    indexFirst,
    indexLast
  );
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    getProducts();
  }, [category, currentPage, sortKey, order]);

  const doPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(product.length / productsInPage); i++) {
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
        {currentPage < Math.ceil(product.length / productsInPage) && (
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
          onClick={() => setSortOptions(!sortOptions)}>
          Sort By
        </button>
        {sortOptions && (
          <div className="sort-options">
            <button onClick={() => sortProd("price")}>
              Price {sortIcon("price")}
            </button>
            <button onClick={() => sortProd("rating")}>
              Rating {sortIcon("rating")}
            </button>
            <button onClick={() => sortProd("discount")}>
              Discount {sortIcon("discount")}
            </button>
          </div>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Discount</th>
          </tr>
        </thead>
        <tbody>
          <UserData
            products={currentProducts}
            sortKey={sortKey}
            order={order}
          />
        </tbody>
      </table>
     {doPagination()}
    </>
  );
};

export default App;
