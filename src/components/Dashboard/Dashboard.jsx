import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import IconLogout from "../icons/LogoutIcon";
import IpIcon from "../icons/IpIcon";
import RouterIcon from "../icons/RouterIcon";
import UsersIcon from "../icons/UsersIcon";
import TagIcon from "../icons/TagIcon";
import { useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  const dataLink = [
    { to: "/ips", text: "IPS", icon: <IpIcon /> },
    { to: "/routers", text: "Routers", icon: <RouterIcon /> },
    { to: "/offices", text: "Gestion de areas", icon: <UsersIcon /> },
  ];

  const renderLinks = (links) =>
    links.map((link, index) => (
      <li className="nav-item" key={index}>
        <Link to={link.to} className="nav-link" onClick={() => setIsOpen(false)}>
          <strong className="me-2">{link.icon}</strong>
          {link.text}
        </Link>
      </li>
    ));

  return (
    <>
      {/* Botón hamburguesa SOLO en pantallas chicas */}
      <button
        className={`btn btn-outline-primary btn-sm m-2 toggle-btn d-md-none ${isOpen ? "click" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`burger ${isOpen ? "open" : ""}`}></span>
      </button>

      {/* Overlay cuando se abre en mobile */}
      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>
          <img
            src="../../public/logoMapIp.png"
            alt="Logo"
            className="dashboard-logo mb-3"
            style={{ maxWidth: "200px" }}
          />
        </Link>

        <ul className="nav flex-column">
          {renderLinks(dataLink)}

          {user?.role === "admin" && (
            <li className="nav-item">
              <Link
                to="/user-management"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                <strong className="me-2">
                  <TagIcon />
                </strong>
                Usuarios
              </Link>
            </li>
          )}

          <li className="nav-item mt-auto">
            <Link to="/" className="nav-link text-danger" onClick={logout}>
              <strong className="me-2">
                <IconLogout />
              </strong>
              Cerrar sesión
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
