import React, { useState } from "react";

const ChartFilterBox = ({ data, onClick }) => {
  const [filterValue, setFilterValue] = useState("Revenue Receipts");
  return (
    <ul style={{ border: "1px solid #d6d6d6", width: "25em" }}>
      {data.map((item) => {
        return (
          <li
            style={{
              padding: "0.5em",
              cursor: "pointer",
              fontWeight: filterValue === item.name && "bold",
            }}
            onClick={() => {
              setFilterValue(item.name);
              onClick(item.name);
            }}
          >
            {item.name}
          </li>
        );
      })}
    </ul>
  );
};

export default ChartFilterBox;
