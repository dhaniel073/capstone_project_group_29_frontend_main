import { Link } from "react-router";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const handleAdd = async (e) => {
    e.preventDefault();
    try { await addItem(product._id, 1); } catch (err) { alert(err.message); }
  };
  return (
    <Link to={`/products/${product._id}`} className="card" style={{ display: "block", padding: "0.7rem" }}>
      <div style={{ width: "100%", aspectRatio: "1", borderRadius: 8, marginBottom: "0.6rem", background: product.imageUrl ? `url(${product.imageUrl}) center/cover` : "#D6DCC6" }} />
      <p style={{ fontWeight: 700, fontSize: "0.82rem", margin: "0 0 0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</p>
      <p className="text-success" style={{ fontWeight: 700, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>NGN {product.price?.toLocaleString()}</p>
      <button className="btn btn-primary btn-block" onClick={handleAdd} style={{ fontSize: "0.76rem", padding: "0.45rem", minHeight: 38 }}>Add to Cart</button>
    </Link>
  );
}
