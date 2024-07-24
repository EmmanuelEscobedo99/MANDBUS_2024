import React from 'react'
import { Link } from "react-router-dom";
import Titulo from "../menu/Titulo";
import { useParams, useLocation } from "react-router-dom";
import "../styles/menu_opc.css"
import CryptoJS from 'crypto-js'; 
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

   
const Menu_opcional = () => { 
  const location = useLocation();
  const navigate = useNavigate();        


         const [llave, setLlave] = useState('');
         const [emisor, setEmisor] = useState('');

         const [terminar, setTerminar] = useState({          
          LLAVE: llave          
        });
         

         useEffect(() => {
         const queryParams = new URLSearchParams(location.search);
         const var1 = queryParams.get('v1');
         const var2 = queryParams.get('v2');

        if (var1 && var2) {
        const clave = '001'; // La misma clave utilizada para cifrar en el componente emisor
        const desencriptado1 = CryptoJS.AES.decrypt(var1, clave).toString(CryptoJS.enc.Utf8);
        const desencriptado2 = CryptoJS.AES.decrypt(var2, clave).toString(CryptoJS.enc.Utf8);

        setLlave(desencriptado1);
        setEmisor(desencriptado2);       


        setTerminar((prevTerminar) => ({
          ...prevTerminar,
          LLAVE: desencriptado1
        }));

        
        }
        }, [location.search]);
       console.log("Menu opcional variable llave",llave)
       console.log("Menu opcional variable emisor",emisor)


       console.log('critar1',llave)
       console.log('critar2',emisor)
       const kunci = llave.toString();
       const pemancar = emisor.toString();
       const cla = "001";
       
       const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
       const dat_e = CryptoJS.AES.encrypt(pemancar, cla).toString(); 

       const url_domicilio      = `/Domicilio?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;        
       const url_otros_nom      = `/o_nombre?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;
       const url_amparos        = `/amparos?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;
       const url_mediafiliacion = `/mediafiliacion?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;
       const url_ministerial    = `/ministerial?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;
       const url_colaboracion   = `/colaboracion?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;
       const url_imagen         = `/imagen?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;
       
       
       const funcionTerminar = async () => {       
        try {          
          await axios.post("http://localhost:8081/delitos/terminarRegistro", terminar);          
          navigate('/');          
        } catch (err) {
          console.error("Error al registrar:", err);
        }
      }; 


        console.log("opcion terminar",terminar)
      
  return (
    <>
        
    <div className='contenedor_mo'>            
             <div className='cuadro-dialogo'>               

               <div className='imagen'>                
               </div>

               <div className='menuO'>
                <div className='sub-titu'>
                  <br></br>
                  <h5> INFORMACION</h5>
                  <h6>  COMPLEMENTARIA </h6>
                </div>

                   <div className='row'>
                      <Link to={url_domicilio} className="btn_lateral1 " >
                       DOMICILIO
                       </Link>   
                       <div className='barra_sep'></div>               
                       <Link to={url_imagen} className="btn_lateral2" >
                       IMAGEN
                       </Link>  
                       <div className='barra_sep'></div>
                       <Link to={url_amparos} className="btn_lateral2">
                        AMPAROS
                       </Link>
                       <div className='barra_sep'></div>
                       <Link to={url_mediafiliacion} className="btn_lateral2">
                        MEDIA FILIACION
                       </Link>
                       <div className='barra_sep'></div>
                       <Link to={url_ministerial} className="btn_lateral2">
                        MINISTERIAL
                       </Link>
                       <div className='barra_sep'></div>
                       <Link to={url_colaboracion} className="btn_lateral2" >
                        COLABORACION
                       </Link>                    
                    </div>   

                    <Link  className='boton-reg' onClick={funcionTerminar}>
                        <button>
                     FINALIZAR
                  </button>
                  </Link>

               </div>
               


               </div>
          
                 
 
                   
             </div>
    
    </>
  )
}

export default Menu_opcional