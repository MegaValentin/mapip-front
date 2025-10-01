export default function IpsFilters({ filters, setFilters }) {

    return(
        <div className="row mb-3 justify-content-center d-flex gap-2">

            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.estado}
                onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
              >
                <option value="">Todos los estados</option>
                <option value="libre">Libre</option>
                <option value="ocupada">Ocupada</option>
                <option value="conflicto">Conflicto</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.equipo}
                onChange={(e) => setFilters({ ...filters, equipo: e.target.value })}
              >
                <option value="">Todos los equipos</option>
                <option value="computadora">Computadora</option>
                <option value="impresora">Impresora</option>
                <option value="router">Router</option>
                <option value="servidor">Servidor</option>
                <option value="reloj">Reloj</option>
              </select>
            </div>
            <button
              className="btn btn-outline-secondary col-md-2"
              onClick={() => setFilters({ estado: "", equipo: "" })}
            >
              Limpiar filtros
            </button>
          </div>
    )
}