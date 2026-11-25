import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Truck,
  Boxes,
  ArrowLeftRight,
  History,
  AlertTriangle,
  Menu,
} from "lucide-react";

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
          {activePage === "Dashboard" ? (
            <>
              <div className="welcome">
                <div>
                  <h2>Warehouse Overview</h2>
                  <p>Monitor stock and warehouse activity.</p>
                </div>
                <span className="status-pill">System setup</span>
              </div>

              <div className="stats-grid">
                <article className="stat-card">
                  <span>Total Stock Items</span>
                  <strong>—</strong>
                  <small>Waiting for database connection</small>
                </article>
                <article className="stat-card">
                  <span>Pending Outgoing</span>
                  <strong>—</strong>
                  <small>Waiting for database connection</small>
                </article>
                <article className="stat-card">
                  <span>Incoming Records</span>
                  <strong>—</strong>
                  <small>Waiting for database connection</small>
                </article>
                <article className="stat-card">
                  <span>Low Stock Items</span>
                  <strong>—</strong>
                  <small>Waiting for database connection</small>
                </article>
              </div>

              <article className="panel">
                <h3>Recent Activity</h3>
                <p className="empty-state">
                  Activity records will appear here after the database is connected.
                </p>
              </article>
            </>
          ) : (
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
