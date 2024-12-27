import React from "react";
import "./CardStyles.css";

function Card({ brand, name, price, rating,  description ,imgURL}) {
  return (
    <>
    <div className="card-frame">
      <div className="img-details">
        <img className="pimg" src={imgURL} alt={name} />
        <div className="others">
          <h1 className="card-title">{name}</h1>
          <div className="brand-price">
            <h2 className="brand">{brand}</h2>
            <h2 className="price">₹{price}</h2>
          </div>
          <div className="rating">Rating- {rating}/5.0</div>
        </div>
      </div>
      <div className="description">
        <p>Description:</p>
        <p> {description}</p>
      </div>
    </div>
    </>
  );
}

export default Card;
