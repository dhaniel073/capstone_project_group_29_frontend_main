import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Button from "../../components/Button";
import Input from "../../components/Input";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import { getCategories } from "../../services/categoryService";

const emptyForm = {
  name: "",
  description: "",
  sku: "",
  price: "",
  stock: "",
  category: "",
};

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [listError, setListError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    setLoadingProducts(true);
    setListError("");

    try {
      const res = await getProducts({ page: 1, limit: 50 });

      const productList = Array.isArray(res.data)
        ? res.data
        : res.data?.products;

      if (!Array.isArray(productList)) {
        console.error("Unexpected product response:", res);

        throw new Error(
          "Unable to display products: unexpected response format."
        );
      }

      setProducts(productList);
    } catch (err) {
      console.error("Failed to load products:", err);

      setListError(
        getErrorMessage(err, "Unable to load products.")
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadCategories = async () => {
    setCategoryError("");

    try {
      const res = await getCategories();

      const categoryList = Array.isArray(res.data)
        ? res.data
        : res.data?.categories;

      if (!Array.isArray(categoryList)) {
        console.error("Unexpected category response:", res);

        throw new Error(
          "Unable to display categories: unexpected response format."
        );
      }

      setCategories(categoryList);
    } catch (err) {
      console.error("Failed to load categories:", err);

      setCategoryError(
        getErrorMessage(err, "Unable to load categories.")
      );
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const openModal = (product = null) => {
    setEditingId(product?._id || null);

    setForm(
      product
        ? {
          name: product.name || "",
          description: product.description || "",
          sku: product.sku || "",
          price: product.price ?? "",
          stock: product.stock ?? "",
          category:
            typeof product.category === "string"
              ? product.category
              : product.category?._id || "",
        }
        : { ...emptyForm }
    );

    setImageFile(null);
    setError("");
    setShowModal(true);
  };

  const set = (key) => (e) => {
    const value = e.target.value;

    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });

      // Omit the image when editing to keep the existing image.
      if (imageFile) {
        fd.append("image", imageFile);
      }

      if (editingId) {
        await updateProduct(editingId, fd);
      } else {
        await createProduct(fd);
      }

      setShowModal(false);
      await loadProducts();
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to save product.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this product? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setListError(
        getErrorMessage(err, "Unable to delete product.")
      );
    }
  };

  const statusTag = (stock) =>
    stock === 0
      ? ["tag-danger", "Out of Stock"]
      : stock < 20
        ? ["tag-warning", "Low Stock"]
        : ["tag-success", "Active"];

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <main className="admin-main">
        <div
          className="row"
          style={{
            alignItems: "center",
            marginBottom: "1.3rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 0.2rem",
                fontSize: "1.4rem",
              }}
            >
              Products
            </h1>

            <p className="text-mid" style={{ margin: 0 }}>
              Manage your product catalog
            </p>
          </div>

          <Button onClick={() => openModal()}>
            + Add Product
          </Button>
        </div>

        {listError && (
          <p className="text-danger" role="alert">
            {listError}
          </p>
        )}

        {categoryError && !showModal && (
          <p className="text-danger" role="alert">
            {categoryError}
          </p>
        )}

        <div className="card table-scroll">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loadingProducts ? (
                <tr>
                  <td colSpan={6} className="text-mid">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-mid">
                    {listError
                      ? "Products could not be loaded."
                      : "No products yet."}
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const [cls, label] = statusTag(p.stock);

                  return (
                    <tr key={p._id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              flexShrink: 0,
                              borderRadius: 6,
                              background: p.imageUrl
                                ? `url(${p.imageUrl}) center/cover`
                                : "#D6DCC6",
                            }}
                          />

                          {p.name}
                        </div>
                      </td>

                      <td
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.76rem",
                        }}
                      >
                        {p.sku}
                      </td>

                      <td>
                        NGN {p.price?.toLocaleString()}
                      </td>

                      <td>{p.stock}</td>

                      <td>
                        <span className={`tag ${cls}`}>
                          {label}
                        </span>
                      </td>

                      <td style={{ whiteSpace: "nowrap" }}>
                        <button
                          type="button"
                          className="btn-link"
                          style={{
                            color: "var(--color-primary-dark)",
                            marginRight: "0.9rem",
                          }}
                          onClick={() => openModal(p)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn-link text-danger"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-backdrop">
            <form
              onSubmit={handleSave}
              className="card modal"
            >
              <div
                className="row"
                style={{ marginBottom: "1rem" }}
              >
                <h3 style={{ margin: 0 }}>
                  {editingId
                    ? "Edit Product"
                    : "Add New Product"}
                </h3>

                <button
                  type="button"
                  className="btn-link"
                  style={{ fontSize: "1.3rem" }}
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  aria-label="Close product form"
                >
                  &times;
                </button>
              </div>

              {error && (
                <p className="text-danger" role="alert">
                  {error}
                </p>
              )}

              {categoryError && (
                <p className="text-danger" role="alert">
                  {categoryError}
                </p>
              )}

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="product-image"
                >
                  Product Image{" "}
                  {editingId && (
                    <span className="text-light">
                      (leave blank to keep current)
                    </span>
                  )}
                </label>

                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] || null)
                  }
                />
              </div>

              <Input
                label="Product name"
                value={form.name}
                onChange={set("name")}
                required
              />

              <Input
                label="Description"
                value={form.description}
                onChange={set("description")}
              />

              <div className="field-row">
                <Input
                  label="SKU"
                  value={form.sku}
                  onChange={set("sku")}
                  required
                />

                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor="product-category"
                  >
                    Category
                  </label>

                  <select
                    id="product-category"
                    value={form.category}
                    onChange={set("category")}
                    required
                  >
                    <option value="">Select...</option>

                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field-row">
                <Input
                  label="Price (NGN)"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={set("price")}
                  required
                />

                <Input
                  label="Stock quantity"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={set("stock")}
                  required
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.8rem",
                  marginTop: "0.5rem",
                }}
              >
                <Button
                  type="button"
                  variant="secondary"
                  className="btn-block"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="btn-block"
                  loading={saving}
                >
                  {editingId
                    ? "Update Product"
                    : "Save Product"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}