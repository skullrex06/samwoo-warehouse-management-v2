import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Truck,
  Boxes,
  ArrowLeftRight,
  History,
  AlertTriangle,
  Menu,
  RefreshCw,
} from "lucide-react";

const API_URL = "https://samwoo-warehouse-api.umayaris06.workers.dev";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Stock", icon: Package },
  { label: "Outgoing", icon: Truck },
  { label: "Incoming", icon: Boxes },
  { label: "Transfers", icon: ArrowLeftRight },
  { label: "Movement History", icon: History },
  { label: "Scrap & Defect", icon: AlertTriangle },
];

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [stock, setStock] = useState([]);
  const [loadingStock, setLoadingStock] = useState(false);
  const [stockError, setStockError] = useState("");
  const [showAddStock, setShowAddStock] = useState(false);
const [savingStock, setSavingStock] = useState(false);
const [addStockError, setAddStockError] = useState("");
const [stockForm, setStockForm] = useState({
  item_code: "",
  item_name: "",
  description: "",
  unit: "",
  quantity: "",
  reserved_quantity: "0",
  min_stock: "0",
  location: "",
});

function updateStockForm(event) {
  const { name, value } = event.target;
  setStockForm((current) => ({ ...current, [name]: value }));
}

async function addStock(event) {
  event.preventDefault();
  setSavingStock(true);
  setAddStockError("");

  const payload = {
    item_code: stockForm.item_code.trim(),
    item_name: stockForm.item_name.trim(),
    description: stockForm.description.trim() || null,
    unit: stockForm.unit.trim(),
    quantity: Number(stockForm.quantity),
    reserved_quantity: Number(stockForm.reserved_quantity || 0),
    min_stock: Number(stockForm.min_stock || 0),
    location: stockForm.location.trim() || null,
  };

  if (
    !payload.item_code ||
    !payload.item_name ||
    !payload.unit ||
    stockForm.quantity === "" ||
    !Number.isFinite(payload.quantity) ||
    payload.quantity < 0 ||
    !Number.isFinite(payload.reserved_quantity) ||
    payload.reserved_quantity < 0 ||
    !Number.isFinite(payload.min_stock) ||
    payload.min_stock < 0
  ) {
    setAddStockError("Semak medan wajib dan pastikan kuantiti ialah nombor 0 atau lebih.");
    setSavingStock(false);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/stock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || result.success !== true) {
      throw new Error(result.error || "Gagal menyimpan stok.");
    }

    setStockForm({
      item_code: "",
      item_name: "",
      description: "",
      unit: "",
      quantity: "",
      reserved_quantity: "0",
      min_stock: "0",
      location: "",
    });
    setShowAddStock(false);
    await loadStock();
  } catch (error) {
    setAddStockError(error.message || "Tidak dapat menyimpan stok.");
  } finally {
    setSavingStock(false);
  }
}
  async function loadStock() {
    setLoadingStock(true);
    setStockError("");

    try {
      const response = await fetch(`${API_URL}/api/stock`);
      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.error || "Gagal mendapatkan data stok.");
      }

      setStock(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setStockError(
        error.message || "Tidak dapat menyambung ke API. Cuba lagi."
      );
    } finally {
      setLoadingStock(false);
    }
  }

  useEffect(() => {
    loadStock();
  }, []);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">SW</div>
          <div>
            <strong>Samwoo</strong>
            <span>Warehouse System</span>
          </div>
        </div>

        <nav>
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activePage === label ? "active" : ""}`}
              onClick={() => {
                setActivePage(label);
                setMenuOpen(false);
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">Warehouse Management</div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          <div>
            <span className="eyebrow">SAMWOO WAREHOUSE</span>
            <h1>{activePage}</h1>
          </div>

          <div className="user-badge">Admin</div>
        </header>

        <section className="page-content">
          {activePage === "Dashboard" && (
            <>
              <div className="welcome">
                <div>
                  <h2>Warehouse Overview</h2>
                  <p>Monitor stock and warehouse activity.</p>
                </div>
                <span className="status-pill">API connected</span>
              </div>

              <div className="stats-grid">
                <article className="stat-card">
                  <span>Total Stock Items</span>
                  <strong>{loadingStock ? "…" : stock.length}</strong>
                  <small>Records returned by the stock API</small>
                </article>

                <article className="stat-card">
                  <span>Pending Outgoing</span>
                  <strong>—</strong>
                  <small>Not connected yet</small>
                </article>

                <article className="stat-card">
                  <span>Incoming Records</span>
                  <strong>—</strong>
                  <small>Not connected yet</small>
                </article>

                <article className="stat-card">
                  <span>Low Stock Items</span>
                  <strong>—</strong>
                  <small>Low-stock rule not configured yet</small>
                </article>
              </div>

              <article className="panel">
                <h3>Recent Activity</h3>
                <p className="empty-state">
                  Activity records will appear after the movement API is added.
                </p>
              </article>
            </>
          )}

          {activePage === "Stock" && (
            <article className="panel">
              <div className="stock-heading"></div> 
                  <button
  className="refresh-button"
  onClick={() => {
    setShowAddStock((current) => !current);
    setAddStockError("");
  }}
>
  {showAddStock ? "Cancel" : "Add Stock"}
</button>
                  <h2>Stock Records</h2>
                  <p className="empty-state">
                    {stock.length} record(s) retrieved from the database.
                  </p>
                </div>

                <button
                  className="refresh-button"
                  onClick={loadStock}
                  disabled={loadingStock}
                >
                  <RefreshCw size={16} />
                  {loadingStock ? "Loading…" : "Refresh"}
                </button>
              </div>

              {stockError && (
                <p className="error-message">
                  {stockError}
                </p>
              )}

              {loadingStock ? (
                <p className="empty-state">Loading stock records…</p>
              ) : stockError ? null : stock.length === 0 ? (
                <p className="empty-state">
                  Tiada rekod stok dalam database buat masa ini.
                </p>
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {Object.keys(stock[0]).map((column) => (
                          <th key={column}>{column.replaceAll("_", " ")}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stock.map((item, index) => (
                        <tr key={item.id ?? index}>
                          {Object.keys(stock[0]).map((column) => (
                            <td key={column}>
                              {item[column] == null ? "—" : String(item[column])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>
          )}

          {activePage !== "Dashboard" && activePage !== "Stock" && (
            <article className="panel">
              <h2>{activePage}</h2>
              <p className="empty-state">
                This module will be built in the next steps.
              </p>
            </article>
          )}
        </section>
      </main>
    </div>
  );
}
