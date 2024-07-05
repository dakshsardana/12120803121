import React from "react";

const UserData = ({ products, sortKey, sortOrder }) => {
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortKey] > b[sortKey] ? 1 : -1;
    } else {
      return a[sortKey] < b[sortKey] ? 1 : -1;
    }
  });

  return (
    <>
      {sortedProducts.map((product) => {
        const { id, productName, price, rating, discount } = product;

        return (
          <tr key={id}>
            <td>{productName}</td>
            <td>${price}</td>
            <td>{rating}</td>
            <td>{discount}%</td>
          </tr>
        );
      })}
    </>
  );
};

export default UserData;
