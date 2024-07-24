import Menu from "../menu/MenuLateral";
import Titulo from "../menu/Titulo";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/domicilio.css" 
import {  validarDomicilio } from "./validacionProceso";
import CryptoJS from 'crypto-js'; 
import Table from 'react-bootstrap/Table';
import { useLocation } from "react-router-dom";

  const Domicilio = () => {
    const location = useLocation();
    const navigate = useNavigate();    

    const [ultimoID,setUltimoID]= useState('');
    const [nid, setNid] = useState('');
    const [cat_entidades, setCat_entidades] = useState([]);
    const [cat_municipios, setCat_municipios] = useState([]);
    const [cat_paises, setCat_paises] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedOption1, setSelectedOption1] = useState('');
    const [selectedOption2, setSelectedOption2] = useState('');
    const [options1, setOptions1] = useState([]);
    const [options2, setOptions2] = useState([]);
    const [fechaActual, setFechaActual] = useState('');
    const [archivos, setArchivos] = useState([]);
    const [fecha__, setFecha__] = useState({ FECHA_ACTUALIZACION: '', HORA: ''});
    const [llave, setLlave] = useState('');
    const [emisor, setEmisor] = useState('');

    const [domicilio, setDomicilio] = useState({
      LLAVE:"",
      ID_EMISOR:"",
      FECHA_ACTUALIZACION:fechaActual,
      HORA:"",    
      ID_ESTADO_DOM: "",
      ID_MUNICIPIO_DOM: "",
      ID_PAIS_DOM: "",
      CALLE: "",
      COLONIA: "",
      CP: "",
      OBSERVACIONES: "",
      TELEFONO: "",
      });
    
      console.log("objeto domicilio", domicilio)
      

    useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const var1 = queryParams.get('v1');
      const var2 = queryParams.get('v2');

     if (var1 && var2) {
     const clave = '001'; 
     const desencriptado1 = CryptoJS.AES.decrypt(var1, clave).toString(CryptoJS.enc.Utf8);
     const desencriptado2 = CryptoJS.AES.decrypt(var2, clave).toString(CryptoJS.enc.Utf8);

     setLlave(desencriptado1);
     setEmisor(desencriptado2);

     setDomicilio((prevDomicilio) => ({
     ...prevDomicilio,
     LLAVE: desencriptado1,
     ID_EMISOR: desencriptado2
     }));
     }
     }, [location.search]);

    console.log("Domicilio variable llave",llave)
    console.log("Domicilio variable emisor",emisor)
   
    
      
    console.log("llave del objeto",domicilio.LLAVE)
   
    useEffect(() => {
      if (domicilio.LLAVE) {
        llamarTabla(); // Llama a llamarTabla() cuando se tenga la llave
      }
    }, [domicilio.LLAVE]);   

    

  useEffect(() => {
    fetch("http://localhost:8081/domicilio/idestadoemisor")
      .then((data) => data.json())
      .then((val) => setCat_entidades(val));
  }, []);


  useEffect(() => {
    fetch("http://localhost:8081/domicilio/idpaises")
      .then((data) => data.json())
      .then((val) => setCat_paises(val));
  }, []);


 //tabla
useEffect(() => {
  if (domicilio.LLAVE) {
    llamarTabla();
  }
}, [domicilio.LLAVE]);

