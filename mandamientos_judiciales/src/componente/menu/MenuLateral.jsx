import React from 'react'
import { Link } from "react-router-dom"
import "../../../src/index.css"


const MenuLateral = () => {
   return (
      <>

         <div className='contenedor-menu'>
            <div className='menu'>



               <div className="mb-3 row" id='opc_0'>
                  <div className="col-sm-2">
                     <a >Usuario:</a>
                  </div>
               </div>

               <div className='divisor'></div>

               <div className="mb-3 row" >
                  <div className="col-sm-2" id='opc_1'>
                     <Link to="/" style={{ color: 'white' }}>Inicio registro</Link>
                  </div>
               </div>

               <div className="mb-3 row">
                  <div className="col-sm-2" id='opc_1'>
                     <Link to="/Ver" style={{ color: 'white' }}>Ver Registros</Link>
                  </div>
               </div>



               <div className="mb-3 row">
                  <div className="col-sm-2" id='opc_1'>
                     <Link to="/menu_opc" style={{ color: 'white' }}>Baja</Link>
                  </div>
               </div>




            </div>
         </div>





      </>
   )
}

export default MenuLateral