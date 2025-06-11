import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";


export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signup, errors: signupErrors } = useAuth();
  

  const onSubmit = handleSubmit((data) => {
    signup(data);
    window.location.reload();
  });

  

  return (
    <div className="container d-flex justify-content-center align-items-center mb-4">
      <div className="card shadow w-100 fondoCard" style={{ maxWidth: "400px" }}>
        <div className="card-body">
        <img src="../../public/logoMapIp.png" alt="Logo" className="dashboard-logo" style={{ maxWidth: "300px" }} />

          {signupErrors && signupErrors.length > 0 && (
            <div className="alert alert-danger">
              {signupErrors.map((err, i) => (
                <p key={i} className="mb-0">
                  {err}
                </p>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label ">Nombre de usuario</label>
              <input
                type="text"
                {...register("username", { required: true })}
                className="form-control"
                placeholder="Usuario"
              />
              {errors.username && (
                <div className="form-text text-danger">
                  El nombre de usuario es obligatorio
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Legajo</label>
              <input
                type="number"
                {...register("legajo", { required: true, valueAsNumber: true })}
                className="form-control"
                placeholder="Legajo"
              />
              {errors.legajo && (
                <div className="form-text text-danger">El legajo es obligatorio</div>
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
                <div className="form-text text-danger">La contraseña es obligatoria</div>
              )}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-success">
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
