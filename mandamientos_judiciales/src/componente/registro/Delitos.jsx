import React, { useState, useEffect } from "react";
import Menu from "../menu/MenuLateral";
import Titulo from "../menu/Titulo";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/delitos.css";
import CryptoJS from "crypto-js";
import { validarDelito } from "./validacion";
import Table from "react-bootstrap/Table";

const Delitos = () => {
  /* variables cifradas */
  const location = useLocation();
  const [llave, setLlave] = useState("");
  const [emisor, setEmisor] = useState("");
  const [registroRealizado, setRegistroRealizado] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const var1 = queryParams.get("v1");
    const var2 = queryParams.get("v2");
   

    if (var1 && var2) {
      const clave = "001"; // La misma clave utilizada para cifrar en el componente emisor
      const desencriptado1 = CryptoJS.AES.decrypt(var1, clave).toString(
        CryptoJS.enc.Utf8
      );
      const desencriptado2 = CryptoJS.AES.decrypt(var2, clave).toString(
        CryptoJS.enc.Utf8
      );
      

      setLlave(desencriptado1);
      setEmisor(desencriptado2);

      setDelitos((prevDelitos) => ({
        ...prevDelitos,
        LLAVE: desencriptado1,
        ID_EMISOR: desencriptado2,
      }));
    }
  }, [location.search]);

  const navigate = useNavigate();

  const [cat_delitos, setCat_delitos] = useState([]);
  const [cat_modalidad, setCat_modalidad] = useState([]);
  const [ultimoID, setUltimoID] = useState("");
  const [nid, setNid] = useState("");

  const [fechaActual, setFechaActual] = useState("");
  const [idAlterna, setIdAlterna] = useState("");
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [options1, setOptions1] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [archivos, setArchivos] = useState([]);

  const [descripcion, setDescripcion] = useState("");

  const [delitos, setDelitos] = useState({
    ID_ALTERNA: "",
    LLAVE: llave,
    ID_EMISOR: emisor,
    HORA: "",
    ID_DELITO: "",
    ID_MODALIDAD: "",
    FECHA_ACTUALIZACION: "",
  });
   



  console.log("objeto delitos",delitos)
  useEffect(() => {
    const fetchData = async () => {
      // Aquí actualizas el estado de delitos con los valores desencriptados
      if (llave && emisor) {
        setDelitos((prevDelitos) => ({
          ...prevDelitos,
          LLAVE: llave,
          ID_EMISOR: emisor,
        }));
      }
    };

    fetchData();
  }, [llave, emisor]);

  useEffect(() => {
    if (delitos.LLAVE) {
      tablaDelitos();
    }
  }, [delitos.LLAVE]);
  
  const tablaDelitos = () => {
    
    fetch(`http://localhost:8081/delitos/arctabla/${delitos.LLAVE}`)
      .then((data) => data.json())
      .then(async (val) => {
        const secondaryQueries = [];
        for (const archivo of val) {
          const firstSecondaryQueryPromise = fetch(
            `http://localhost:8081/delitos/delito/${archivo.ID_DELITO}`
          )
            .then((response) => response.json())
            .then((delito) => {
              archivo.delito = delito;
             
            });
  
          const secondSecondaryQueryPromise = fetch(
            `http://localhost:8081/delitos/modalidad/${archivo.ID_MODALIDAD}`
          )
            .then((response) => response.json())
            .then((modalidad) => {
              archivo.modalidad = modalidad;
             
            });
  
          secondaryQueries.push(
            firstSecondaryQueryPromise,
            secondSecondaryQueryPromise
          );
        }
  
        await Promise.all(secondaryQueries);
  
        setArchivos(val);
      })
      .catch((error) => {
        console.error("Error al obtener archivos:", error);
      });
  };
  
  

  useEffect(() => {
    fetch("http://localhost:8081/delitos/iddelitos")
      .then((data) => data.json())
      .then((val) => setCat_delitos(val));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDelitos((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleSelect1Change = (event) => {
    const selectedValue = event.target.value;
    const [id, clave,descripcion] = selectedValue.split("|");

    
    setDescripcion(descripcion)
    setSelectedOption1(id);
    axios
      .get(`http://localhost:8081/delitos/idmodalidad/${id}`)
      .then((response) => {
        setOptions2(response.data);
        setDelitos((prevDelitos) => ({
          ...prevDelitos,
          ID_DELITO: clave,
        }));
      })
      .catch((error) => {
        console.error(
          "Error al obtener las opciones del segundo select:",
          error
        );
      });
  };

  const handleClick = async () => {
    const errorDelitos = validarDelito(delitos.ID_DELITO);
    if (errorDelitos) {
      alert(errorDelitos);
      return;
    }

    if (!delitos.ID_MODALIDAD) {
      alert("Por favor selecciona una modalidad antes de continuar.");
      return;
    }

    let ultimoIdAlterna = 0;
    try {
      await axios.post("http://localhost:8081/delitos/insdelitostemp", delitos);
      alert(
        "El Delito ha sido guardado correctamente, pueder agregar mas delitos, o usar la opcion siguiente para continuar con el registro"
      );

      setSelectedOption1("");
      setSelectedOption2("");
      setDelitos((prevDelitos) => ({
        ...prevDelitos,
        ID_MODALIDAD: "",
      }));
      setDescripcion("")
      setRegistroRealizado(true);
      tablaDelitos();
    } catch (err) {
      console.error("Error al registrar:", err);
    }
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
    setDelitos((prevRegistro) => ({
      ...prevRegistro,
      FECHA_ACTUALIZACION: fecha,
      HORA: horaActual,
    }));
  };

  useEffect(() => {
    formatoDia();
  }, []);

 

  const handleClickTerminar = () => {
    console.log("critar1", llave);
    console.log("critar2", emisor);
    const kunci = llave.toString();
    const pemancar = emisor.toString();
    const cla = "001";
    const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
    const dat_e = CryptoJS.AES.encrypt(pemancar, cla).toString();
    const url = `/Proceso?v1=${encodeURIComponent(
      dat_l
    )}&v2=${encodeURIComponent(dat_e)}`;
    navigate(url);
  };

  return (
    <>
      <Titulo></Titulo>

      <div className="contenedor_del">



        <div className="contenedor_prcpl">
          <form>
            <h3> DELITOS </h3>
           
            <br></br>

            <div className="col-sm-8" id="input">
              <label className="form-label" id="input1">
                DELITO 
              </label>

                 <div className="delito-seleccionado">
                    
                  </div> 
                


              <select
                type="text"
                className="form-control"
                name="ID_DELITO"
                id="ID_DELITO"
                placeholder=""
                value={selectedOption1}
                onChange={handleSelect1Change}
              >
                <option value=" ">Buscar delito</option>
                {cat_delitos.map((delito) => (
                  <option
                    key={delito.CLAVE_DELITO}
                    value={`${delito.ID_DELITO}|${delito.CLAVE_DELITO}|${delito.DESCRIP_DELITO}` }
                  >
                    {delito.DESCRIP_DELITO}
                  </option>
                ))}
              </select>

               <div className="div-delselec">
               <h6 className="del-sel">Delito selecionado:   </h6>
               <p>{descripcion}</p>
               </div>
              


            </div>

            <div className="col-sm-8" id="input-mdldad">
              <label className="form-label" id="input2">
                MODALIDAD
              </label>
              <select
                type="text"
                className="form-control"
                name="ID_MODALIDAD"
                id="ID_MODALIDAD"
                placeholder=""
                value={delitos.ID_MODALIDAD}
                onChange={handleChange}>

                <option value=" ">Modalidades</option>
                {options2.map((modalidad) => (
                  <option
                    key={modalidad.ID_MODALIDAD}
                    value={modalidad.SIGLA_MODALIDAD}
                  >
                    {modalidad.DESCRIP_MODALIDAD}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-12">
              <button
                type="button"
                className="btn"
                id="btn"
                onClick={handleClick}
              >
                Registrar
              </button>

              <button
                type="button"
                className={`btn ${
                  registroRealizado || !archivos.length ? "" : "disabled"
                }`}
                id="btn"
                onClick={handleClickTerminar}
                disabled={!archivos.length}
              >
                Siguiente
              </button>
            </div>
          </form>
        </div>

        <div className="contenedor_del_lista">
          <h3 id="tex">DELITOS REGISTRADOS</h3>
          <br></br>
          <br></br>

          <div className="tabla">
            <br></br>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>DELITO</th>
                  <th>MODALIDAD</th>
                </tr>
              </thead>
              <tbody>
                {archivos.map((ar, index) => {
                 
                  return (
                    <tr key={index}>
                     <td>{ar.delito[0]?.DESCRIP_DELITO}</td>
                     <td>{ar.modalidad[0]?.DESCRIP_MODALIDAD}</td>
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

export default Delitos;

