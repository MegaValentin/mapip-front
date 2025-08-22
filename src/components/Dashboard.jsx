import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import IconLogout from "./icons/LogoutIcon";
import IpIcon from "./icons/IpIcon";
import RouterIcon from "./icons/RouterIcon";
import UsersIcon from "./icons/UsersIcon";
import TagIcon from "./icons/TagIcon";
import { useState } from "react";

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [ isOpen, setIsOpen] = useState(false)

  if (!isAuthenticated) return null;

  const dataLink = [
    {to: "/ips", text:"IPS", icon: <IpIcon/> },
    {to: "/routers", text:"Routers", icon: <RouterIcon/> },
    {to: "/offices", text:"Gestion de areas", icon: <UsersIcon/> },
  ]

  const renderLinks = (links) => 
    links.map((link, index) => (
      <li className="nav-item" key={index}>
          <Link to={link.to} className="nav-link ">
            <strong className="p-2">{link.icon}</strong>{link.text}
          </Link>
        </li>
    ))
  return (
    <>
    {/* Botón hamburguesa SOLO en pantallas chicas */}
    <button
      className="btn btn-outline-primary d-md-none m-2"
      onClick={() => setIsOpen(!isOpen)}
    >
      ☰
    </button>

    <div
      className={`dashboard  border-end p-3 d-flex flex-column 
      ${isOpen ? "d-block" : "d-none"} d-md-block`}
      style={{ minWidth: "250px", height: "100vh" }}
    >
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
              <strong className="p-2">
                <TagIcon />
              </strong>{" "}
              Usuarios
            </Link>
          </li>
        )}

        <li className="nav-item mt-auto">
          <button className="nav-link " onClick={logout}>
            <strong ><IconLogout /></strong> Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  </>
    
  );
}
