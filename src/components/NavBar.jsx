import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import IconLogout from "./icons/LogoutIcon";


function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  if(!isAuthenticated) return null

  return (
    <nav className=" navbar navbar-expand-lg  ">
      <div className="container">
        

        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto ">
            {isAuthenticated ? (
              <>
                
                <li className="nav-item">
                  <button className="nav-link boton" onClick={logout}>
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