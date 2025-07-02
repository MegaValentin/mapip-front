import { useState } from "react";
import axios from "axios";

export default function AddOffices({onClose, onAdded}){
    const [ offices, setOffices ] = useState("")
    const [ loading, setLoading ] = useState(false)

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        try {
            await axios.post(`${apiUrl}/api/addoffice`,{
                offices},
                {withCredentials: true}
            )
            onAdded()
            onClose()
        } catch (error) {
            console.error("Error al agregar el area: ", error)
        } finally{
            setLoading(false)
        }
    }

    return(
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content p-4">
                <h5> Agregar Area</h5>
                <form onSubmit={handleSubmit} className="row g-3 mt-3">
                    <input type="text"
                    className="form-control mb-3"
                    placeholder="Area"
                    value={offices}
                    onChange={(e) => setOffices(e.target.value)}/>

                    <div>
                        <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="button" className="btn btn-primary" disabled={loading}>
                            {loading ? "Guardando" : "Agregar"}
                        </button>
                    </div>
                </form>

                </div>
            </div>
        </div>
    )
}