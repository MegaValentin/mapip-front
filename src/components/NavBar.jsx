import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import IconLogout from "./icons/LogoutIcon";


function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  if(!isAuthenticated) return null

  return (
    <nav className="--bs-info-bg-subtle navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          MAP IP
        </Link>

        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto ">
            {isAuthenticated ? (
              <>
                
                <li className="nav-item">
                  <button className="nav-link active" onClick={logout}>
                    <IconLogout/>
                  </button>
                </li>
              </>
            ) : (
              <>
                
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;