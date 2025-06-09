import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className=" dashboard" style={{ minWidth: "250px" }}>
      <Link to="/" >
      <img src="../../public/logoMapIp.png" alt="Logo" className="dashboard-logo" style={{ maxWidth: "200px" }} />
      </Link>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/" className="nav-link ">
            Inicio
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/ips" className="nav-link ">
            IPS
          </Link>
        </li>
      </ul>
    </div>
  );
}
