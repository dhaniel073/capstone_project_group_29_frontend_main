import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { getProductById(id).then((res) => setProduct(res.data)).catch((err) => setError(err.message)); }, [id]);

  const handleAdd = async () => {
    setAdding(true); setError("");
    try { await addItem(id, quantity); navigate("/cart"); } catch (err) { setError(err.message); } finally { setAdding(false); }
  };

  if (!product) return <div><Navbar /><p className={`container page ${error ? "text-danger" : ""}`}>{error || "Loading..."}</p></div>;
  const qtyBtn = { padding: "0.5rem 1rem", background: "var(--color-surface)", minHeight: 44 };

  return (
    <div>
      <Navbar />
      <div className="container page">
        <p className="text-mid" style={{ fontSize: "0.85rem" }}>Home / {product.category?.name || "Category"} / {product.name}</p>
        <div className="split-layout">
          <div className="split-main">
            <div style={{ width: "100%", maxWidth: 460, aspectRatio: "1", borderRadius: 16, background: product.imageUrl ? `url(${product.imageUrl}) center/cover` : "#D6DCC6" }} />
          </div>
          <div className="split-aside">
            <span className="tag tag-accent">{product.category?.name?.toUpperCase() || "PRODUCT"}</span>
            <h1 style={{ margin: "0.6rem 0 0.3rem", fontSize: "1.5rem" }}>{product.name}</h1>
            <p className="text-mid" style={{ fontSize: "0.85rem" }}>SKU: {product.sku}</p>
            <p className="text-success" style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 0.5rem" }}>NGN {product.price?.toLocaleString()}</p>
            <span className={`tag ${product.stock > 0 ? "tag-success" : "tag-danger"}`}>{product.stock > 0 ? `IN STOCK - ${product.stock} units` : "OUT OF STOCK"}</span>
            <p className="text-mid" style={{ margin: "1.2rem 0" }}>{product.description}</p>
            <label className="form-label">Quantity</label>
            <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--color-border)", borderRadius: 999, overflow: "hidden", marginBottom: "1.5rem" }}>
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={qtyBtn}>-</button>
              <span style={{ padding: "0 1rem", fontWeight: 700 }}>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} style={qtyBtn}>+</button>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <Button onClick={handleAdd} loading={adding} disabled={product.stock === 0} className="btn-block">Add to Cart - NGN {(product.price * quantity).toLocaleString()}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
