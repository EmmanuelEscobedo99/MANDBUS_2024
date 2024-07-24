import React from 'react'
import "../styles/modificacion.css";
import { useNavigate } from "react-router-dom";

const Modificacion_aviso = () => {
    const navigate = useNavigate();


    const handleSalir = () => {
        const url = `/`;          
          navigate(url);     
      };



  return (
    <>
    <div className='cont_principal_aviso'>
       <div className='cont_block_aviso'>
           <h3 className='titulo'> El registro no cumple los requisitos necesarios para realizar una modificacion</h3>
           
           <div className='cont_btn_aviso'>
           <button className="btn-aviso" onClick={handleSalir}>Salir</button>
       </div>

       </div>

       

    </div>    
    </>
  )
}

export default Modificacion_aviso