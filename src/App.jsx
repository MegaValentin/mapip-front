import { Routes, Route, BrowserRouter } from "react-router-dom";

import UserManagementPage from "./pages/UserManagementPage.jsx";
import OfficesPages from "./pages/OfficesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Dashboard from "./components/Dashboard.jsx";

import IpPage from "./pages/IpPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";


function App() {
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
              
          <div className="d-flex vh-100">
            <div className="d-flex flex-grow-1">
              
              <Dashboard />
              <main className="flex-grow-1 p-4 overflow-auto bg-light w-100">
                
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route element={<ProtectedRoutes />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/ips" element={<IpPage/> } />
                    <Route path="/offices" element={<OfficesPages/>}/>
                    <Route path="/user-management" element={<UserManagementPage/>}/>
                  </Route>
                </Routes>
              </main>
            </div>
          </div>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
