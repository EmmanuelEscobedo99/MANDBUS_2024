import Menu from "../menu/MenuLateral";
import Titulo from "../menu/Titulo_registro";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import "../styles/onombres.css";
import CryptoJS from 'crypto-js';
import {validarOtrosNombres} from "./validacionProceso";

  const Otros_nombres = () => {
  
  const [errors, setErrors] = useState({}); 
  const navigate = useNavigate();  
  const [nid, setNid] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [horaActual, setHoraActual]= useState('');
  const [fechaActual, setFechaActual] = useState('');
  const [fecha__, setFecha__] = useState({ FECHA_ACTUALIZACION: '', HORA: ''});
  const [llave, setLlave] = useState('');
  const [emisor, setEmisor] = useState('');

    const [otros_nom, setOtros_nom] = useState({   
      LLAVE:"",
      ID_EMISOR:"",
      FECHA_ACTUALIZACION:"",
      HORA:"", 
      O_NOMBRE: "",
      O_APATERNO: "",
      O_AMATERNO: "",
      O_ALIAS: "",
    });

     const location = useLocation();

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

     setOtros_nom((prevOtros_nom) => ({
     ...prevOtros_nom,
     LLAVE: desencriptado1,
     ID_EMISOR: desencriptado2
     }));
     }
     }, [location.search]);


     console.log("otros nom variable llave",llave)
     console.log("otros nom variable emisor",emisor)
  
     useEffect(() => {
      if (llave) {
        obtenerDatosTabla();
      }
    }, [llave]);          
  

  
  

    
    const obtenerDatosTabla = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/otros-nombres/datos/${llave}`);
        setArchivos(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de archivos:', error);
      }
    };             

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOtros_nom((prev) => ({ ...prev, [name]: value }));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    // Realizamos la validación
    const validationErrors = validarOtrosNombres(otros_nom);
    setErrors(validationErrors);
    // Si no hay errores, realizamos el registro
    if (Object.keys(validationErrors).length === 0 ) {
      try {
        await axios.post("http://localhost:8081/otros-nombres/insotrosnombrestemp", otros_nom);
        alert("El nuevo registro ha sido guardado correctamente ");
      //  navigate(`/MenuOpcional/${id}`);
      obtenerDatosTabla();
      setOtros_nom(prevOtros_nom => ({
        ...prevOtros_nom,
        FECHA_ACTUALIZACION: fechaActual,
        HORA: horaActual,
        O_NOMBRE: "",
        O_APATERNO: "",
        O_AMATERNO: "",
        O_ALIAS: "",
      }));

            
      } catch (err) {
        console.error("Error al registrar:", err);
      }
    }
  };



  const formatoDia = () => {
    const today = new Date();
    let dia = today.getDate();
    if (dia < 10)
    dia = '0' + dia.toString();
    let mes = today.getMonth() + 1;
    if (mes < 10)
    mes = '0' + mes.toString();
    let ano = today.getFullYear();
    const fecha = ano + "-" + mes + "-" + dia;
  
    let hora = today.getHours();
    if (hora < 10)
    hora = '0' + hora.toString();
    let minutos = today.getMinutes();
    if (minutos < 10)
    minutos = '0' + minutos.toString();
    const horaActual = hora + ":" + minutos;

    console.log(horaActual)
    console.log(fecha)
   
  setFechaActual(fecha);
  setHoraActual(horaActual)
  setOtros_nom((prevRegistro) => ({
    ...prevRegistro,
    FECHA_ACTUALIZACION: fecha,
    HORA: horaActual
  }));
  
  };
  
  useEffect(() => {
    formatoDia();
    const intervalId = setInterval(formatoDia, 50000); // Actualizar cada minuto (60000 milisegundos)
    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonta
  }, []);  
 
  const handleClickMenu = () => {
    console.log('on a mop critar1',llave)
    console.log('on a mop critar2',emisor)
    const kunci = llave.toString();
    const pemancar = emisor.toString();
    const cla = "001";
    
    const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
    const dat_e = CryptoJS.AES.encrypt(pemancar, cla).toString();        
    const url = `/menu_opc?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;        
  
   
    navigate(url);
  };
  
  
