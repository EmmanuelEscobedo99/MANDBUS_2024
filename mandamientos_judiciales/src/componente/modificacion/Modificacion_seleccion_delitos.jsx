import React, { useState, useEffect } from 'react';
import "../styles/seleccion_modificacion.css";
import { useSearchParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Modificacion_seleccion_delitos = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const encryptedData = searchParams.get('v1');
    const secretKey = "001";

    const [datosSeleccionados, setDatosSeleccionados] = useState(null);  
    const [delitosModificado, setDelitosModificado] = useState({
        ID_ALTERNA:"",
        LLAVE: "",    
        HORA:"",   
        ID_DELITO: "",
        ID_MODALIDAD: "",
        ID_DELITO_EXT:"",
        FECHA_ACTUALIZACION:""
    });

    const [descripcion, setDescripcion] = useState("");
    const [llaveInicio, setLlaveInicio] = useState("");
    const [emisorIni, setEmisorIni] = useState("");

    useEffect(() => {
        if (encryptedData) {
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
                const jsonString = bytes.toString(CryptoJS.enc.Utf8);
                const datosSeleccionados = JSON.parse(jsonString);
                setDatosSeleccionados(datosSeleccionados);
                console.log(" recuperado", datosSeleccionados) 
                setLlaveInicio(datosSeleccionados.idLlave)
                setEmisorIni(datosSeleccionados.EmisorInicio)                
                setDelitosModificado((prevDelitosModificado) => ({
                    ...prevDelitosModificado,
                    ID_ALTERNA:datosSeleccionados.idAlternaModificar|| "",
                    LLAVE: datosSeleccionados.idLlave|| "",
                    ID_EMISOR: datosSeleccionados.EmisorInicio|| "",
                    ID_DELITO_EXT: datosSeleccionados.idDelitoExt|| "",
                    ID_DELITO: datosSeleccionados.id_delito|| "",
                    ID_MODALIDAD: datosSeleccionados.id_modalidad || ""
                    
                }));
            } catch (error) {
                console.error("Error al desencriptar los datos:", error);
            }
        }
    }, [encryptedData]);


     console.log("llave para modificar el delito",llaveInicio)
     console.log("emisor desde el inicio",emisorIni)

    const [cat_delitos, setCat_delitos] = useState([]);
    const [options2, setOptions2] = useState([]); 
    const [selectedOption1, setSelectedOption1] = useState("");
    const [selectedOption2, setSelectedOption2] = useState("");
    const [fechaActual, setFechaActual] = useState('');

    useEffect(() => {
        fetch("http://localhost:8081/delitos/iddelitos")
          .then((data) => data.json())
          .then((val) => setCat_delitos(val));
    }, []);

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
            setDelitosModificado((prevDelitosModificado) => ({
              ...prevDelitosModificado,
              ID_DELITO: clave // Actualiza el ID_DELITO con el valor seleccionado
            }));
          })
          .catch((error) => {
            console.error(
              "Error al obtener las opciones del segundo select:",
              error
            );
          });
    };

    const handleSelect2Change = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption2(selectedValue);
        setDelitosModificado((prevDelitosModificado) => ({
          ...prevDelitosModificado,
          ID_MODALIDAD: selectedValue // Actualiza el ID_MODALIDAD con el valor seleccionado
        }));
    };
      
    //   **************************************************************************
    console.log("enviaR *******", delitosModificado)
    const handleClickModificar = () => {         
        axios
        .post(`http://localhost:8081/modificacion/modif-del`, delitosModificado)
        .then((response) => {
            console.log("objeto enviado", delitosModificado)
            alert("El Registro ha sido modificado")             
            
            const LLAVE= llaveInicio
            const EmisorInicio=emisorIni
            console.log('critar1',LLAVE)    
            const kunci = LLAVE.toString();  
            const sor=EmisorInicio.toString();  
            const cla = "001";    
            const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
            const dat_D = CryptoJS.AES.encrypt(sor, cla).toString();         
            const url = `/compo_mod?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_D)}`;        
          
          navigate(url);                  
        })
        .catch((error) => {
          console.error("Hubo un error al modificar el registro:", error);
        });
    };



    
    
    const handleClickCancelar = () => {  
        const LLAVE= llaveInicio
        const EmisorInicio=emisorIni
        console.log('critar1',LLAVE)    
        const kunci = LLAVE.toString();  
        const sor=EmisorInicio.toString();  
        const cla = "001";    
        const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
        const dat_D = CryptoJS.AES.encrypt(sor, cla).toString();         
        const url = `/compo_mod?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_D)}`;

     // const url = `/compo_mod?v1=${encodeURIComponent(dat_l)}`;            
        navigate(url);        
    };

    const formatoDia = () => {
        const today = new Date();
        let dia = today.getDate();
        if (dia < 10) dia = '0' + dia.toString();
        let mes = today.getMonth() + 1;
        if (mes < 10) mes = '0' + mes.toString();
        let ano = today.getFullYear();
        const fecha = ano + "-" + mes + "-" + dia;
      
        let hora = today.getHours();
        if (hora < 10) hora = '0' + hora.toString();
        let minutos = today.getMinutes();
        if (minutos < 10) minutos = '0' + minutos.toString();
        const horaActual = hora + ":" + minutos;

        console.log(horaActual);
        console.log(fecha);

        setFechaActual(fecha);
        setDelitosModificado((prevDelitos) => ({
            ...prevDelitos,
            FECHA_ACTUALIZACION: fecha,
            HORA: horaActual
        }));
    };
      
    useEffect(() => {
        formatoDia();
        const intervalId = setInterval(formatoDia, 60000); // Actualizar cada minuto (60000 milisegundos)
        return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonta
    }, []);  

    console.log("objeto hasta ahorita......", delitosModificado);

    return (
        <>
            <div className='edicion_componente_seleccion'>
                <div className='componente_seleccion'>
                    <h1 className='titulo-del-sel'>Modificación del Delito seleccionado</h1>
                    {datosSeleccionados ? (
                        <>
                            <h5 className='subtit-del-sel'>Delito seleccionado </h5>
                            <p>Delito: {datosSeleccionados.idDelitoExt}</p>
                            <p>Descripción Delito: {datosSeleccionados.id_delitoDescripcion}</p>
                            <p>Descripción Modalidad: {datosSeleccionados.modalidadDescripcion}</p>
                        </>
                    ) : (
                        <p>No hay datos seleccionados.</p>
                    )}

                    <h5 className='subtit-del-sel'>Selecciona el nuevo delito</h5>
    
                    <div className="modificcion-del-sel">
                        <div className="delitos-modificacion">
                            <div className="col-sm-10" id="input-mod-del">
                                <label className="form-label" id="input-modificacion">DELITO</label>
                                <select
                                    type="text"
                                    className="form-control"
                                    name="ID_DELITO"
                                    id="ID_DELITO"  
                                    onChange={handleSelect1Change} 
                                    value={selectedOption1}
                                >
                                    <option value="">Buscar delitos</option>
                                    {cat_delitos.map((delito) => (
                                        <option key={delito.CLAVE_DELITO} value={`${delito.ID_DELITO}|${delito.CLAVE_DELITO}|${delito.DESCRIP_DELITO}`}>
                                            {delito.DESCRIP_DELITO}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                           


                            <div className="col-sm-10" id="input-mod-del">
                                <label className="form-label" id="input-modificacion">MODALIDAD</label>
                                <select
                                    type="text"
                                    className="form-control"
                                    name="ID_MODALIDAD"
                                    id="ID_MODALIDAD"
                                    value={delitosModificado.ID_MODALIDAD}
                                    onChange={handleSelect2Change}
                                >
                                    <option value=" ">Modalidades</option>
                                    {options2.map((modalidad) => (
                                        <option
                                            key={modalidad.ID_MODALIDAD} value={modalidad.SIGLA_MODALIDAD}>
                                            {modalidad.DESCRIP_MODALIDAD}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="boton-mod-delito">                    
                                <button className="btn-mod-delagre" onClick={handleClickModificar}>Modificar Delito</button>
                                <button className="btn-can-delagre" onClick={handleClickCancelar}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>     
            </div>
        </>
    );
} 

export default Modificacion_seleccion_delitos;
