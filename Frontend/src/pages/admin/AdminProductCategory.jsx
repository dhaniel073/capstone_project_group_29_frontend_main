import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Button from "../../components/Button";
import Input from "../../components/Input";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

const emptyForm = { name: "", description: "" };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = creating, id = editing
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = () =>
    getCategories()
      .then((res) => {
        setCategories(Array.isArray(res.data) ? res.data : []);
        setListError("");
      })
      .catch((err) => setListError(err.message || "Unable to load categories."))
      .finally(() => setLoading(false));

  useEffect(() => {
    loadCategories();
  }, []);

  const openModal = (category = null) => {
    setEditingId(category?._id || null);
    setForm(
      category
        ? { name: category.name || "", description: category.description || "" }
        : emptyForm
    );
    setError("");
    setShowModal(true);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
      };
      if (editingId) await updateCategory(editingId, payload);
      else await createCategory(payload);
      setShowModal(false);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"? Products in this category may be affected.`)) return;
    try {
      await deleteCategory(category._id);
      loadCategories();
    } catch (err) {
      setListError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <div className="row" style={{ alignItems: "center", marginBottom: "1.3rem", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: "0 0 0.2rem", fontSize: "1.4rem" }}>Categories</h1>
            <p className="text-mid" style={{ margin: 0 }}>Organise your product catalog</p>
          </div>
          <Button onClick={() => openModal()}>+ Add Category</Button>
        </div>

        {listError && <p className="text-danger" role="alert">{listError}</p>}

        <div className="card table-scroll">
          <table>
            <thead>
              <tr><th>Name</th><th>Slug</th><th>Description</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-mid">Loading categories...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={4} className="text-mid">No categories yet.</td></tr>
              ) : (
                categories.map((c) => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ fontFamily: "monospace", fontSize: "0.76rem" }}>{c.slug}</td>
                    <td className="text-mid">{c.description || "—"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        className="btn-link"
                        style={{ color: "var(--color-primary-dark)", marginRight: "0.9rem" }}
                        onClick={() => openModal(c)}
                      >
                        Edit
                      </button>
                      <button className="btn-link text-danger" onClick={() => handleDelete(c)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-backdrop">
            <form onSubmit={handleSave} className="card modal">
              <div className="row" style={{ marginBottom: "1rem" }}>
                <h3 style={{ margin: 0 }}>{editingId ? "Edit Category" : "Add New Category"}</h3>
                <button
                  type="button"
                  className="btn-link"
                  style={{ fontSize: "1.3rem" }}
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>
              {error && <p className="text-danger" role="alert">{error}</p>}
              <Input label="Category name" value={form.name} onChange={set("name")} required maxLength={60} />
              <Input label="Description (optional)" value={form.description} onChange={set("description")} maxLength={200} />
              <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem" }}>
                <Button type="button" variant="secondary" className="btn-block" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-block" loading={saving}>
                  {editingId ? "Update Category" : "Save Category"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}