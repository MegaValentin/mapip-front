import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className=" d-flex justify-content-center ">
      <div className="" style={{ maxWidth: "420px" }}>
        
          

          {showRegister ? <RegisterForm /> : <LoginForm />}

          <div className="text-center ">
            {showRegister ? (
              <>
                <span>¿Ya tenés cuenta?</span>
                <button
                  className="btn btn-link p-0 ms-1"
                  onClick={() => setShowRegister(false)}
                >
                  Iniciar sesión
                </button>
              </>
            ) : (
              <>
                <span>¿No tenés cuenta?</span>
                <button
                  className="btn btn-link p-0 ms-1"
                  onClick={() => setShowRegister(true)}
                >
                  Registrate acá
                </button>
              </>
            )}
          </div>
        
      </div>
    </div>
  );
}

export default LoginPage;
