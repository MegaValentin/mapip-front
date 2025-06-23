import { useState } from "react";
import axios from "axios";
import CloseIcon from "./icons/CloseIcon";


export default function IpEditModal({ ip, onClose, onUpdated }) {
    const [formData, setFormData] = useState({
        direccion: ip.direccion || "",
        estado: ip.estado || "",
        hostname: ip.hostname || "",
        mac: ip.mac || "",
        area: ip.area || "",
        observaciones: ip.observaciones || "",
        equipo: ip.equipo || ""
    })
    const [errors, setErrors] = useState([])

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors([]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {

            await axios.put(`${apiUrl}/api/ips/${ip._id}`, formData, {
                withCredentials: true,
            });
            alert("Ip actualizada correctamente")
            onClose()
            if (onUpdated) { onUpdated() }
        } catch (error) {
            console.error("Error al actualizar la IP: ", error)

            const errorValidations = error.response?.data?.error
            console.log("Errores del servidor:", JSON.stringify(error.response?.data, null, 2));
            if (errorValidations) {
                setErrors(errorValidations)
            } else {
                setErrors([{ campo: "general", mensaje: "Error al editar la Ip" }])
            }
        }
    }

    return (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content p-4">
                    <button className="btn btn-sm btn-outline-danger position-absolute end-0 top-0 m-3" onClick={onClose}>
                        <CloseIcon />
                    </button>
                    
                    <form onSubmit={handleSubmit} className="row g-3 mt-3">
                        <div className="col-md-6">
                            <label className="form-label text-black">Dirección IP</label>
                            <input type="text"
                                className="form-control"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange} />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label text-black">Estado</label>
                            <select className="form-select" name="estado" value={formData.estado} onChange={handleChange}>
                                <option value="">Seleccionar estado</option>
                                <option value="libre">Libre</option>
                                <option value="ocupada">Ocupada</option>
                                <option value="conflicto">Conflicto</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label text-black">Hostname</label>
                            <input type="text"
                                className="form-control"
                                name="hostname"
                                placeholder="Hostname"
                                value={formData.hostname}
                                onChange={handleChange} />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label text-black">MAC</label>
                            <input type="text"
                                className="form-control"
                                name="mac"
                                placeholder="Ejemplo: 8A:3F:B2:6D:91:E4"
                                value={formData.mac}
                                onChange={handleChange} />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label text-black">Área</label>
                            <input type="text"
                                className="form-control"
                                name="area"
                                placeholder="Area"
                                value={formData.area}
                                onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label text-black">Equipo</label>
                            <select className="form-select" name="equipo" value={formData.equipo} onChange={handleChange}>
                                <option value="">Seleccionar estado</option>
                                <option value="computadora">Computadora</option>
                                <option value="impresora">Impresora</option>
                                <option value="router">Router</option>
                                <option value="servidor" >Servidor</option>
                            </select>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label text-black">Observaciones</label>
                            <textarea
                                className="form-control"
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Obsevaciones"
                            />
                        </div>

                        <div className="col-12 text-end">
                            <button type="submit" className="btn btn-primary">Guardar cambios</button>
                        </div>

                    </form>
                    {errors.length > 0 && (
                        <div className="alert alert-danger">
                            <ul className="mb-0">
                                {errors.map((err, index) => (
                                    <li key={index}>
                                        <strong>{err.campo}</strong> {err.mensaje}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}