import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { getAllOrders } from "../../services/orderService";
import { getProducts } from "../../services/productService";
import { statusStyles } from "../Confirmation";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

const getTotalRecords = (res) => {
  const value =
    res.data?.pagination?.total ??
    res.pagination?.total ??
    res.meta?.totalRecords ??
    res.data?.meta?.totalRecords;

  if (value === undefined || value === null || value === "") {
    return null;
  }

  const count = Number(value);

  return Number.isInteger(count) && count >= 0
    ? count
    : null;
};

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState([]);

  const [stats, setStats] = useState({
    totalOrders: null,
    totalProducts: null,
    revenue: null,
  });

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [ordersError, setOrdersError] = useState("");
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        const res = await getAllOrders({
          page: 1,
          limit: 5,
        });

        if (!active) return;

        console.log("Dashboard orders response:", res);

        const orders = Array.isArray(res.data)
          ? res.data
          : res.data?.orders;

        if (!Array.isArray(orders)) {
          throw new Error(
            "Unable to display recent orders: unexpected response format."
          );
        }

        const revenue = orders.reduce((sum, order) => {
          if (order.paymentStatus !== "paid") {
            return sum;
          }

          const amount = Number(order.totalAmount);

          return Number.isFinite(amount)
            ? sum + amount
            : sum;
        }, 0);

        const totalOrders = getTotalRecords(res);

        setRecentOrders(orders);

        setStats((current) => ({
          ...current,
          totalOrders,
          revenue,
        }));

        if (totalOrders === null) {
          setOrdersError(
            "Recent orders loaded, but the response did not include a valid total order count."
          );
        }
      } catch (err) {
        if (!active) return;

        console.error("Failed to load dashboard orders:", err);

        setOrdersError(
          getErrorMessage(err, "Unable to load dashboard orders.")
        );
      } finally {
        if (active) {
          setLoadingOrders(false);
        }
      }
    };

    const loadProducts = async () => {
      try {
        const res = await getProducts({
          page: 1,
          limit: 1,
        });

        if (!active) return;

        console.log("Dashboard product response:", res);

        const totalProducts = getTotalRecords(res);

        if (totalProducts === null) {
          throw new Error(
            "The product response did not include a valid total count. Check the Dashboard product response in the console."
          );
        }

        setStats((current) => ({
          ...current,
          totalProducts,
        }));
      } catch (err) {
        if (!active) return;

        console.error(
          "Failed to load dashboard product count:",
          err
        );

        setProductsError(
          getErrorMessage(err, "Unable to load product count.")
        );
      } finally {
        if (active) {
          setLoadingProducts(false);
        }
      }
    };

    loadOrders();
    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const cards = [
    {
      value: loadingOrders
        ? "Loading..."
        : stats.revenue === null
          ? "—"
          : `NGN ${stats.revenue.toLocaleString()}`,
      label: "Revenue (recent orders)",
      cls: "text-success",
    },
    {
      value: loadingOrders
        ? "Loading..."
        : stats.totalOrders === null
          ? "—"
          : stats.totalOrders.toLocaleString(),
      label: "Total Orders",
    },
    {
      value: loadingProducts
        ? "Loading..."
        : stats.totalProducts === null
          ? "—"
          : stats.totalProducts.toLocaleString(),
      label: "Products",
    },
  ];

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <main className="admin-main">
        <h1
          style={{
            marginBottom: "0.2rem",
            fontSize: "1.4rem",
          }}
        >
          Dashboard
        </h1>

        <p
          className="text-mid"
          style={{ marginBottom: "1.5rem" }}
        >
          Overview of your store performance
        </p>

        {ordersError && (
          <p className="text-danger" role="alert">
            {ordersError}
          </p>
        )}

        {productsError && (
          <p className="text-danger" role="alert">
            {productsError}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.label}
              className="card"
              style={{ padding: "1.1rem" }}
            >
              <p
                className={card.cls}
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  margin: "0 0 0.2rem",
                }}
              >
                {card.value}
              </p>

              <p
                className="text-mid"
                style={{
                  margin: 0,
                  fontSize: "0.78rem",
                }}
              >
                {card.label}
              </p>
            </div>
          ))}
        </div>

        <div className="card">
          <h3
            style={{
              margin: 0,
              padding: "1.2rem 1rem 0.4rem",
            }}
          >
            Recent Orders
          </h3>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loadingOrders ? (
                  <tr>
                    <td colSpan={4} className="text-mid">
                      Loading recent orders...
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-mid">
                      {stats.revenue === null
                        ? "Recent orders could not be loaded."
                        : "No orders yet."}
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    const amount = Number(order.totalAmount);

                    return (
                      <tr key={order._id}>
                        <td
                          style={{ fontFamily: "monospace" }}
                        >
                          {String(order._id || "").slice(-8)}
                        </td>

                        <td>{order.user?.name || "N/A"}</td>

                        <td>
                          {Number.isFinite(amount)
                            ? `NGN ${amount.toLocaleString()}`
                            : "—"}
                        </td>

                        <td>
                          <span
                            className={`tag ${statusStyles[order.status] ||
                              "tag-warning"
                              }`}
                          >
                            {order.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}