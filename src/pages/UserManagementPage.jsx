import { useEffect, useState } from "react"
import axios from "axios"
import CheckIcon from "../components/icons/CheckIcon";
import UnauthorizedIcon from "../components/icons/UnauthorizedIcon";
import TrashIcon from "../components/icons/TrashIcon";

export default function UserManagementPage() {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${apiUrl}/api/auth/getuser`, {
                withCredentials: true
            })

            setUsers(res.data)

        } catch (error) {
            console.error("Error al obtener los usuarios: ", error)
        } finally {
            setLoading(false)
        }

    }

    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm("¿Estas seguro de que queres eliminar este usuario?")
        if (!confirmDelete) return

        try {
            await axios.delete(`${apiUrl}/api/auth/deleteuser/${userId}`, {
                withCredentials: true
            })

            setUsers((prev) => prev.filter((user) => user._id !== userId));
        } catch (error) {
            console.error("Error al eliminar el usuario: ", error)
            alert("Ocurrio un error al intentar eliminar el usuario. ")
        }
    }

    const handleAuthorizeUser = async (userId) => {
        try {
            const res = await axios.patch(`${apiUrl}/api/auth/authorize/${userId}`,{}, {
                withCredentials: true
            })

            setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === userId ? { ...user, authorized: true } : user
            )
        );
        } catch (error) {
            console.error("Error al autorizar el usuario: ", error);
        alert("Ocurrió un error al intentar autorizar el usuario.");
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])



    return (
        <div className="container mt-4">

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            ) : users.length > 0 ? (
                <>
                    <table className="table table-stiped mt-4">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Legajo</th>
                                <th>Rol</th>
                                <th>Permisos</th>
                                <th></th>
                            </tr>

                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.legajo}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        {user.authorized ? (
                                            <i className="bi bi-check-circle-fill text-success"> <CheckIcon /></i>
                                        ) : (
                                            <i className="bi bi-x-circle-fill text-danger"><UnauthorizedIcon /></i>
                                        )}
                                    </td>
                                    <td className="justify-content-end d-flex gap-2">
                                        {!user.authorized && (
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleAuthorizeUser(user._id)} 
                                            >
                                                <CheckIcon />
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteUser(user._id)}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <></>
            )}
        </div>
    )
}