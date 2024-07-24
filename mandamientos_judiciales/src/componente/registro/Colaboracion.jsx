import Menu from "../menu/MenuLateral";
import Titulo from "../menu/Titulo";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../styles/colaboracion.css" 
import { validarColaboracion } from "./validacionProceso";
import CryptoJS from 'crypto-js'; 

const Colaboracion = () => {
    
  const navigate = useNavigate();
  
  const [llave, setLlave] = useState('');
  const [emisor, setEmisor] = useState('');
  const [errors, setErrors] = useState({});
  const [fechaActual, setFechaActual] = useState('');
  const [cat_gravedad, setCat_gravedad] = useState([])
  const [entidad, setEntidad] = useState([])
  const [razon, setRazon] = useState([])
  const [selectEmisor, setSelectEmisor] = useState([])
  const [colaboracion, setColaboracion] = useState({
    LLAVE:"",
    FECHA_ACTUALIZACION:"",
    HORA:"",  
    NUMERO_COLABORACION: "",
    NO_OFICIO: "",
    FECHA_OFICIO: "",
    FECHA_INICIO: "",
    FECHA_TERMINO: "",
    ID_ESTADO_COLABORA: "",
    ID_EMISOR_COLABORA: "",
    ACUERDO_CONVENIO: "",
    RAZON_COLABORACION: "",
    GRAVEDAD_CASO: "",
  });

  const [archivos, setArchivos] = useState('');



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

   setColaboracion((prevColaboracion) => ({
   ...prevColaboracion,
   LLAVE: desencriptado1,
   ID_EMISOR: desencriptado2
   }));
   }
   }, [location.search]);


  console.log("colaboracion variable llave",llave)
  console.log("colaboracion variable emisor",emisor)


  useEffect(() => {
    if (llave) {
        fetch(`http://localhost:8081/colaboracion/archivos/${llave}`)
            .then((data) => data.json())
            .then((val) => setArchivos(val))
            .catch((error) => {
                console.error("Error al obtener archivos:", error);
            });
    }
}, [llave]);





  useEffect(() => {
      fetch("http://localhost:8081/colaboracion/emisor")
      .then((data) => data.json())
      .then((val) => setSelectEmisor(val))
  }, [])


  useEffect(() => {
    fetch("http://localhost:8081/colaboracion/idgravedadcaso")
      .then((data) => data.json())
      .then((val) => setCat_gravedad(val))
  }, [])


  useEffect(() => {
    fetch("http://localhost:8081/colaboracion/edoCola")
      .then((data) => data.json())
      .then((val) => setEntidad(val))
  }, [])

  useEffect(() => {
    fetch("http://localhost:8081/colaboracion/razon")
      .then((data) => data.json())
      .then((val) => setRazon(val))
  }, [])


 

  
   

  const handleChange = (e) => {
    //formatoDia()
    const { name, value } = e.target;
    setColaboracion((prev) => ({ ...prev, [name]: value.trim() }));
  };
  


  const handleClick = async (e) => {   
    e.preventDefault();
    const validationErrors = validarColaboracion(colaboracion);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0 ) {  
    try {     

    axios.post("http://localhost:8081/colaboracion/inscolaboraciontemp", colaboracion);     
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




  /*
  const handleClick = (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:8081/colaboracion/inscolaboraciontemp", colaboracion);
      alert("El nuevo registro ha sido guardado correctamente ");
      navigate(`/MenuOpcional/${id}`);
    } catch (err) {
      console.error("Error al registrar:", err);
    }
  };             */


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
  setColaboracion((prevRegistro) => ({
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

console.log(colaboracion)
  return (
    <>
      <Titulo></Titulo>
      <div className="contenedor_colaboracion">
      <div>
            {archivos.length > 0 ? (
                <div>
                     <br></br>
                     <br></br>
                     <br></br>
                     <br></br>
                    <div className="mensaje">
                       <h4>Este componente ya contiene datos.</h4>
                    </div>
                    

                  
                    {archivos.map((dato, index) => (
                   <div className="datosColaboracion">
                      
                       <div className="mb-3 row">
                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">ORDEN MINISTERIAL</span>
                           <input type="text"  value={dato.NUMERO_COLABORACION} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">AGENCIA</span>
                           <input type="text" value={dato.NO_OFICIO} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>
                         
                          

                       </div>  


                       <div className="mb-3 row">
                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">TURNO</span>
                           <input type="text" value={dato.FECHA_OFICIO} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>
                        

                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">N° MINISTERIO PUBLICO</span>
                           <input type="text" value={dato.FECHA_INICIO}className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>                        
                        </div>

                         
                       <div className="mb-3 row">                        

                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">NOMBRE DEL M. P.</span>
                           <input type="text" value={dato.FECHA_TERMINO} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>
                         
                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">PATERNO</span>
                           <input type="text" value={dato.ACUERDO_CONVENIO} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                       </div>  

                       <div className="mb-3 row">
                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">MATERNO</span>
                           <input type="text" value={dato.RAZON_COLABORACION} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>

                          <div className="col-sm-3"> 
                           <div className=" input-group flex-nowrap lis-Datos" >
                           <span className="input-group-text" id="addon-wrapping">CONVALIDACION</span>
                           <input type="text" value={dato.GRAVEDAD_CASO} className="form-control"  aria-label="Username" aria-describedby="addon-wrapping" />
                           </div>
                          </div>
                            

                       </div>  
                       

                       
                       
                       

                       
                   
                   <div className="col-sm-6 " >
                        <button type="submit" className="btn-imo btn-primary" onClick={handleClickMenu}>
                            Ir al menu opcional
                          </button>
                          {/* <Link to={`/menu_opc/`} className="btn btn-info">
                            Menu opcional
                          </Link>   */}
                          
                        </div>
                   </div>
                       
                     ))}



                       

                </div>
            
              












            ) : (
                <>

          <div className="contenedor_prin_col">
          <div className="row"  id="cuadro-form">
            <div className="mb-12 row">
              <form onSubmit={handleClick}>
             
                <h3>COLABORACIÓN</h3>
                <div className="barra1"></div>
                <br />
                <br />

                <div className="row">
                <div className="col-sm-6">
                  <label className="form-label">Numero colaboracion </label>
                  <input
                    type="text"
                    className="form-control"
                    id="NUMERO_COLABORACION"
                    name="NUMERO_COLABORACION"
                    placeholder=""
                    onChange={handleChange}
                  ></input>
                  {errors?.NUMERO_COLABORACION && <p style={{ color: "red", fontSize: "13px" }}>{errors.NUMERO_COLABORACION}</p>}
                </div>

                <div className="col-sm-6">
                  <label className="form-label">N° de oficio</label>
                  <input
                    type="text"
                    className="form-control"
                    id="NO_OFICIO"
                    name="NO_OFICIO"
                    placeholder=""
                    onChange={handleChange}
                  ></input>
                  {errors?.NO_OFICIO && <p style={{ color: "red", fontSize: "13px" }}>{errors.NO_OFICIO}</p>}
                </div>
                </div>






                <div className="mb-3 row">
                  <div className="col-sm-3">
                    <label className="form-label">Fecha oficio</label>
                    <input
                      type="date"
                      className="form-control"
                      id="FECHA_OFICIO"
                      name="FECHA_OFICIO"
                      placeholder=""
                      onChange={handleChange}
                      max={fechaActual}
                    ></input>
                    {errors?.FECHA_OFICIO && <p style={{ color: "red", fontSize: "13px" }}>{errors.FECHA_OFICIO}</p>}
                  </div>

                  <div className="col-sm-3">
                    <label className="form-label">Fecha inicio</label>
                    <input
                      type="date"
                      className="form-control"
                      name="FECHA_INICIO"
                      id="FECHA_INICIO"
                      placeholder=""
                      onChange={handleChange}
                      max={fechaActual}
                    ></input>
                     {errors?.FECHA_INICIO && <p style={{ color: "red", fontSize: "13px" }}>{errors.FECHA_INICIO}</p>}
                  </div>

                  <div className="col-sm-3">
                    <label className="form-label">Fecha termino</label>
                    <input
                      type="date"
                      className="form-control"
                      name="FECHA_TERMINO"
                      id="FECHA_TERMINO"
                      placeholder=""
                      onChange={handleChange}
                      max={fechaActual}
                    ></input>
                    {errors?.FECHA_TERMINO && <p style={{ color: "red", fontSize: "13px" }}>{errors.FECHA_TERMINO}</p>}
                  </div>

                  <div className="col-sm-3">
                    <label className="form-label">
                      Estado con el que colabora
                    </label>
                    <select
                      type="text"
                      className="form-control"
                      name="ID_ESTADO_COLABORA"
                      id="ID_ESTADO_COLABORA"
                      placeholder=""
                      onChange={handleChange}
                    >
                      <option selected disabled value=" ">Selecione un estado</option>
                      {entidad.map((enti) => (
                        <option key={`${enti.ID_ESTADO}-${enti.ENTIDAD}`} value={enti.ID_ESTADO}>
                          {enti.ENTIDAD}
                        </option>
                      ))}

                    </select>
                     {errors?.ID_ESTADO_COLABORA && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_ESTADO_COLABORA}</p>}
                  </div>
                </div>
               
                <div className="mb-3 row">
                       
                  <div className="col-sm-3">
                    <label className="form-label">
                      Emisor con el que colabora
                    </label>
                    <select
                      type="text"
                      className="form-control"
                      id="ID_EMISOR_COLABORA"
                      name="ID_EMISOR_COLABORA"
                      placeholder=""
                      onChange={handleChange}
                    >
                     <option selected disabled value=" ">Selecione una opcion</option>
                      {selectEmisor.map((emisor) => (
                        <option key={emisor.ID_EMISOR} value={emisor.ID_EMISOR}>
                          {emisor.TIPO}
                        </option>
                      ))}






                    </select>
                    {errors?.ID_EMISOR_COLABORA && <p style={{ color: "red", fontSize: "13px" }}>{errors.ID_EMISOR_COLABORA}</p>} 
                  </div>           

                  <div className="col-sm-3">
                    <label className="form-label">Acuerdo convenio</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ACUERDO_CONVENIO"
                      id="ACUERDO_CONVENIO"
                      placeholder=""
                      onChange={handleChange}
                    ></input>
                     {errors?.ACUERDO_CONVENIO && <p style={{ color: "red", fontSize: "13px" }}>{errors.ACUERDO_CONVENIO}</p>} 
                  </div>

                  <div className="col-sm-3">
                    <label className="form-label">Razon de colaboracion</label>
                    <select
                      type="text"
                      className="form-control"
                      name="RAZON_COLABORACION"
                      id="RAZON_COLABORACION"
                      placeholder=""
                      onChange={handleChange}
                    >
                       <option selected disabled value=" ">Selecione una razon</option>
                      {razon.map((razon) => (
                        <option key={razon.id_razon} value={razon.id_razon}>
                          {razon.tipo}
                        </option>
                      ))}



                    </select>
                  {errors?.RAZON_COLABORACION && <p style={{ color: "red", fontSize: "13px" }}>{errors.RAZON_COLABORACION}</p>}   
                  </div>

                  <div className="col-sm-3">
                    <label className="form-label">Gravedad o peligrosidad</label>
                    <select
                      type="text"
                      className="form-control"
                      name="GRAVEDAD_CASO"
                      id="GRAVEDAD_CASO"
                      placeholder=""
                      onChange={handleChange}>

                      <option selected disabled value=" ">Selecione el estado de gravedad</option>
                      {cat_gravedad.map((gravedad) => (
                        <option key={gravedad.TIPO} value={gravedad.CLAVE}>
                          {gravedad.TIPO}
                        </option>
                      ))}
                    </select>
                    {errors?.GRAVEDAD_CASO && <p style={{ color: "red", fontSize: "13px" }}>{errors.GRAVEDAD_CASO}</p>}
                  </div>
                </div>

               
                  <div className="row">
                    <div className="col-sm-3">
                      <button type="submit" className="b-col btn-primary">
                        Registrar
                      </button>
                    </div>
                    <div className="col-sm-6">
                    <button type="submit" className="b-col btn-primary" onClick={handleClickMenu}>
                        Ir al menu opcional
                      </button>
                    </div>
                  </div>
              



              </form>
            </div>
          </div>
        </div>


                </>
            )}
        </div>





        


      </div>
    </>
  );
};

export default Colaboracion;
