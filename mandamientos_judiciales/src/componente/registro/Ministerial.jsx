import Menu from "../menu/MenuLateral";
import Titulo from "../menu/Titulo";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../styles/ministerial.css" 
import  {validarMinisterial} from "./validacionProceso";
import CryptoJS from 'crypto-js'; 
const Ministerial = () => {
 
  const navigate = useNavigate();
  const [fechaActual, setFechaActual] = useState('');
  const [cat_juz, setCat_juz] = useState([]);
  const [cat_gravedad, setCat_gravedad] = useState([]);
  const [cat_emision, setEmision] = useState([]);
  const [bloqueo, setBloqueo] = useState(false);
  const [datosGuardados, setDatosGuardados] = useState('');

  const [errors, setErrors] = useState({});
  const [llave, setLlave] = useState('');
  const [emisor, setEmisor] = useState('');

  const [ministerial, setMinisterial] = useState({
    FECHA_ACTUALIZACION:"",
    HORA:"",
    LLAVE:"",
    ORDEN_MINISTERIAL: "",
    AGENCIA: "",
    TURNO: "",
    NO_MP: "",
    NOMBREMP: "",
    PATERNO_MP: "",
    MATERNO_MP: "",
    NO_CONVALIDACION_JUEZ: "",
    AV_PREVIA: "",
    FECHA_INICIO: "",
    FECHA_TERMINO: "",
    CARPETA_INV: "",
    HORA_INICIO: "",
    HORA_FIN: "",
    FECHA_CONVALIDACION: "",
    JUZGADO_ACREDITACION: "",
    JUEZ_ACREDITACION: "",
    RAZON_EMISOR: "",
    DELITO_TIPO: "",
    GRAVEDAD: "",
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

   setMinisterial((prevMinisterial) => ({
   ...prevMinisterial,
   LLAVE: desencriptado1,
   ID_EMISOR: desencriptado2
   }));
   }
   }, [location.search]);


  console.log("ministerial variable llave",llave)
  console.log("ministerial variable emisor",emisor)


  useEffect(() => {
    if (llave) { // Verificar si llave tiene un valor asignado
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8081/ministerial/archivos/${llave}`
          );
          if (response.data.length > 0) {
            setBloqueo(true);
            setDatosGuardados(response.data);
          }
        } catch (error) {
          console.error("Error al obtener la información:", error);
        }
      };
      fetchData();
    }
  }, [llave]); // Agregar llave como una dependencia para que el efecto se vuelva a ejecutar cuando llave cambie
  
  
  


  useEffect(() => {
    fetch("http://localhost:8081/ministerial/idRazon")
      .then((data) => data.json())
      .then((val) => setEmision(val));
  }, []);

  /*
  useEffect(() => {
    fetch("http://localhost:8081/ministerial/idjuzgadoacreditacion")
      .then((data) => data.json())
      .then((val) => setCat_juzgados(val));
  }, []);*/


  useEffect(() => {
    fetch(`http://localhost:8081/datos-generales/idjuzgado`)
      .then((data) => data.json())
      .then((val) => setCat_juz(val));
  }, []);





  useEffect(() => {
    fetch("http://localhost:8081/ministerial/idgravedad")
      .then((data) => data.json())
      .then((val) => setCat_gravedad(val));
  }, []);

  
 

   
  const handleChange = (e) => {
    //formatoDia()
    const { name, value } = e.target;
    setMinisterial((prev) => ({ ...prev, [name]: value.trim() }));
  };

    const handleClick = async (e) => {   
    e.preventDefault();
    const validationErrors = validarMinisterial(ministerial);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 ) {  
    try {      
    await axios.post("http://localhost:8081/ministerial/insministerialtemp", ministerial);        
    alert("El nuevo registro ha sido guardado correctamente ");


    console.log('critar1',llave)
    console.log('critar2',emisor)
    const kunci = llave.toString();
    const pemancar = emisor.toString();
    const cla = "001";
    
    const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
    const dat_e = CryptoJS.AES.encrypt(pemancar, cla).toString();        
    const url = `/menu_opc?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;        
  
   
    navigate(url);
    
   
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
      console.log(fecha)
    setFechaActual(fecha);
    setMinisterial((prevRegistro) => ({
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
    
   console.log("objeto ministerial",ministerial)
  
    const handleClickMenu = () => {
    console.log('critar1',llave)
    console.log('critar2',emisor)
    const kunci = llave.toString();
    const pemancar = emisor.toString();
    const cla = "001";
    
    const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
    const dat_e = CryptoJS.AES.encrypt(pemancar, cla).toString();        
    const url = `/menu_opc?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_e)}`;        
  
   
    navigate(url);
    };

    console.log("datos guardados",datosGuardados)

  return (
    <>
      <Titulo></Titulo>

      <div className="contenedor_ministerial">       
        <div className="contenedor_pri_min">
          <div className="row">
            <div className="mb-12 row">
           
              <h3>Ministerial</h3>
              <div className="barraMin"></div>
          
              <div>
                {bloqueo ? (
                  <>
                  <div>
                    <p id="mensajeMin">Este componente ya contiene información.</p>

                    {/* <Link to={`/menu_opc/`} className="btn btn-info">
                      Regresar
                    </Link>    */}
                    
                  </div>

                  {datosGuardados.map((dato, index) => (
                   <div className="datosMinisterial">
                      
                       <div className="mb-3 row">
                          <div className="col-sm-4"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">ORDEN MINISTERIAL</span>
                           <input type="text"  value={dato.ORDEN_MINISTERIAL} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                          <div className="col-sm-4"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">AGENCIA</span>
                           <input type="text" value={dato.AGENCIA} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>
                         
                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">TURNO</span>
                           <input type="text" value={dato.TURNO} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                       </div>  
                         
                       <div className="mb-3 row">
                          <div className="col-sm-4"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">N° MINISTERIO PUBLICO</span>
                           <input type="text" value={dato.NO_MP}className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                          <div className="col-sm-4"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">NOMBRE DEL M. P.</span>
                           <input type="text" value={dato.NOMBREMP} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>
                         
                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">PATERNO</span>
                           <input type="text" value={dato.PATERNO_MP} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                       </div>  

                       <div className="mb-3 row">
                          <div className="col-sm-4"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">MATERNO</span>
                           <input type="text" value={dato.MATERNO_MP} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                          <div className="col-sm-4"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">CONVALIDACION</span>
                           <input type="text" value={dato.NO_CONVALIDACION_JUEZ} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>
                         
                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">FECHA DE INICIO</span>
                           <input type="text" value={dato.FECHA_INICIO} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                       </div>  
                       <div className="mb-3 row">
                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">FECHA TERMINO</span>
                           <input type="text" value={dato.FECHA_TERMINO} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                          <div className="col-sm-4"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">AV. PREVIA</span>
                           <input type="text" value={dato.AV_PREVIA} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>
                         
                          <div className="col-sm-4"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">CARPETA DE INV.</span>
                           <input type="text" value={dato.CARPETA_INV} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                       </div>  

                       <div className="mb-3 row">
                          <div className="col-sm-4"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">HORA INICIO</span>
                           <input type="text" value={dato.HORA_INICIO} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                          <div className="col-sm-4"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">HORA FIN</span>
                           <input type="text" value={dato.HORA_FIN} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>
                         
                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">FECHA CONVALID</span>
                           <input type="text" value={dato.FECHA_CONVALIDACION} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                       </div>  
                       
                       <div className="mb-3 row">
                          <div className="col-sm-4"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">JUZGADO ACREDITACION</span>
                           <input type="text" value={dato.JUZGADO_ACREDITACION} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                          <div className="col-sm-4"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">JUEZ ACREDITA</span>
                           <input type="text" value={dato.JUEZ_ACREDITACION} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>
                         
                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">RAZON EMISOR</span>
                           <input type="text" value={dato.RAZON_EMISOR} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                       </div>  

                       <div className="mb-3 row">
                          <div className="col-sm-4"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">TIPO DELITO</span>
                           <input type="text" value={dato.DELITO_TIPO} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>                          
                       </div>  
                   
                   <div className="col-sm-6 " >
                        <button type="submit" className="b-mini btn-primary" onClick={handleClickMenu}>
                            Ir al menu opcional
                          </button>
                          {/* <Link to={`/menu_opc/`} className="btn btn-info">
                            Menu opcional
                          </Link>   */}
                          
                        </div>
                   </div>
                       
                     ))}



                   </>
                ) : (
                  <form onSubmit={handleClick}>

                    <div className="mb-3 row">
                      <div className="col-sm-3">
                        <label className="form-label">ORDEN MINISTERIAL</label>
                        <input
                          type="text"
                          className="form-control"
                          id="ORDEN_MINISTERIAL"
                          name="ORDEN_MINISTERIAL"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                       {errors?.ORDEN_MINISTERIAL && <p style={{ color: "red", fontSize: "13px" }}>{errors.ORDEN_MINISTERIAL}</p>}  
                      </div>

                      <div className="col-sm-3">
                        <label className="form-label">AGENCIA</label>
                        <input
                          type="text"
                          className="form-control"
                          id="AGENCIA"
                          name="AGENCIA"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                        {errors?.AGENCIA && <p style={{ color: "red", fontSize: "13px" }}>{errors.AGENCIA}</p>} 
                      </div>

                      <div className="col-sm-3">
                        <label className="form-label">TURNO</label>
                        <input
                          type="text"
                          className="form-control"
                          id="TURNO"
                          name="TURNO"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                         {errors?.TURNO && <p style={{ color: "red", fontSize: "13px" }}>{errors.TURNO}</p>}
                      </div>


                      <div className="col-sm-3">
                        <label className="form-label">
                          N° MINISTERIO PUBLICO
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="NO_MP"
                          id="NO_MP"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                        {errors?.NO_MP && <p style={{ color: "red", fontSize: "13px" }}>{errors.NO_MP}</p>}
                      </div>

                    </div>

                    <div className="mb-3 row">
                        <div className="col-sm-3">
                        <label className="form-label">
                          NOMBRE DEL MINISTERIO PUBLICO
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="NOMBREMP"
                          id="NOMBREMP"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                        {errors?.NOMBREMP && <p style={{ color: "red", fontSize: "13px" }}>{errors.NOMBREMP}</p>}
                      </div>

                      <div className="col-sm-3">
                        <label className="form-label">
                          APELLIDO PATERNO DEL MINISTERIO PUBLICO
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="PATERNO_MP"
                          id="PATERNO_MP"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                         {errors?.PATERNO_MP && <p style={{ color: "red", fontSize: "13px" }}>{errors.PATERNO_MP}</p>}
                      </div>

                      <div className="col-sm-3">
                        <label className="form-label">
                          APELLIDO MATERNO DEL MP
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="MATERNO_MP"
                          id="MATERNO_MP"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                        {errors?.MATERNO_MP && <p style={{ color: "red", fontSize: "13px" }}>{errors.MATERNO_MP}</p>}
                      </div>
      

                      <div className="col-sm-3">
                        <label className="form-label">
                          N° CONVALIDACION DE JUEZ
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="NO_CONVALIDACION_JUEZ"
                          id="NO_CONVALIDACION_JUEZ"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                        {errors?.NO_CONVALIDACION_JUEZ && <p style={{ color: "red", fontSize: "13px" }}>{errors.NO_CONVALIDACION_JUEZ}</p>}
                      </div>
                      
                    </div>

                    <div className="mb-3 row">
                        <div className="col-sm-3">
                        <label className="form-label">AV. PREVIA</label>
                        <input
                          type="text"
                          className="form-control"
                          name="AV_PREVIA"
                          id="AV_PREVIA"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                         {errors?.AV_PREVIA && <p style={{ color: "red", fontSize: "13px" }}>{errors.AV_PREVIA}</p>}
                      </div>
                     

                      <div className="col-sm-3">
                        <label className="form-label">FECHA INICIO</label>
                        <input
                          type="date"
                          className="form-control"
                          name="FECHA_INICIO"
                          id="FECHA_INICIO"
                          placeholder=""
                          max={fechaActual}
                          onChange={handleChange}
                        ></input>
                        {errors?.FECHA_INICIO && <p style={{ color: "red", fontSize: "13px" }}>{errors.FECHA_INICIO}</p>}
                      </div>

                      <div className="col-sm-3">
                        <label className="form-label">FECHA TERMINO</label>
                        <input
                          type="date"
                          className="form-control"
                          name="FECHA_TERMINO"
                          id="FECHA_TERMINO"
                          placeholder=""
                          max={fechaActual}
                          onChange={handleChange}
                        ></input>
                         {errors?.FECHA_TERMINO && <p style={{ color: "red", fontSize: "13px" }}>{errors.FECHA_TERMINO}</p>}
                      </div>


                      <div className="col-sm-3">
                        <label className="form-label">
                          CARPETA DE INVESTIGACION
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="CARPETA_INV"
                          id="CARPETA_INV"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                        {errors?.CARPETA_INV && <p style={{ color: "red", fontSize: "13px" }}>{errors.CARPETA_INV}</p>}
                      </div>
                     
                    </div>


                    <div className="mb-3 row">
                    <div className="col-sm-2">
                        <label className="form-label">HORA INICIO</label>
                        <input
                          type="time"
                          className="form-control"
                          name="HORA_INICIO"
                          id="HORA_INICIO"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                        {errors?.HORA_INICIO && <p style={{ color: "red", fontSize: "13px" }}>{errors.HORA_INICIO}</p>}
                      </div>







                      <div className="col-sm-2">
                        <label className="form-label">HORA FIN</label>
                        <input
                          type="time"
                          className="form-control"
                          name="HORA_FIN"
                          id="HORA_FIN"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                         {errors?.HORA_FIN && <p style={{ color: "red", fontSize: "13px" }}>{errors.HORA_FIN}</p>}
                      </div>



                      <div className="col-sm-2">
                        <label className="form-label">
                          FECHA DE CONVALIDACION
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="FECHA_CONVALIDACION"
                          id="FECHA_CONVALIDACION"
                          placeholder=""
                          onChange={handleChange}
                          max={fechaActual}
                        ></input>
                        {errors?.FECHA_CONVALIDACION && <p style={{ color: "red", fontSize: "13px" }}>{errors.FECHA_CONVALIDACION}</p>}
                      </div>

                      <div className="col-sm-2">
                        <label className="form-label">
                          JUZGADO DE ACREDITACION
                        </label>
                        <select
                          type="text"
                          className="form-control"
                          name="JUZGADO_ACREDITACION"
                          id="JUZGADO_ACREDITACION"
                          placeholder=""
                          onChange={handleChange}
                        >
                          <option disabled selected>
                            Juzgados de acreditacion
                          </option>
                          {cat_juz.map((j) => (
                         <option key={j.ID_JUZGADO} value={j.CLAVE_JUZGADO}>
                             {j.DESCRIP_JUZGADO}
                         </option>
                  ))}
                        </select>
                        {errors?.JUZGADO_ACREDITACION && <p style={{ color: "red", fontSize: "13px" }}>{errors.JUZGADO_ACREDITACION}</p>}
                      </div>

                      <div className="col-sm-4">
                        <label className="form-label">
                          NOMBRE DEL JUEZ QUE ACREDITA
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="JUEZ_ACREDITACION"
                          name="JUEZ_ACREDITACION"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                         {errors?.JUEZ_ACREDITACION && <p style={{ color: "red", fontSize: "13px" }}>{errors.JUEZ_ACREDITACION}</p>}
                      </div>
                     
                    </div>

                    <div className="mb-3 row" id="ultimos_inp">
                      <div className="col-sm-2">
                        <label className="form-label">
                          RAZON PARA LA EMISION
                        </label>
                        <select
                          type="text"
                          className="form-control"
                          name="RAZON_EMISOR"
                          id="RAZON_EMISOR"
                          placeholder=""
                          onChange={handleChange}
                        >
                           <option disabled selected >
                            Selecciona una opcion
                          </option>
                          {cat_emision.map((emision) => (
                            <option key={emision.id_razon} value={emision.tipo}>
                              {emision.tipo}
                            </option>
                          ))}

                        </select>
                        {errors?.RAZON_EMISOR && <p style={{ color: "red", fontSize: "13px" }}>{errors.RAZON_EMISOR}</p>}
                      </div>

                      <div className="col-sm-4">
                        <label className="form-label">TIPO DELITO</label>
                        <input
                          type="text"
                          className="form-control"
                          id="DELITO_TIPO"
                          name="DELITO_TIPO"
                          placeholder=""
                          onChange={handleChange}
                        ></input>
                        {errors?.DELITO_TIPO && <p style={{ color: "red", fontSize: "13px" }}>{errors.DELITO_TIPO}</p>}
                      </div>

                      <div className="col-sm-3">
                        <label className="form-label">GRAVEDAD</label>
                        <select
                          type="text"
                          className="form-control"
                          name="GRAVEDAD"
                          id="GRAVEDAD"
                          placeholder=""
                          onChange={handleChange}
                        >
                          <option disabled selected>
                            Gravedad
                          </option>
                          {cat_gravedad.map((gravedad) => (
                            <option key={gravedad.TIPO} value={gravedad.CLAVE}>
                              {gravedad.TIPO}
                            </option>
                          ))}
                        </select>
                        {errors?.GRAVEDAD && <p style={{ color: "red", fontSize: "13px" }}>{errors.GRAVEDAD}</p>}
                      </div>
                     
                    </div>

                   
                      <div className="mb-3 row">
                        <div className="col-sm-3">
                          <button type="submit" className="btn-regMin btn-primary">
                            Registrar
                          </button>
                        </div>
                        <div className="col-sm-3">
                        <button type="submit" className="btn-regMin btn-primary" onClick={handleClickMenu}>
                            Ir al menu opcional
                          </button>                                                 
                        </div>
                      </div>
                   


                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ministerial;
