import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="bg-dark text-white p-3" style={{ minWidth: "250px" }}>
      <h4 className="mb-4">Panel</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/" className="nav-link text-white">
            Inicio
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/otra-ruta" className="nav-link text-white">
            Otra sección
          </Link>
        </li>
      </ul>
    </div>
  );
}
