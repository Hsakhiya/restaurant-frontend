import React, { useState, useEffect } from "react";
import API from "../api";
import Button from "../components/Button";
import MenuItemCard from "../components/MenuItemCard";
import "../styles/menu.css";
import { FaShoppingCart, FaFileInvoice } from "react-icons/fa";

function Menu() {
  const [order, setOrder] = useState({});
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const tableNumber = localStorage.getItem("tableNumber");

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await API.get("/menu/available");
        setMenu(response.data);

        const uniqueCategories = [
          "All",
          ...new Set(response.data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        alert("Failed to fetch menu");
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const handleAdd = (itemName) => {
    const updated = {
      ...order,
      [itemName]: (order[itemName] || 0) + 1,
    };
    setOrder(updated);
    localStorage.setItem("order", JSON.stringify(updated));

    // Show success message when an item is added to the cart
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000); // Hide the message after 2 seconds
  };

  // Calculate the total number of items in the cart
  const totalItemsInCart = Object.values(order).reduce(
    (acc, quantity) => acc + quantity,
    0
  );

  const filteredMenu =
    selectedCategory === "All"
      ? menu
      : menu.filter((item) => item.category === selectedCategory);

  return (
    <div className="menu-background">
      <h2 className="menu-title">Menu</h2>

      {/* Category Section */}
      <div className="category-section">
        <div className="category-list">
          {categories.map((category) => (
            <div
              key={category}
              className="category-item"
              onClick={() => setSelectedCategory(category)}
              style={{
                backgroundColor: selectedCategory === category ? "#ffb703" : "",
                color: selectedCategory === category ? "#000" : "",
              }}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      {/* Success Message when item is added to cart */}
      {showMessage && (
        <div className="success-message">Item added to cart!</div>
      )}

      {/* Menu Items Section */}
      <div className="menu-container">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          filteredMenu.map((item) => (
            <MenuItemCard key={item.name} item={item} onAdd={handleAdd} />
          ))
        )}
      </div>

      {/* Floating Cart Button with item count */}
      <button
        className="floating-cart-button"
        onClick={() => (window.location.href = "/cart")}
      >
        <FaShoppingCart />
        {totalItemsInCart > 0 && (
          <span className="cart-item-count">{totalItemsInCart}</span>
        )}
      </button>

      {/* Floating Bill Button */}
      <button
        className="floating-bill-button"
        onClick={() => (window.location.href = "/bill")}
      >
        <FaFileInvoice />
      </button>
    </div>
  );
}

export default Menu;