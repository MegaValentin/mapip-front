import { CheckCircle, AlertTriangle, Cpu } from "lucide-react";

export default function IpsSummary({ free, busy, conflict, puertaEnlace }) {
    const cards = [
        {
            title: "Ips Libre",
            count: free,
            border: "success",
            text: "success",
            icon: <CheckCircle className="text-success mb-2" size={24} />,
        },
        {
            title: "Ips Ocupadas",
            count: busy,
            border: "primary",
            text: "primary",
            icon: <Cpu className="text-primary mb-2" size={24} />,
        },
        {
            title: "Ips con Conflicto",
            count: conflict,
            border: "warning",
            text: "warning",
            icon: <AlertTriangle className="text-warning mb-2" size={24} />,
        }
    ]

    return (
        <div className="row mt-4">
            {cards.map((c, idx) => (
                <div key={idx} className="col-md-4">
                    <div className={`card border-${c.border} shadow text-center`}>
                        <div className="card-body">
                            {c.icon}
                            <h5 className={`card-title text-${c.text}`}>{c.title}</h5>
                            <p className="card-text fs-4">{c.count}</p>
                            <small className="text-muted">en {puertaEnlace}</small>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}