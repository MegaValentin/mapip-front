import { useEffect, useState } from "react"
import axios from "axios"
import CloseIcon from "./icons/CloseIcon"
import { registerKeyDown } from "../utils/keyDown"

export default function RouterEditModal({ router, onClose, onUpdated }){
    const [ errors, setErrors ] = useState([])
    const [ offices, setOffices ] = useState([])
    const [ formData, setFormData ] = useState({
        nombre: router.nombre || "",
        wan: router.wan || "",
        lan: router.lan || "",
        userAdmin: router.userAdmin || "",
        passAdmin: router.passAdmin || "",
        ssid: router.ssid || "",
        passSsid: router.passSsid || "",
        observaciones: router.observaciones || ""
    })
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    useEffect(() => {
        const cleanup = registerKeyDown(onClose);
        return cleanup;
    }, [onClose]);
    
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({...prev, [name]: value}))
        setErrors([])
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`${apiUrl}/api/ips-router/${router._id}`, formData, {
                withCredentials: true
            })
            alert("Router actualizado correctamente")
            onClose()
            if(onUpdated) { onUpdated()}
        } catch (error) {
            console.error("Error al actualizar el router", error)
        }
    }

    useEffect(() => {
        const fetchOffices = async ()=> {
            try {
                const res = await axios.get(`${apiUrl}/api/offices`,{
                    withCredentials: true
                })
                setOffices(res.data)
            } catch (error) {
                console.error("Error al cargar el area", error)
            }
        }

        fetchOffices()
    }, [apiUrl])

    const dataInput = [
        {label: "Nombre", name: "nombre", value:formData.nombre, placeholder: "Nombre del router"},
        {label: "WAN", name: "WAN", value:formData.wan, placeholder: "WAN"},
        {label: "LAN", name: "LAN", value:formData.lan, placeholder: "LAN"},
        {label: "Usuario Administrador", name: "userAdmin", value:formData.userAdmin, placeholder: "Usuario Administrador"},
        {label: "Contraseña Administrador", name: "passAdmin", value:formData.passAdmin, placeholder: "Contraseña Administrador"},
        {label: "SSID", name: "ssid", value:formData.ssid, placeholder: "Nombre del Router"},
        {label: "Contraseña SSID", name: "passSsid", value:formData.passSsid, placeholder: "Contraseña del Router"},
    ]

    const renderInput = (inputs) => 
        inputs.map((input, index) => (
            <div className="col-md-6" key={index}>
            <label className="form-label text-black">{input.label}</label>
            <input type="text"
                className="form-control"
                name={input.name}
                value={input.value}
                placeholder={input.placeholder}
                onChange={handleChange} />
        </div>
        ))

    return(
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content p-4">
                    <button className="btn btn-sm btn-outline-danger position-absolute end-0 top-0 m-3" onClick={onClose}>
                        <CloseIcon />
                    </button>

                    <form onSubmit={handleSubmit} className="row g-3 mt-3">

                        {renderInput(dataInput)}
                        
                        
                        <div className="col-md-6">
                            <label className="form-label text-black">Área</label>
                            <select
                                className="form-select"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar área</option>
                                {offices.map((a) => (
                                    <option key={a._id} value={a._id}>
                                        {a.area}
                                    </option>
                                ))}
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