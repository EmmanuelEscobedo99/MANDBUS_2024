import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import "../styles/modificaciones.css";
import { useNavigate } from "react-router-dom";

const Modificacion_Proceso = ({ llave, datos, emisorEncriptado }) => {
  const navigate = useNavigate();
  const nombre = datos[0].NOMBRE;
  const apaterno = datos[0].APATERNO;
  const amaterno = datos[0].AMATERNO;
  const of_juz = datos[0].OFICIO_JUZGADO;

  const [registroProceso, setRegistroProceso] = useState(null);

  const [modificacionProceso, setModificacionProceso] = useState({
    ID_EMISOR :"",
    FECHA_ACTUALIZACION: "",
    HORA: "",
    FECHA_LIBRAMIENTO: "",
    FUERO: "",
    PROCESO_EXTRADICION: "",
    TIPO_PROCESO: "",
    LLAVE: llave,
  });

  const [fechaLibramiento, setFechaLibramiento] = useState(null);
  const [fuero, setFuero] = useState(null);
  const [proceso_ext, setProceso_ext] = useState(null);
  const [tipoProceso, setTipo_Proceso] = useState(null);

  const [consultaFuero, setConsultaFuero] = useState(null);
  const [consultaProcExt, setConsultaProcExt] = useState(null);
  const [consultaTipoPro, setConsultaTipoPro] = useState(null);

  const [cat_fuero, setCat_fuero] = useState([]);
  const [cat_ProcExtrad, setCat_ProcExtrad] = useState([]);
  const [cat_TipoProceso, setCat_TipoProceso] = useState([]);

  const [fechaActual, setFechaActual] = useState("");

  console.log("objeto modificacion ", modificacionProceso)
 
  const [emisorInicio, setEmisorInicio] = useState("");
  useEffect(() => {
    if (emisorEncriptado) {
      const clave = "001";
      const desencriptado = CryptoJS.AES.decrypt(emisorEncriptado, clave).toString(CryptoJS.enc.Utf8);
      setEmisorInicio(desencriptado);     
    }
  }, [emisorEncriptado]);


  useEffect(() => {
         if (emisorInicio) {
         console.log("proceso emisor desde inicio:", emisorInicio);
          }
  }, [emisorInicio]);



  useEffect(() => {
  if (emisorInicio && modificacionProceso.ID_EMISOR !== emisorInicio) {
    setModificacionProceso((prevModificacionProceso) => ({
      ...prevModificacionProceso,
      ID_EMISOR: emisorInicio,
    }));
  }
}, [emisorInicio]);
  
  



  useEffect(() => {
    fetch("http://localhost:8081/proceso/idfueroproceso")
      .then((data) => data.json())
      .then((val) => setCat_fuero(val));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8081/proceso/idprocextradicion")
      .then((data) => data.json())
      .then((val) => setCat_ProcExtrad(val));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8081/proceso/idtipoproceso")
      .then((data) => data.json())
      .then((val) => setCat_TipoProceso(val));
  }, []);

  useEffect(() => {
    if (llave) {
      fetch(`http://localhost:8081/modificacion/proceso/${llave}`)
        .then((data) => data.json())
        .then((val) => {
          setRegistroProceso(val);
        })
        .catch((error) => {
          console.error("Error al obtener el registro de proceso:", error);
        });
    }
  }, [llave]);

  useEffect(() => {
    if (fuero) {
      axios
        .get(`http://localhost:8081/modificacion/proc_fuero/${fuero}`)
        .then((response) => {
          const respuesta = response.data;
          setConsultaFuero(respuesta[0].TIPO);
        })
        .catch((error) => {
          console.error("Error al obtener datos:", error);
        });
    }
  }, [fuero]);

  useEffect(() => {
    if (proceso_ext) {
      axios
        .get(`http://localhost:8081/modificacion/proc_ext/${proceso_ext}`)
        .then((response) => {
          const respuesta = response.data;
          setConsultaProcExt(respuesta[0].TIPO);
        })
        .catch((error) => {
          console.error("Error al obtener datos:", error);
        });
    }
  }, [proceso_ext]);

  useEffect(() => {
    if (tipoProceso) {
      axios
        .get(`http://localhost:8081/modificacion/proc_tipo/${tipoProceso}`)
        .then((response) => {
          const respuesta = response.data;
          setConsultaTipoPro(respuesta[0].TIPO);
        })
        .catch((error) => {
          console.error("Error al obtener datos:", error);
        });
    }
  }, [tipoProceso]);

  
  useEffect(() => {
    if (registroProceso) {
      setFechaLibramiento(registroProceso[0].FECHA_LIBRA);
      setFuero(registroProceso[0].ID_FUERO_PROCESO);
      setProceso_ext(registroProceso[0].ID_PROCESO_EXTRADI);
      setTipo_Proceso(registroProceso[0].ID_TIPO_PROCESO);

      setModificacionProceso((prev) => ({
        ...prev,
        FECHA_LIBRAMIENTO: registroProceso[0].FECHA_LIBRA,
        FUERO: registroProceso[0].ID_FUERO_PROCESO,
        PROCESO_EXTRADICION: registroProceso[0].ID_PROCESO_EXTRADI,
        TIPO_PROCESO: registroProceso[0].ID_TIPO_PROCESO,
      }));
    }
  }, [registroProceso]);             

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModificacionProceso({
      ...modificacionProceso,
      [name]: value,
    });
  };

  const handleEnviarModificacion = (e) => {
    e.preventDefault(); // Prevent form submission
    axios
      .post(`http://localhost:8081/modificacion/modif-proceso/`, modificacionProceso)
      .then((response) => {
        alert("Se ha modificado este proceso...");
        console.log("Respuesta del servidor:", response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error al enviar la modificación:", error);
      });
  };

  const formatoDia = () => {
    const today = new Date();
    let dia = today.getDate();
    if (dia < 10) dia = "0" + dia.toString();
    let mes = today.getMonth() + 1;
    if (mes < 10) mes = "0" + mes.toString();
    let ano = today.getFullYear();
    const fecha = ano + "-" + mes + "-" + dia;

    let hora = today.getHours();
    if (hora < 10) hora = "0" + hora.toString();
    let minutos = today.getMinutes();
    if (minutos < 10) minutos = "0" + minutos.toString();
    const horaActual = hora + ":" + minutos;

    setFechaActual(fecha);
    setModificacionProceso((prevModificacionProceso) => ({
      ...prevModificacionProceso,
      FECHA_ACTUALIZACION: fecha,
      HORA: horaActual,
    }));
  };

  useEffect(() => {
    formatoDia();
    const intervalId = setInterval(formatoDia, 60000); // Actualizar cada minuto (60000 milisegundos)
    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonta
  }, []);

  return (
    <>
      <div className="componente-proceso">
        <div className="datos-nmod-proceso">
          <br></br>
          <br></br>
          <div className="row" id="lista-campos">
            <h5>Datos no modificables</h5>
            <div className="col-10">
              <label className="form-label">NOMBRE</label>
              <input
                disabled
                type="text"
                className="form-control"
                name="AMATERNO"
                id="AMATERNO"
                placeholder=""
                defaultValue={nombre}
              />
            </div>

            <div className="col-10">
              <label className="form-label">A. PATERNO</label>
              <input
                disabled
                type="text"
                className="form-control"
                name="ALIAS"
                id="ALIAS"
                placeholder=""
                defaultValue={apaterno}
              />
            </div>

            <div className="col-10">
              <label className="form-label">A. MATERNO</label>
              <input
                disabled
                type="text"
                className="form-control"
                name="ALIAS"
                id="ALIAS"
                placeholder=""
                defaultValue={amaterno}
              />
            </div>

            <div className="col-10">
              <label className="form-label">OFICIO JUZGADO</label>
              <input
                disabled
                type="text"
                className="form-control"
                name="ALIAS"
                id="ALIAS"
                placeholder=""
                defaultValue={of_juz}
              />
            </div>
          </div>
        </div>
        <div className="datos-lista-proceso">
         <br></br>
         <br></br>
          <div className="modf-proc-titulo">
            <div className="mod-titulo">
              <h4>Datos Registrados</h4>
            </div>
            <div className="mod-titulo2">
              <h4>Editar Registro</h4>
            </div>
          </div>

          <div className="row" id="campo-modificacion-centro">
            <div className="mb-12 row">
              <form>
                <div className="mb-3 row">
                  <div className="col-sm-6">
                    <label className="form-label">FECHA LIBRAMIENTO</label>
                    <input
                      disabled
                      type="text"
                      className="form-control"
                      id=""
                      name=""
                      placeholder=""
                      defaultValue={fechaLibramiento}
                    ></input>
                  </div>

                  <div className="col-sm-6">
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
                  </div>
                </div>

                <div className="mb-3 row">
                  <div className="col-sm-6">
                    <label className="form-label">FUERO</label>
                    <input
                      disabled
                      type="text"
                      className="form-control"
                      id="FECHA_LIBRAMIENTO"
                      name="FECHA_LIBRAMIENTO"
                      placeholder=""
                      defaultValue={consultaFuero}
                    ></input>
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">FUERO</label>
                    <select
                      type="text"
                      className="form-control"
                      name="FUERO"
                      id="FUERO"
                      placeholder=""
                      onChange={handleChange}
                    >
                      <option selected disabled value=" ">
                        Seleccione una opción
                      </option>
                      {cat_fuero.map((fuero) => (
                        <option key={fuero.TIPO} value={fuero.CLAVE}>
                          {fuero.TIPO}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3 row">
                  <div className="col-sm-6">
                    <label className="form-label">PROCESO EXTRADICION</label>
                    <input
                      disabled
                      type="text"
                      className="form-control"
                      name="ID_PROCESO_EXTRADI"
                      id="ID_PROCESO_EXTRADI"
                      defaultValue={consultaProcExt}
                    ></input>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">PROCESO EXTRADICION</label>
                    <select
                      type="text"
                      className="form-control"
                      name="PROCESO_EXTRADICION"
                      id=""
                      placeholder=""
                      onChange={handleChange}
                    >
                      <option selected disabled value=" ">
                        Seleccione una opcion de proceso
                      </option>
                      {cat_ProcExtrad.map((extradicion) => (
                        <option key={extradicion.TIPO} value={extradicion.CLAVE}>
                          {extradicion.TIPO}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3 row">
                  <div className="col-sm-6">
                    <label className="form-label">TIPO DE PROCESO</label>
                    <input
                      disabled
                      type="text"
                      className="form-control"
                      name="ID_PROCESO_EXTRADI"
                      id="ID_PROCESO_EXTRADI"
                      defaultValue={consultaTipoPro}
                    ></input>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">TIPO DE PROCESO</label>
                    <select
                      type="text"
                      className="form-control"
                      name="TIPO_PROCESO"
                      id="TIPO_PROCESO"
                      placeholder=""
                      onChange={handleChange}
                    >
                      <option selected disabled value=" ">
                        Seleccione el tipo de proceso
                      </option>
                      {cat_TipoProceso.map((tipoProc) => (
                        <option key={tipoProc.TIPO} value={tipoProc.CLAVE}>
                          {tipoProc.TIPO}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="mb-3 row">
                    <div className="col-sm-6">
                      <button
                        type="button"
                        className="btn-modif-reg"
                        onClick={handleEnviarModificacion}
                      >
                        Modificar Registro
                      </button>
                    </div>
                    <div className="col-sm-6"></div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modificacion_Proceso;
