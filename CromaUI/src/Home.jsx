import React, { useState } from "react";
import "./HomeStyles.css";
import Card from "./Card";

function Home({ data }) 
{
  const [sorteddata, setsorteddata]=useState(data);
  const [searchterm,setsearchterm]=useState("");

  const handleSearch = () => {
    if (searchterm.trim() === "") {
      setsorteddata(data); // Reset to all products
      return;
    }
  
    const terms = searchterm.toLowerCase().split(/\s*,\s*|\s+/); // Split on commas or spaces
    const filtered = data.filter((item) => {
      const fields = `${item.name} ${item.brand} ${item.description}`;
      return terms.every((term) => fields.toLowerCase().includes(term));
    });
  
    setsorteddata(filtered);
  };


  const handlesort=(type)=>
  {
    let sorted=[...sorteddata];

    switch (type) 
    {
      case "lowestprice":
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "catalogeranking":
        sorted = data; // Reset to original order
        break;
      case "toprated":
        sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      case "all":
        setsorteddata(data); // Reset to all products
      default:
        return;
    }
        setsorteddata(sorted);
    };
    const handleFilterChange = (e) => {
          handlesort(e.target.value);
    };
        
  return (
    <>
    <div className="home-container">
      <h1 className="title">CROMA Website LED TV Data Display</h1>
      <div className="Search">
        <input type="text" 
          className="search-box" 
          placeholder="   Search or Jump To.."  
          value={searchterm}
          onChange={(e) => 
          setsearchterm(e.target.value)}/>
        <button className="search-button" onClick={handleSearch}> Search </button>
        <select
          className="filter-dropdown"
          onChange={handleFilterChange}
          defaultValue="">
          <option value="" disabled>
            Filter By
          </option>
          <option value="lowestprice">Lowest Price</option>
          <option value="toprated">Top Rated Products</option>
          <option value="catalogeranking">Catalog Ranking</option>
          <option value="all">None</option>
        </select>
      </div>
      <div className="card-list">
      {sorteddata.length > 0 ? (
        sorteddata.map((item, index) => (
          <Card
            key={index}
            brand={item.brand}
            name={item.name}
            price={item.price}
            rating={item.rating}
            description={item.description}
            imgURL={item.img_URLs}
          />
        ))
      ) : (
        <p style={{ color: "white" ,margin: "70px"}}>No data available, choose a filter or search...</p>

      )}
    </div>
    </div>
    </>
  );
}

export default Home;
