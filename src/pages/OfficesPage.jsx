import { useState, useEffect } from "react"
import axios from "axios";

import AddOfficesExcel from "../components/AddOfficesExcel"
import ListOffices from "../components/ListOffices";

export default function OfficesPages(){
    const [ loading, setLoading] = useState(true)
    const [ offices, setOffices ] = useState([])

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/offices`, {
                    withCredentials: true
                })

                setOffices(res.data)
            } catch (error) {
                console.error("Error al obtener las areas: ", error)
            } finally{
                setLoading(false)
            }
        }

        fetchOffices()
    }, [ apiUrl ])

    const handleOfficeAdded = (newOffice) => {
        setOffices((prevOffice) => [...prevOffice, newOffice]);
    };

    if(loading){
        return(
            <div className="text-center mt-5">
                <div className="spinner-border text-primary " role="status"/>
                <p className="mt-2"> Cargando area...</p>
            </div>
        )
    }

    return (
        
        <div className="container mt-4">
          {offices.length === 0 ? (
            <AddOfficesExcel onOfficeAdded={handleOfficeAdded} />
          ) : (
            <ListOffices />
          )}
        </div>
    )
}