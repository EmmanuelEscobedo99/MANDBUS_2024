import Menu from "../menu/MenuLateral";
import Titulo from "../menu/Titulo_registro";

import { Link } from "react-router-dom";
import "../styles/inicio_r.css"
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

const Inicio_registrar = () => {
  
  const [Emisor, setEmisor] = useState('');


 

  useEffect(() => {    
    setEmisor(100);
  }, []);

  const generateEncryptedEmisor = () => {
    const emi = Emisor.toString();
    console.log("emisor", emi);

    const clave = '001'; // Clave utilizada para cifrar
    const encryptedEmisor = CryptoJS.AES.encrypt(emi, clave).toString();
    return encryptedEmisor;
  };

  const encryptedEmisor = generateEncryptedEmisor();
  const encryptedUrl = `/Alta?emisor=${encodeURIComponent(encryptedEmisor)}`;

  return (
    <>
      <div className="contenedor_ir">
       <div className="contenedor_principal_ir">
        <div className="fondo_mitad">       
          <div className="mennu"  >
          <Titulo encryptedEmisor={encryptedEmisor}></Titulo>  
          </div>   
 

          <div className="titulo_registro">
               <h5>DATOS OBLIGATORIOS</h5>            
            </div>

           
          <div className="aviso">
          
            <br></br>
          <div className="barraA"></div>

          <h5>DATOS GENERALES - PROCESO - DELITOS</h5>            
          </div> 

          <div className="barraAb"></div>

            <div className="boton_inicio">
            <Button id="bt" href={encryptedUrl}>INICIAR REGISTRO</Button>  
            
            </div>
           </div>           
        </div>
      </div>
    </>
  );
};

export default Inicio_registrar;
