import React, { useState, useEffect } from "react";
import "../styles/seleccion_modificacion.css";
import { useSearchParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Modificacion_delitos_agregar = () => {
  const navigate = useNavigate();


    const [searchParams] = useSearchParams();
    const encryptedData = searchParams.get('v1');
    const secretKey = "001";

  const [datosSeleccionados, setDatosSeleccionados] = useState(null);    
  const [cat_delitos, setCat_delitos] = useState([]);
  const [selectedOption1, setSelectedOption1] = useState("");
  const [idAlterna, setIdAlterna] = useState('');
  const [fechaActual, setFechaActual] = useState('');
  const [options2, setOptions2] = useState([]);
  const [llave, setLlave] = useState("");
  const [id_emisor, setId_emisor] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [delitos, setDelitos] = useState({
    ID_EMISOR: "",
    LLAVE: llave,   
    HORA: "",
    ID_DELITO: "",
    ID_MODALIDAD: "",
    FECHA_ACTUALIZACION: "",
  });

 
 

useEffect(() => {
    if (encryptedData) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
            const jsonString = bytes.toString(CryptoJS.enc.Utf8);
            const datosSeleccionados = JSON.parse(jsonString);
            setDatosSeleccionados(datosSeleccionados);

            console.log(" recuperado", datosSeleccionados)
  
            setDelitos((prevDelitos) => ({
                ...prevDelitos,
                LLAVE: datosSeleccionados.LLAVE|| "",
                ID_EMISOR: datosSeleccionados.ID_EMISOR|| "",                
                
            }));
        } catch (error) {
            console.error("Error al desencriptar los datos:", error);
        }
    }
}, [encryptedData]);


  console.log("mod delitos: emisor de inicio", delitos)

  const handleSelect1Change = (event) => {
    const selectedValue = event.target.value;
    const [id, clave,descripcion] = selectedValue.split('|');
    
    console.log("id deito",id)
    console.log("clave del delito ",clave)
    console.log("descripcion del delito ",descripcion)
    setDescripcion(descripcion)
    setSelectedOption1(selectedValue);

    axios
      .get(`http://localhost:8081/delitos/idmodalidad/${id}`)
      .then((response) => {
        setOptions2(response.data);
        setDelitos((prevDelitos) => ({
          ...prevDelitos,
          ID_DELITO: clave,  // Corregir aquí para solo almacenar el ID del delito
        }));
      })
      .catch((error) => {
        console.error(
          "Error al obtener las opciones del segundo select:",
          error
        );
      });
  };

  useEffect(() => {
    fetch("http://localhost:8081/delitos/iddelitos")
      .then((data) => data.json())
      .then((val) => setCat_delitos(val));
  }, []);


    //segundo valor

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDelitos((prev) => ({ ...prev, [name]: value.trim() }));
  };

  console.log("**** componente agregar nuevo delito  ****")
  console.log("**** llave  ", llave)
  console.log("**** id emisor  ", id_emisor)
  console.log("objeto delitos",delitos)
  



  /*
   // handle original
  const handleClick = async () => {
    let ultimoIdAlterna = 0;
    try {
      const response = await fetch("http://localhost:8081/delitos/ultimoIdAlterna");
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        ultimoIdAlterna = data[0].ultimo_id + 1;
        setIdAlterna(ultimoIdAlterna);
        console.log("La última ID alterna es:", ultimoIdAlterna);
        setDelitos((prevDelitos) => ({
          ...prevDelitos,
          ID_ALTERNA: ultimoIdAlterna,
        }));
      }
      await axios.post("http://localhost:8081/delitos/insdelitostemp", {
        ...delitos,
        ID_ALTERNA: ultimoIdAlterna,
      });
      alert("El Delito ha sido guardado correctamente");

      setSelectedOption1("");
      setOptions2([]);
      setDelitos((prevDelitos) => ({
        ...prevDelitos,
        ID_MODALIDAD: "",
      }));
      
     console.log("despues de registrar el delito mando la llave ", delitos.LLAVE," y el emisor ",delitos.ID_EMISOR)

      const llave = delitos.LLAVE
      console.log('critar1', llave)    
      const kunci = llave.toString();         
      const cla = "001";    
      const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();              
      const url = `/compo_mod?v1=${encodeURIComponent(dat_l)}`;         
      navigate(url);               

    } catch (err) {
      console.error("Error al registrar:", err);
    }
  };       */


  const handleClick = async () => {
    if (!delitos.ID_DELITO ) {
      alert("DELITO  no pueden estar vacío");
      return;
    }
    if (!delitos.ID_MODALIDAD) {
      alert("MODALIDAD no pueden estar vacío");
      return;
    }
    let ultimoIdAlterna = 0;
    try {      
      await axios.post("http://localhost:8081/delitos/insdelitosMod", delitos);
      alert("El Delito ha sido guardado correctamente");
      setSelectedOption1("");
      setOptions2([]);
      setDelitos((prevDelitos) => ({
        ...prevDelitos,
        ID_MODALIDAD: "",
      }));
      
     console.log("despues de registrar el delito mando la llave ", delitos.LLAVE," y el emisor ",delitos.ID_EMISOR)
           
      const LLAVE= delitos.LLAVE
      const EmisorInicio=delitos.ID_EMISOR
      console.log('critar1',LLAVE)    
      const kunci = LLAVE.toString();  
      const sor=EmisorInicio.toString();  
      const cla = "001";    
      const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
      const dat_D = CryptoJS.AES.encrypt(sor, cla).toString();         
      const url = `/compo_mod?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_D)}`;
      navigate(url);               

    } catch (err) {
      console.error("Error al registrar:", err);
    }
  };    


  console.log("ID emisor A ENVIAR ", delitos.LLAVE)
  console.log("LLAVE A ENVIAR",delitos.ID_EMISOR)
  





  const handleClickTerminar = () => {
    const LLAVE= delitos.LLAVE
      const EmisorInicio=delitos.ID_EMISOR
      console.log('critar1',LLAVE)    
      const kunci = LLAVE.toString();  
      const sor=EmisorInicio.toString();  
      const cla = "001";    
      const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
      const dat_D = CryptoJS.AES.encrypt(sor, cla).toString();         
      const url = `/compo_mod?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_D)}`;

    navigate(url);
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
  
    setFechaActual(fecha);  
    setDelitos((prevRegistro) => ({
      ...prevRegistro,
      FECHA_ACTUALIZACION: fecha,
      HORA: horaActual
     }));  
     };
  
  useEffect(() => {
    formatoDia();     
  }, []);   
   console.log(fechaActual)


  return (
    <>
      <div className="componente_mod-del-agregar">
        <div className="agregar_reg_modificacion">
          <h1 className="titulo-del-agregar">
            Agregar un nuevo Delito {llave}
          </h1>

          <div className="cont_agregar_del">
            <form>
              <div className="col-sm-8" id="input">
                <label className="form-label" id="input1">
                  DELITO
                </label>
                <select
                  type="text"
                  className="form-control"
                  name="ID_DELITO"
                  id="ID_DELITO"
                  placeholder=""
                  value={delitos.ID_DELITO}
                  onChange={handleSelect1Change}>

                  <option value=" ">Buscar delito</option>
                  {cat_delitos.map((delito) => (
                    <option key={delito.CLAVE_DELITO} value={`${delito.ID_DELITO}|${delito.CLAVE_DELITO}|${delito.DESCRIP_DELITO}` }>
                      {delito.DESCRIP_DELITO}
                    </option>
                  ))}
                </select>
              </div>


                <div className="delito-seleccionado-select">
                  <p>selecionaste:{"  "}{descripcion} </p>
                </div>



              <div className="col-sm-8" id="input">
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
                  onChange={handleChange}
                >
                  <option value=" ">Modalidades</option>
                  {options2.map((modalidad) => (
                    <option
                      key={modalidad.ID_MODALIDAD} value={modalidad.SIGLA_MODALIDAD} >
                      {modalidad.DESCRIP_MODALIDAD}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-sm-12" id="botones_ctrl_reg">
                <button
                  type="button"
                  className="btn_regis_mod"
                  id="btn-control-reg"
                  onClick={handleClick}
                >
                  Registrar Delito
                </button>

                <button
                  type="button"
                  className="reg_salir"
                  id="btn-control-reg"
                  onClick={handleClickTerminar}
                >
                  Salir
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modificacion_delitos_agregar;

