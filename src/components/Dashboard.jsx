import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import IconLogout from "./icons/LogoutIcon";

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className=" dashboard" style={{ minWidth: "250px" }}>
      <Link to="/" >
      <img src="../../public/logoMapIp.png" alt="Logo" className="dashboard-logo" style={{ maxWidth: "200px" }} />
      </Link>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/scan" className="nav-link ">
            Scaneo de Ips
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/ips" className="nav-link ">
            IPS
          </Link>
        </li>
        <li className="nav-item">
            <Link to="/offices" className="nav-link">
              Gestion de Areas
            </Link>
        </li>
        {user?.role === "admin" && (
          <li className="nav-item">
            <Link to="/user-management" className="nav-link">
              Gestion de Usuarios
            </Link>
          </li>
        )}
        <li className="nav-item">
                  <button className="nav-link " onClick={logout}>
                    <IconLogout/>
                  </button>
                </li>
      </ul>
    </div>
  );
}
