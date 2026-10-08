import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

const emptyForm = { name: "", description: "", sku: "", price: "", stock: "", category: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = creating, id = editing
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = () => getProducts({ page: 1, limit: 50 }).then((res) => setProducts(res.data)).catch(() => {});

  useEffect(() => {
    loadProducts();
    getCategories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const openModal = (product = null) => {
    setEditingId(product?._id || null);
    setForm(product ? {
      name: product.name || "", description: product.description || "", sku: product.sku || "",
      price: product.price ?? "", stock: product.stock ?? "",
      category: product.category?._id || product.category || "",
    } : emptyForm);
    setImageFile(null); setError(""); setShowModal(true);
  };
  const openEditModal = (product) => openModal(product);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile); // omitted on edit = keep existing image
      if (editingId) await updateProduct(editingId, fd);
      else await createProduct(fd);
      setShowModal(false);
      loadProducts();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try { await deleteProduct(id); loadProducts(); } catch (err) { alert(err.message); }
  };

  const statusTag = (stock) => stock === 0 ? ["tag-danger", "Out of Stock"] : stock < 20 ? ["tag-warning", "Low Stock"] : ["tag-success", "Active"];

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <div className="row" style={{ alignItems: "center", marginBottom: "1.3rem", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: "0 0 0.2rem", fontSize: "1.4rem" }}>Products</h1>
            <p className="text-mid" style={{ margin: 0 }}>Manage your product catalog</p>
          </div>
          <Button onClick={() => openModal()}>+ Add Product</Button>
        </div>

        <div className="card table-scroll">
          <table>
            <thead><tr><th>Product</th><th>SKU</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map((p) => {
                const [cls, label] = statusTag(p.stock);
                return (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 6, background: p.imageUrl ? `url(${p.imageUrl}) center/cover` : "#D6DCC6" }} />
                        {p.name}
                      </div>
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: "0.76rem" }}>{p.sku}</td>
                    <td>NGN {p.price?.toLocaleString()}</td>
                    <td>{p.stock}</td>
                    <td><span className={`tag ${cls}`}>{label}</span></td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button className="btn-link" style={{ color: "var(--color-primary-dark)", marginRight: "0.9rem" }} onClick={() => openEditModal(p)}>Edit</button>
                      <button className="btn-link text-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-backdrop">
            <form onSubmit={handleSave} className="card modal">
              <div className="row" style={{ marginBottom: "1rem" }}>
                <h3 style={{ margin: 0 }}>{editingId ? "Edit Product" : "Add New Product"}</h3>
                <button type="button" className="btn-link" style={{ fontSize: "1.3rem" }} onClick={() => setShowModal(false)}>&times;</button>
              </div>
              {error && <p className="text-danger">{error}</p>}
              <div className="form-group">
                <label className="form-label">Product Image {editingId && <span className="text-light">(leave blank to keep current)</span>}</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              </div>
              <Input label="Product name" value={form.name} onChange={set("name")} required />
              <Input label="Description" value={form.description} onChange={set("description")} />
              <div className="field-row">
                <Input label="SKU" value={form.sku} onChange={set("sku")} required />
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select value={form.category} onChange={set("category")} required>
                    <option value="">Select...</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="field-row">
                <Input label="Price (NGN)" type="number" min="0" value={form.price} onChange={set("price")} required />
                <Input label="Stock quantity" type="number" min="0" value={form.stock} onChange={set("stock")} required />
              </div>
              <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem" }}>
                <Button type="button" variant="secondary" className="btn-block" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="btn-block" loading={saving}>{editingId ? "Update Product" : "Save Product"}</Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
