import { useState } from "react";
import axios from 'axios';

export default function AddOfficesExcel({onOfficeAdded}) {
    const [file, setFile ] = useState(null)
    const [ isUploading, setIsUploading ] = useState(false)
    const [ uploadError, setUploadError ] = useState(null)

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const handleFilechange = (e) => {
        setFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!file){
            alert('Please select a file first')
        }
        const formData = new FormData()
        formData.append('file', file)
        setIsUploading(true)
        setUploadError(null)
    
        try {
            const res = await axios.post(`${apiUrl}/api/addfile`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                withCredentials: true, 
              });

            onOfficeAdded(res.data)
            
            window.location.reload();
        } catch (error) {
            console.error('Error uploading file: ', error)
            setUploadError('Failed to upload file.')
        } finally{
            setIsUploading(false)
        }
    }

    return(
        <div className="card shadow p-4 mb-4">
        <h5 className="mb-3">Cargar áreas desde Excel</h5>
  
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fileInput" className="form-label">
              Seleccionar archivo Excel:
            </label>
            <input
              id="fileInput"
              type="file"
              className="form-control"
              accept=".xlsx, .xls"
              onChange={handleFilechange}
            />
          </div>
  
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Subiendo...
              </>
            ) : (
              'Cargar Excel'
            )}
          </button>
  
          {uploadError && (
            <div className="alert alert-danger mt-3 mb-0" role="alert">
              {uploadError}
            </div>
          )}
        </form>
      </div>
    )

}