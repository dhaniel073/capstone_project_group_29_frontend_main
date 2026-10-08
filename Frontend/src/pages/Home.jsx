import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { getProducts, getProductsByCategory } from "../services/productService";
import { getCategories } from "../services/categoryService";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null); // category _id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => { });
  }, []);

  // Wait until the user stops typing before calling the API
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setProducts([]); // never show the previous category while loading

    const params = { page: 1, limit: 10 };
    if (debouncedSearch) params.search = debouncedSearch;

    const request = activeCategory
      ? getProductsByCategory(activeCategory, params)
      : getProducts(params);

    request
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res.data) ? res.data : [];
        const onlyThisCategory = activeCategory
          ? list.filter((p) => String(p.category?._id || p.category) === String(activeCategory))
          : list;
        setProducts(onlyThisCategory);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, activeCategory]);

  // Footer sends a category name; look up its id
  const handleFooterCategory = (name) => {
    const match = categories.find((c) => c.name === name);
    if (match) setActiveCategory(match._id);
  };

  return (
    <div>
      <Navbar searchQuery={search} onSearchChange={setSearch} />
      <div className="container page">
        <div className="hero">
          <span className="hero-pill">Daily Essentials</span>
          <h1 className="hero-title">Fresh groceries, delivered to your door.</h1>
          <p className="hero-text">Get 10% off your first order -- use code WELCOME10</p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <button
            className={`btn chip ${!activeCategory ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              className={`btn chip ${activeCategory === c._id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveCategory(c._id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        <h2 style={{ fontSize: "1.1rem" }}>Popular Products</h2>
        {loading ? (
          <p className="text-mid">Loading products...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-mid">No products found.</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      <Footer categories={categories} onCategorySelect={handleFooterCategory} />
    </div>
  );
}