console.log( "objeto otros_nombre", otros_nom)

  return (
    <>
      <Titulo></Titulo>
      <div className="contenedor">
        <div className="contenedor_onombres">
        <br />
          <br />
          
          <div className="mb-12 row">           
            <h3>OTROS NOMBRES  </h3>            
            <div className="barra1_onombres"></div>
            <br />
          <br />
            
            <form>
            <br />
              <div className="mb-3 row" id="inputONonbre">                
                <div className="col-sm-10">                  
                  <label className="form-label">NOMBRE (S)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="O_NOMBRE"
                    name="O_NOMBRE"
                    placeholder=""
                    onChange={handleChange}
                    value={otros_nom.O_NOMBRE}
                  />
                  {errors?.O_NOMBRE && <p style={{ color: "red", fontSize: "13px" }}>{errors.O_NOMBRE}</p>}
                </div>
                

                

                
              </div>

              <div className="mb-3 row" id="inputONonbre">
                 <div className="col-sm-5">
                  <label className="form-label">APELLIDO PATERNO</label>
                  <input
                    type="text"
                    className="form-control"
                    name="O_APATERNO"
                    id="O_APATERNO"
                    placeholder=""
                    onChange={handleChange}
                    value={otros_nom.O_APATERNO}
                  />
                  {errors?.O_APATERNO && <p style={{ color: "red", fontSize: "13px" }}>{errors.O_APATERNO}</p>}
                </div>
          
                <div className="col-sm-5">
                  <label className="form-label">APELLIDO MATERNO</label>
                  <input
                    type="text"
                    className="form-control"
                    id="O_AMATERNO"
                    name="O_AMATERNO"
                    placeholder=""
                    onChange={handleChange}
                    value={otros_nom.O_AMATERNO}
                  />
                  {errors?.O_AMATERNO && <p style={{ color: "red", fontSize: "13px" }}>{errors.O_AMATERNO}</p>}
                </div>

              </div>



              <div className="mb-3 row" id="inputONonbre">                
                <div className="col-sm-5">
                  <label className="form-label">ALIAS</label>
                  <input
                    type="text"
                    className="form-control"
                    name="O_ALIAS"
                    id="O_ALIAS"
                    placeholder=""
                    onChange={handleChange}
                    value={otros_nom.O_ALIAS}
                  />
                  {errors?.O_ALIAS && <p style={{ color: "red", fontSize: "13px" }}>{errors.O_ALIAS}</p>}
                </div>
              </div>




              <div className="row" id="btn_oNombres">                
                  <div className="col-sm-3">
                    <button type="button" className="btn_Onomb btn-secondary" onClick={handleSubmit}>Registrar</button>             
                  </div>
                  <div className="col-sm-3">                   
                    <button type="button" className="btn_Onomb btn-secondary" onClick={handleClickMenu}>Ir al menu</button>               
                  </div>               
              </div>
             
          
            </form>
          </div>
        </div>       



        <div className="contenedor_onombres_der">
          <br />
          <br />
         
          <h3>LISTA DE NOMBRES O ALIAS REGISTRADOS</h3>
          
        <div className="barra2_on"></div> 
        <br />
        <br />
        
        


        <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>NOMBRE </th>
                    <th>A. PATERNO</th>
                    <th>A. MATERNO</th>
                    <th>ALIAS</th>
                  </tr>
                </thead>
                <tbody>
                  {archivos.map((ar, index) => {
                    return (
                      <tr key={index}>
                        <td>{ar.O_NOMBRE}</td>
                        <td>{ar.O_PATERNO}</td>
                        <td>{ar.O_MATERNO}</td>
                        <td>{ar.O_ALIAS}</td>
                       
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
          
          </div>
      </div>
    </>
  );
};

export default Otros_nombres;




