import React from 'react'

import Table from 'react-bootstrap/Table';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

import { validarMediaFiliacion } from "./validacionProceso";
import { Modal, Button } from 'react-bootstrap';
import "../styles/modif_mf.css"





const Modificar_reg_mf = () => {
    const {ID_MEDIA_EXT, LLAVE} = useParams(); 

    


    const [archivos, setArchivos] = useState([]);
    const [cat_filiacion, setCat_filiacion] = useState([])
    const [cat_vfiliacion, setCat_vfiliacion] = useState([])
    const [errors, setErrors] = useState({});
    const [data, setData] = useState([]);

   
  const [modificacion_mf, setModificacion_mf] = useState({
   
    
    LLAVE:LLAVE,
    FECHA_ACTUALIZACION:"",
    HORA:"", 
    ID_FILIACION: "",
    ID_VALOR_FILIACION: "",
    NO_CONSECUTIVO: "",
  });
         

  useEffect(() => {
       console.log("la llave :",LLAVE)
       console.log("el id :",ID_MEDIA_EXT)

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/media-filiacion/ram/${LLAVE}/${ID_MEDIA_EXT}`);
            console.log('Respuesta de la consulta:', response.data);
            setData(response.data);
        } catch (error) {
            console.error('Error al realizar la consulta:', error);
        }
    };
    fetchData();
}, [ID_MEDIA_EXT, LLAVE]);



useEffect(() => {
    if (data) {
        const { ID_FILIACION, ID_VALOR_FILIACION, NO_CONSECUTIVO } = data;
        setModificacion_mf({
            ...modificacion_mf,
            ID_FILIACION: ID_FILIACION || "",
            ID_VALOR_FILIACION: ID_VALOR_FILIACION || "",
            NO_CONSECUTIVO: NO_CONSECUTIVO || "",
        });
    }
}, [data]);





         useEffect(() => {
         fetch("http://localhost:8081/media-filiacion/idtipofiliacion")
        .then((data) => data.json())
        .then((val) => setCat_filiacion(val))
        }, [])

       

      useEffect(() => {
          fetch("http://localhost:8081/media-filiacion/idtipofiliacion")
          .then((data) => data.json())
          .then((val) => setCat_filiacion(val))
      }, [])

      const handleChangeFiliacion = async (e) => {
        const { value } = e.target;
        
        console.log("valor de value",value) 
        setCat_vfiliacion([]);    
        setModificacion_mf((prev) => ({ ...prev, ID_FILIACION: value }));
    
    
        try {
           
          const response = await axios.get(`http://localhost:8081/media-filiacion/valorfiliacion/${value}`);
          setCat_vfiliacion(response.data);
        } catch (error) {
          console.error('Error al obtener datos de valor de filiacion:', error);
        }
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setModificacion_mf((prev) => ({ ...prev, [name]: value.trim() }));
      };
      

      const handleClick = (e) => {
        e.preventDefault();
        try {
        
        } catch (err) {
        
        }
      }; 




  return (
    <div className='contenedor_edicion'>
     <div className='cont_lista'>
     <h3>Modificar Registro</h3>
     <form onSubmit={handleClick}>
           
             
             <h6>llave:{LLAVE}</h6>
             <h6>id:{ID_MEDIA_EXT}</h6>
            <div className='formulario'>
            <div className="mb-3 row">
            <div className="col-sm-3">
                <label className="form-label">Filiacion</label>
                <select
                  type="text"
                  className="form-control"
                  name="ID_FILIACION"
                  id="ID_FILIACION"
                  placeholder=""
                
                  onChange={handleChangeFiliacion}>

                  <option disabled   >Seleciona una Filiacion</option>
                  {cat_filiacion.map((filiacion) => (
                    <option key={`${filiacion.DESCRIPCION}-${filiacion.CLAVE}`} value={filiacion.CLAVE}>
                      {filiacion.DESCRIPCION}
                    </option>
                  ))}
                </select>
                {errors?.ID_FILIACION && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_FILIACION}</p>}
  
              </div>           
            
              <div className="col-sm-3">
                <label className="form-label">Valor filiacion</label>
                <select
                  type="text"
                  className="form-control"
                  name="ID_VALOR_FILIACION"
                  id="ID_VALOR_FILIACION"
                  placeholder=""
                  onChange={handleChange}>

                  <option disabled   value="">Valor de filiacion</option>
                  {cat_vfiliacion.map((vfiliacion) => (
                    <option key={`${vfiliacion.CLAVE}-${vfiliacion.TIPO_MF}`} value={vfiliacion.TIPO_MF}>
                     { vfiliacion.TIPO_MF}  - {vfiliacion.DESCRIPCION} 
                    </option>
                  ))}
                </select>

              </div>

              <div className="col-sm-3">
                <label className="form-label">N° consecutivo    </label>
                <input type="text" className="form-control" name="NO_CONSECUTIVO" id="NO_CONSECUTIVO" placeholder="" onChange={handleChange}></input>
              </div>

            </div>



            <div className="boton_m">
              <div className="mb-3 row">
                <div className="col-sm-6">
                  <button type="submit" className="btn btn-primary" id='letra'>
                    modificar
                  </button>
                </div>
                
              </div>
            </div>            
            </div>



            
          </form>
       
  



     </div>
    </div>
  )
}

export default Modificar_reg_mf