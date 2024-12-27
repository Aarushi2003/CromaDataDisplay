import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Home from "./Home";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Parse the CSV file
    Papa.parse("/directoryreact.csv", {
      download: true,
      header: true, // Treat the first row as headers
      complete: (result) => {
        console.log("Parsed Data:",result.data); // Debugging
        setData(result.data); // Set the parsed data
      },
      error: (err) => {
        console.error("Error parsing CSV:", err);
      },
    });
  }, []);

  return (
    <>
      <Home data={data} />
    </>
  );
}

export default App;
