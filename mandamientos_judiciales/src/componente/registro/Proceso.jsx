import Menu from "../menu/MenuLateral";
import Titulo from "../menu/Titulo";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/proceso.css"
import { useParams } from "react-router-dom";
import { validarProceso } from "./validacionProceso";
import CryptoJS from 'crypto-js';

const Proceso = () => {
  const navigate = useNavigate();
  const [llave, setLlave] = useState('');
  const [emisor, setEmisor] = useState('');

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

 setProceso((prevProceso) => ({
 ...prevProceso,
 LLAVE: desencriptado1,
 ID_EMISOR: desencriptado2
 }));
 }
 }, [location.search]);

 

const [fechaActual, setFechaActual] = useState('');
const [fecha__, setFecha__] = useState({ FECHA_ACTUALIZACION: '', HORA: ''});

  const [errors, setErrors] = useState({});
  const [cat_fuero,       setCat_fuero] =       useState([])
  const [cat_tipoMandato, setCat_tipoMandato]=  useState([])
  const [cat_MotivoCanc,  setCat_MotivoCanc] =  useState([])
  const [cat_ProcExtrad,  setCat_ProcExtrad] =  useState([])
  const [cat_TipoProceso, setCat_TipoProceso]=  useState([])
  const [idAlterna, setIdAlterna] = useState('');
  
  const [proceso, setProceso] = useState({
    ID_ALTERNA:"",
    ID_ESTADO_EMISOR: "",
    ID_EMISOR: "",
    LLAVE:"",
    FECHA_ACTUALIZACION:"",
    HORA:"",   
    FECHA_LIBRAMIENTO: "",
    ID_FUERO_PROCESO: "",
    ID_TIPO_MANDATO: "",
    NO_PROCESO: "",
    NO_AVERIGUACION: "",
    FECHA_CAPTURA: "",
    FECHA_RECEPCION: "",
  //  FECHA_PRESCRIPCION: "",     // nulo    ****
  //  FECHA_CUMPLIMIENTO: "",     // nulo    ****
  //  OFICIO_CUMPLE: "",          // nulo    ****
  //  FECHA_CANCELACION: "",      // nulo    ****
  //  ID_MOTIVO_CANCELACION: "",  // nulo    ****
  //  OFICIO_CANCELACION: "",     // nulo    ****
    OBSERVACIONES: "",
    ID_PROCESO_EXTRADI: "",
    ID_TIPO_PROCESO: "",
    CARPETA_INV: "",
  });


   console.log("objeto proceso",proceso)

  useEffect(() => {
    fetch("http://localhost:8081/proceso/idfueroproceso")
      .then((data) => data.json())
      .then((val) => setCat_fuero(val))
  }, [])

  useEffect(() => {
    fetch("http://localhost:8081/proceso/idtipomandato")
      .then((data) => data.json())
      .then((val) => setCat_tipoMandato(val))
  }, [])

  useEffect(() => {
    fetch("http://localhost:8081/proceso/idmotcancelacion")
      .then((data) => data.json())
      .then((val) => setCat_MotivoCanc(val))
  }, [])

  useEffect(() => {
    fetch("http://localhost:8081/proceso/idprocextradicion")
      .then((data) => data.json())
      .then((val) => setCat_ProcExtrad(val))
  }, [])

  useEffect(() => {
    fetch("http://localhost:8081/proceso/idtipoproceso")
      .then((data) => data.json())
      .then((val) => setCat_TipoProceso(val))
  }, [])

 
 
   
  
  

  const handleChange = (e) => {
    //formatoDia()
    const { name, value } = e.target;
    setProceso((prev) => ({ ...prev, [name]: value.trim() }));
  };


  const handleClick = async (e) => {   
    e.preventDefault();   
    const validationErrors = validarProceso(proceso);
    setErrors(validationErrors);    
    if (Object.keys(validationErrors).length === 0 ) {
      let ultimoIdAlterna = 0; 
      try {      
        const response = await fetch("http://localhost:8081/proceso/sacarIa");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();         
        if (Array.isArray(data) && data.length > 0) {
          ultimoIdAlterna = data[0].ultimo_id + 1;
          setIdAlterna(ultimoIdAlterna);
          console.log("la ultima id alterna es:", ultimoIdAlterna);
          // Actualizar el objeto delitos con el valor de idAlterna
          setProceso((prevProceso) => ({
            ...prevProceso,
            ID_ALTERNA: ultimoIdAlterna
          }));
        } 
        
        await axios.post("http://localhost:8081/proceso/proceso", {
          ...proceso,
          ID_ALTERNA: ultimoIdAlterna,
          
        });        
        alert("El nuevo registro ha sido guardado correctamente ");

        console.log('critar1',proceso.LLAVE)
        console.log('critar2',proceso.ID_EMISOR)
        const kunci = proceso.LLAVE.toString();
        const pemancar = proceso.ID_EMISOR.toString();
        const cla = "001";        
        const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
        const dat_e = CryptoJS.AES.encrypt(pemancar, cla).toString();        
        const url = `/menu_opc?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;      
       
        navigate(url);
       // navigate(`/menu_opc/${llave}`);
      } catch (error) {
        console.error("Error al registrar:", error);
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
setFechaActual(fecha);
setProceso((prevRegistro) => ({
  ...prevRegistro,
  FECHA_ACTUALIZACION: fecha,
  HORA: horaActual
}));

};

useEffect(() => {
  formatoDia();
  const intervalId = setInterval(formatoDia, 60000); // Actualizar cada minuto (60000 milisegundos)
  return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonta
}, []);  




  return (
    <>
      <Titulo></Titulo>    

      <div className="contenedor">   
        <div className="barra-lado"></div>
        <div className="contenedor_principal">  
          <br></br>      
        <div className="titulo_p"> <h3>PROCESO</h3> </div>
        <br></br>
        
          <div className="row">          
            <div className="mb-12 row">
              <form onSubmit={handleClick}>             
                
                
                <div className="mb-3 row" >
                  <div className="col-sm-3"   id="div-pro" >
                    <label className="form-label">FECHA LIBRAMIENTO</label>
                    <input
                      type="date"
                      className="form-control"
                      id="FECHA_LIBRAMIENTO"
                      name="FECHA_LIBRAMIENTO"
                      placeholder=""
                      onChange={handleChange}
                      max={fechaActual}
                    ></input>
                     {errors?.FECHA_LIBRAMIENTO && <p style={{ color: "red", fontSize: "13px" }}>{errors.FECHA_LIBRAMIENTO}</p>}
                  </div>

                  <div className="col-sm-3"   id="div-pro">
                    <label className="form-label">FUERO</label>
                    <select
                      type="text"
                      className="form-control"
                      name="ID_FUERO_PROCESO"
                      id="ID_FUERO_PROCESO"
                      placeholder=""
                      onChange={handleChange}>
                      <option selected disabled value=" ">Seleccione una opción</option>
                      {cat_fuero.map((fuero) => (
                        <option key={fuero.TIPO} value={fuero.CLAVE}>
                          {fuero.TIPO}
                        </option>
                      ))}
                    </select>
                    {errors?.ID_FUERO_PROCESO && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_FUERO_PROCESO}</p>}
                  </div>

                  <div className="col-sm-3"   id="div-pro">
                    <label className="form-label">TIPO MANDATO</label>
                    <select
                      type="text"
                      className="form-control"
                      name="ID_TIPO_MANDATO"
                      id="ID_TIPO_MANDATO"
                      placeholder=""
                      onChange={handleChange}>

                      <option selected disabled value=" ">Seleccione una opcion</option>
                      {cat_tipoMandato.map((mandato) => (
                        <option key={mandato.TIPO} value={mandato.CLAVE}>
                          {mandato.TIPO}
                        </option>
                      ))}
                    </select>
                    {errors?.ID_TIPO_MANDATO && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_TIPO_MANDATO}</p>}
                  </div>  

                  <div className="mb-3 row" id="div-pro"  >
                    <div className="col-sm-12">
                      <label className="form-label">NUMERO DE PROCESO</label>
                      <input
                      type="text"
                      className="form-control"
                      name="NO_PROCESO"
                      id="NO_PROCESO"
                      placeholder=""
                      onChange={handleChange}></input>
                      </div>  
                      {errors?.NO_PROCESO && <p style={{ color: "red", fontSize: "13px" }}>{errors.NO_PROCESO}</p>}
                  </div>

                </div>
           
                

                <div className="mb-3 row">
                  <div className="col-sm-3" id="div-pro1"  >
                    <label className="form-label">NUMERO DE AVERIGUACION</label>
                    <input
                      type="text"
                      className="form-control"
                      name="NO_AVERIGUACION"
                      id="NO_AVERIGUACION"
                      placeholder=""
                      onChange={handleChange}
                    ></input>
                     {errors?.NO_AVERIGUACION && <p style={{ color: "red", fontSize: "13px" }}>{errors.NO_AVERIGUACION}</p>}
                  </div>

                  <div className="col-sm-3" id="div-pro1"  >
                    <label className="form-label">FECHA DE CAPTURA</label>
                    <input
                      type="date"
                      className="form-control"
                      name="FECHA_CAPTURA"
                      id="FECHA_CAPTURA"
                      placeholder=""
                      onChange={handleChange}
                      max={fechaActual}
                    ></input>
                    {errors?.FECHA_CAPTURA && <p style={{ color: "red", fontSize: "13px" }}>{errors.FECHA_CAPTURA}</p>}
                  </div>

                  <div className="col-sm-3" id="div-pro1"  >
                    <label className="form-label">FECHA DE RECEPCION</label>
                    <input
                      type="date"
                      className="form-control"
                      name="FECHA_RECEPCION"
                      id="FECHA_RECEPCION"
                      placeholder=""
                      onChange={handleChange}
                      max={fechaActual}
                    ></input>
                     {errors?.FECHA_RECEPCION && <p style={{ color: "red", fontSize: "13px" }}>{errors.FECHA_RECEPCION}</p>}
                  </div>

                </div>

                                 
                

                <div className="mb-3 row">
                    <div className="col-sm-9" id="div-pro2">
                    <label className="form-label">OBSERVACIONES (no obligatorio)</label>
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


                <div className="mb-3 row">
                <div className="col-sm-3"   id="div-pro3"  >
                    <label className="form-label">PROCESO EXTRADICION</label>
                    <select
                      type="text"
                      className="form-control"
                      name="ID_PROCESO_EXTRADI"
                      id="ID_PROCESO_EXTRADI"
                      placeholder=""
                      onChange={handleChange}>

                      <option selected disabled value=" ">Seleccione una opcion de proceso</option>
                      {cat_ProcExtrad.map((extradicion) => (
                        <option key={extradicion.TIPO} value={extradicion.CLAVE}>
                          {extradicion.TIPO}
                        </option>
                      ))}
                    </select>
                    {errors?.ID_PROCESO_EXTRADI && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_PROCESO_EXTRADI}</p>}
                  </div>
                  <div className="col-sm-3" id="div-pro3"   >
                    <label className="form-label">TIPO DE PROCESO</label>
                    <select
                      type="text"
                      className="form-control"
                      name="ID_TIPO_PROCESO"
                      id="ID_TIPO_PROCESO"
                      placeholder=""
                      onChange={handleChange}>

                      <option selected disabled value=" ">Seleccione el tipo de proceso</option>
                      {cat_TipoProceso.map((tipoProc) => (
                        <option key={tipoProc.TIPO} value={tipoProc.CLAVE}>
                          {tipoProc.TIPO}
                        </option>
                      ))}
                    </select>
                    {errors?.ID_TIPO_PROCESO && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_TIPO_PROCESO}</p>}
                  </div>

                  <div className="col-sm-3" id="div-pro3"   >
                    <label className="form-label">
                      NUMERO DE CARPETA INVESTIGACION (no)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="CARPETA_INV"
                      name="CARPETA_INV"
                      placeholder=""
                      onChange={handleChange}
                    ></input>
                  </div>
                </div>

               
                  <div className="barra-btnpro"></div>
                  <div className="mb-3 row" id="btn-proceso">                   
                      <button type="submit" className="btn-sig">
                        siguiente
                      </button>                    
                  </div>
               


              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Proceso;