console.log("llave domicilio", domicilio.LLAVE);
 const llamarTabla = () => {
  console.log("llave dom", domicilio.LLAVE);
  fetch(`http://localhost:8081/domicilio/archivos/${domicilio.LLAVE}`)
  .then((data) => data.json())
  .then((val) => setArchivos(val))
  .catch((error) => console.error("Error al obtener archivos:", error));
  };   
  

  const handleChange = (e) => {
    //formatoDia()
    const { name, value } = e.target;
    setDomicilio((prev) => ({ ...prev, [name]: value.trim() }));
  };

  useEffect(() => {
    if (domicilio.ID_ESTADO_DOM === "" && domicilio.ID_MUNICIPIO_DOM === "" && domicilio.ID_PAIS_DOM === "" && domicilio.CALLE === "" && domicilio.COLONIA === "" && domicilio.CP === "" && domicilio.OBSERVACIONES === "" && domicilio.TELEFONO === "") {
     
    }
  }, [domicilio]);





  
  const handleClick = async (e) => {   
    e.preventDefault();
    const validationErrors = validarDomicilio(domicilio);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0 ) {  
    try { 
    await axios.post("http://localhost:8081/domicilio/registroDomicilio", domicilio);        
    alert("El nuevo registro ha sido guardado correctamente ");  
    llamarTabla();

    document.getElementById("ID_ESTADO_DOM").value = ""; // Limpiar campo ID_ESTADO_DOM
    document.getElementById("ID_MUNICIPIO_DOM").value = ""; // Limpiar campo ID_MUNICIPIO_DOM
    document.getElementById("ID_PAIS_DOM").value = ""; // Limpiar campo ID_PAIS_DOM
    document.getElementById("CALLE").value = ""; // Limpiar campo CALLE
    document.getElementById("COLONIA").value = ""; // Limpiar campo COLONIA
    document.getElementById("CP").value = ""; // Limpiar campo CP
    document.getElementById("OBSERVACIONES").value = ""; // Limpiar campo OBSERVACIONES
    document.getElementById("TELEFONO").value = ""; // Limpiar campo TELEFONO
    } catch (error) {
    console.error("Error al registrar:", error);
    } 
    }
    };




  const handleChangeEstado = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption1(selectedValue);
    axios.get(`http://localhost:8081/domicilio/idmunicipios/${selectedValue}`)
      .then(response => {
        setOptions2(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las opciones del segundo select:', error);
      });
  };

  domicilio["ID_ESTADO_DOM"] = selectedOption1;

   
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
    setFechaActual(fecha);
    setDomicilio((prevRegistro) => ({
    ...prevRegistro,
    FECHA_ACTUALIZACION: fecha,
    HORA: horaActual
    }));
  
  };
  
  useEffect(() => {
    formatoDia();
    const intervalId = setInterval(formatoDia, 60000); 
    return () => clearInterval(intervalId); 
  }, []);  
  

  const handleClickMenu = () => {
    console.log('dom critar1',llave)
    console.log('dom critar2',emisor)
    const kunci = domicilio.LLAVE.toString();
    const pemancar = domicilio.ID_EMISOR.toString();
    const cla = "001";    
    const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
    const dat_e = CryptoJS.AES.encrypt(pemancar, cla).toString();        
    const url = `/menu_opc?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;      
  
   
    navigate(url);
   
  };
  


  return (
    <>
      <Titulo></Titulo>

      <div className="cont_domicil">
        <br></br>
        <div className="contenedor_princ_dom">
          <div className="mb-12 row">
              
            <h3>DOMICILIO</h3>
            <div className="barra1"></div>
            <br />
            
            <form >
              
                <div className="col-sm-12">
                  <label className="form-label">Pais</label>
                  <select
                    type="text"
                    className="form-control"
                    name="ID_PAIS_DOM"
                    id="ID_PAIS_DOM"
                    placeholder=""
                    onChange={handleChange}
                  >                      
                    <option   >Selecione un Pais</option>
                    {cat_paises.map((pais) => (
                      <option key={pais.CLAVE} value={pais.CLAVE}>
                        {pais.PAIS}          
                      </option>
                    ))}       
                  </select>
                </div>
             


              <div className="mb-3 row">
                <div className="col-sm-6">                
                  <label className="form-label">Estado</label>
                  <select
                    type="text"
                    className="form-control"
                    name="ID_ESTADO_DOM"
                    id="ID_ESTADO_DOM"
                    placeholder=""
                    onChange={handleChangeEstado}
                  >
                    <option  value="">
                      selecione un estado
                    </option>
                    {cat_entidades.map((estados) => (
                      <option key={estados.ID_ESTADO} value={estados.ID_ESTADO}>
                        {estados.ENTIDAD}
                      </option>
                    ))}
                  </select>
                  {errors?.ID_ESTADO_DOM && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_ESTADO_DOM}</p>}
                </div>

                <div className="col-sm-6">
                  <label className="form-label">Municipio</label>
                  <select
                    type="text"
                    className="form-control"
                    name="ID_MUNICIPIO_DOM"
                    id="ID_MUNICIPIO_DOM"
                    placeholder=""
                    onChange={handleChange}
                  >
                       
                    <option >
                      Selecciona un municipio
                    </option>
                    {options2.map((muni) => (
                      <option key={muni.CLAVE_MPIO} value={muni.CLAVE_MPIO}>
                        {muni.MUNICIPIO}
                      </option>
                    ))}   
                  </select> {errors?.ID_MUNICIPIO_DOM && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_MUNICIPIO_DOM}</p>}
                </div>

                
              </div>
              <div className="mb-3 row">
                <div className="col-sm-6">
                  <label className="form-label">Calle</label>
                  <input
                    type="text"
                    className="form-control"
                    name="CALLE"
                    id="CALLE"
                    placeholder=""
                    onChange={handleChange}
                  ></input>
                  
                </div>

                <div className="col-sm-6">
                  <label className="form-label">Colonia</label>
                  <input
                    type="text"
                    className="form-control"
                    name="COLONIA"
                    id="COLONIA"
                    placeholder=""
                    onChange={handleChange}
                  ></input>
                  {errors?.COLONIA && <p style={{ color: "red", fontSize: "13px" }}>{errors.COLONIA}</p>}
                </div>

                
                
              </div>
              <div className="mb-3 row">
              <div className="col-sm-3">
                  <label className="form-label">Codigo Postal</label>
                  <input
                    type="text"
                    className="form-control"
                    name="CP"
                    id="CP"
                    placeholder=""
                    onChange={handleChange}
                  ></input>
                   {errors?.CP && <p style={{ color: "red", fontSize: "13px" }}>{errors.CP}</p>}
                </div>
               
                <div className="col-sm-4">
                  <label className="form-label">Telefono</label>
                  <input
                    type="text"
                    className="form-control"
                    name="TELEFONO"
                    id="TELEFONO"
                    placeholder=""
                    onChange={handleChange}
                  ></input>
                   {errors?.TELEFONO && <p style={{ color: "red", fontSize: "13px" }}>{errors.TELEFONO}</p>}
                </div>


              </div>

              <div className="mb-3 row">
                <div className="col-sm-12">
                  <label className="form-label">Observaciones</label>
                  <input
                    type="text"
                    className="form-control"
                    name="OBSERVACIONES"
                    id="OBSERVACIONES"
                    placeholder=""
                    onChange={handleChange}
                  ></input>
                </div>
              </div>

                <div className="row">
                <div className="col-sm-4  ">                                   
                      <button type="button" className="btn-info"  id="btnDomicilio" onClick={handleClick}>
                        Registrar 
                      </button>  

                      </div>
                  <div className="col-sm-4 " >
                  <button type="button" className="btn btn-info"  id="btn2" onClick={handleClickMenu}>
                        ir al menu  
                      </button>  
                   
                   {/*
                    <Link to={`/menu_opc`} className="btn btn-info" id="btn2">
                      Menu opcional
                    </Link>
                    <Link to={`/menu_opc/${id}`} className="btn btn-info">
                      Menu opcional
                    </Link>    */}
                  </div>               
               
                </div>
               

            </form>
          </div>
        </div>

       <div className="lista_dom">
       <h3>DOMICILIOS REGISTRADOS</h3>
       <div className="barra2"></div>
        <div className="ld">
        <Table striped bordered hover>
                 <thead>
                   <tr>
                     
                     <th>CALLE</th>
                     <th>COLONIA</th>
                     <th>CP</th>
                     <th>TELEFONO</th>
                     
                            
                   </tr>
                 </thead>
                 <tbody>
                   {archivos.map((ar, index) => {
                     console.log("ar:",ar)
                     return (
                       <tr key={index}>
                       
                        <td>{ar.CALLE}</td>
                        <td>{ar.COLONIA}</td>
                        <td>{ar.CP}</td>
                        <td>{ar.TELEFONO}</td>

                        { /*    
                         <td>{ar.delito[0].DESCRIP_DELITO}</td>
                         <td>{ar.modalidad[0].DESCRIP_MODALIDAD}</td>
                                */}                                
                       </tr>
                     );
                   })}
                 </tbody>
               </Table>
         


        </div>
       </div>



      </div>


    </>
  );
};

export default Domicilio;
