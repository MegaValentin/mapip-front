import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <div className="container d-flex justify-content-center align-items-center mb-4">
      <div className="card shadow w-100" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>

          {signinErrors && signinErrors.length > 0 && (
            <div className="alert alert-danger">
              {signinErrors.map((err, i) => (
                <p key={i} className="mb-0">
                  {err}
                </p>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Legajo</label>
              <input
                type="number"
                {...register("legajo", { required: true, valueAsNumber: true })}
                className="form-control"
                placeholder="Legajo"
              />
              {errors.legajo && (
                <div className="form-text text-danger">
                  El legajo es obligatorio
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                {...register("password", { required: true })}
                className="form-control"
                placeholder="Contraseña"
              />
              {errors.password && (
                <div className="form-text text-danger">
                  La contraseña es obligatoria
                </div>
              )}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Ingresar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
