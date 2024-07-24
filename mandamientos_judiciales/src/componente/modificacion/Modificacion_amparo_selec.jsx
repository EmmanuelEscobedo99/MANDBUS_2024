import React, { useState, useEffect } from 'react';
import "../styles/seleccion_modificacion.css";
import { useSearchParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Modificacion_amparo_selec = () => {
    const navigate = useNavigate();
    const [fechaActual, setFechaActual] = useState('');
    const [amparoProcesado, setAmparoProcesado] = useState('');
    const [datosSeleccionados, setDatosSeleccionados] = useState(null);
    const [searchParams] = useSearchParams();
    const encryptedData = searchParams.get('v1');
    const secretKey = "001";

    const [amparoModificado, setAmparoModificado] = useState({
        ID_ALTERNA: "",
        LLAVE: "",
        HORA: "",
        FECHA_ACTUALIZACION: "",
        ID_AMPARO_EXT: "",
        FECHA_AMPARO: "",
        ID_ESTADO_JUZ: "",
        ID_JUZGADO: "",
        ID_RESOLUCION: ""
    });

    const [detallesAmparo, setDetallesAmparo] = useState({
        estadoJuzgado: '',
        juzgado: '',
        resolucion: '',
        tipo: ''
    });

    const [cat_entidades, setCat_entidades] = useState([]);
    const [cat_juzgados, setCat_juzgados] = useState([]);
    const [cat_resolucion, setCat_resolucion] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8081/amparos/idestadoemisor")
            .then((data) => data.json())
            .then((val) => setCat_entidades(val));
    }, []);

    useEffect(() => {
        if (amparoModificado.ID_ESTADO_JUZ) {
            fetch(`http://localhost:8081/amparos/idjuzgado/${amparoModificado.ID_ESTADO_JUZ}`)
                .then((data) => data.json())
                .then((val) => setCat_juzgados(val))
                .catch((error) => console.error("Error fetching juzgados:", error));
        }
    }, [amparoModificado.ID_ESTADO_JUZ]);

    useEffect(() => {
        fetch("http://localhost:8081/amparos/idresolucion")
            .then((data) => data.json())
            .then((val) => setCat_resolucion(val));
    }, []);

    const [llaveInicio, setLlaveInicio] = useState("");
    const [emisorIni, setEmisorIni] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (encryptedData) {
                try {
                    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
                    const jsonString = bytes.toString(CryptoJS.enc.Utf8);
                    const datosSeleccionados = JSON.parse(jsonString);
                    setDatosSeleccionados(datosSeleccionados);
                    console.log("Recuperado", datosSeleccionados);

                    setLlaveInicio(datosSeleccionados.idLlave);
                    setEmisorIni(datosSeleccionados.EmisorInicio);

                    const estadoJuzgadoResponse = await axios.get(`http://localhost:8081/modificacion/amparos-edojuz/${datosSeleccionados.ID_ESTADO_JUZ}`);
                    const juzgadoResponse = await axios.get(`http://localhost:8081/modificacion/amparos-juz/${datosSeleccionados.ID_JUZGADO}`);
                    const resolucionResponse = await axios.get(`http://localhost:8081/modificacion/amparos-resol/${datosSeleccionados.ID_RESOLUCION}`);
                    const tipoResponse = await axios.get(`http://localhost:8081/modificacion/amparos-tipo/${datosSeleccionados.ID_TIPO_AMPARO}`);

                    const estadoJuzgado = estadoJuzgadoResponse.data.length > 0 ? estadoJuzgadoResponse.data[0].ENTIDAD : null;
                    const juzgado = juzgadoResponse.data.length > 0 ? juzgadoResponse.data[0].DESCRIP_JUZGADO : null;
                    const resolucion = resolucionResponse.data.length > 0 ? resolucionResponse.data[0].TIPO : null;
                    const tipo = tipoResponse.data.length > 0 ? tipoResponse.data[0].TIPO : null;

                    setDetallesAmparo({
                        estadoJuzgado: estadoJuzgado,
                        juzgado: juzgado,
                        resolucion: resolucion,
                        tipo: tipo
                    });

                    setAmparoModificado((prevAmparoModificado) => ({
                        ...prevAmparoModificado,
                        ID_ALTERNA: datosSeleccionados.ID_ALTERNA || "",
                        LLAVE: datosSeleccionados.LLAVE || "",
                        ID_EMISOR: datosSeleccionados.EmisorInicio || "",
                        ID_AMPARO_EXT: datosSeleccionados.ID_AMPARO_EXT || "",
                        ID_TIPO_AMPARO: datosSeleccionados.ID_TIPO_AMPARO || "",
                        NO_AMPARO: datosSeleccionados.NO_AMPARO || "",
                        FECHA_AMPARO: datosSeleccionados.FECHA_AMPARO || "",
                        ID_ESTADO_JUZ: datosSeleccionados.ID_ESTADO_JUZ || "",
                        ID_JUZGADO: datosSeleccionados.ID_JUZGADO || "",
                        ID_RESOLUCION: datosSeleccionados.ID_RESOLUCION || ""
                    }));
                } catch (error) {
                    console.error("Error al desencriptar los datos:", error);
                }
            }
        };

        fetchData();
    }, [encryptedData]);

    useEffect(() => {
        if (amparoModificado.ID_ALTERNA) {
            console.log("Valor de id alterna", amparoModificado.ID_ALTERNA);
            fetch(`http://localhost:8081/amparos/veri_procesado/${amparoModificado.ID_ALTERNA}`)
                .then((data) => data.json())
                .then((val) => setAmparoProcesado(val));
        }
    }, [amparoModificado.ID_ALTERNA]);

    const [isModificarDisabled, setIsModificarDisabled] = useState(true);

    useEffect(() => {
        if (amparoProcesado) {
            console.log("El valor de procesado de este registro es: ", amparoProcesado[0].PROCESADO);
            setIsModificarDisabled(amparoProcesado[0].PROCESADO !== 2);
        }
    }, [amparoProcesado]);

    const handleClickModificar = () => {
        axios
            .post(`http://localhost:8081/modificacion/modificar-amparo`, amparoModificado)
            .then((response) => {
                alert("El Registro ha sido modificado");

                const LLAVE = llaveInicio;
                const EmisorInicio = emisorIni;
                console.log('Cifrar1', LLAVE);
                const kunci = LLAVE.toString();
                const sor = EmisorInicio.toString();
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
        const LLAVE = llaveInicio;
        const EmisorInicio = emisorIni;
        console.log('Cifrar1', LLAVE);
        const kunci = LLAVE.toString();
        const sor = EmisorInicio.toString();
        const cla = "001";
        const dat_l = CryptoJS.AES.encrypt(kunci, cla).toString();
        const dat_D = CryptoJS.AES.encrypt(sor, cla).toString();
        const url = `/compo_mod?v1=${encodeURIComponent(dat_l)}&v2=${encodeURIComponent(dat_D)}`;
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
        setAmparoModificado((prevDelitos) => ({
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

    const handleChangeResolucion = (e) => {
        setAmparoModificado({
            ...amparoModificado,
            ID_RESOLUCION: e.target.value
        });
    }

    const handleChangeJuzgado = (e) => {
        setAmparoModificado({
            ...amparoModificado,
            ID_JUZGADO: e.target.value
        });
    }

    const handleChangeEstado = (e) => {
        setAmparoModificado({
            ...amparoModificado,
            ID_ESTADO_JUZ: e.target.value
        });
    }

    return (
        <>
            <div className='edicion_componente_sel_amp'>
                <div className='componente_seleccion_amp'>
                    <h1 className='titulo-amp-sel'>Modificación del Amparo seleccionado</h1>
                    <div className='datos-amp'>
                        {datosSeleccionados ? (
                            <>
                                <h5 className='subtit-del-sel'>Datos no modificables</h5>
                                <div className='datos-sel-amp'>
                                    <p>Amparo seleccionado: {amparoModificado.ID_AMPARO_EXT}</p>
                                    <p>Tipo de amparo: {detallesAmparo.tipo}</p>
                                    <p>Número de amparo: {amparoModificado.NO_AMPARO}</p>
                                    <p>Fecha de Amparo: {amparoModificado.FECHA_AMPARO}</p>
                                </div>
                            </>
                        ) : (
                            <p>No hay datos seleccionados.</p>
                        )}
                    </div>

                    <h5 className='subtit-amp-sel'>Modificación del amparo</h5>
                    <div className="amp-modificacion">
                        <div className="row" id='sub-titulos-tabla'>
                            <div className="col-sm-6">
                                <label className="form-label">Datos registrados</label>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label">Campos para la modificación</label>
                            </div>
                        </div>

                        {/* Entidad del Juzgado */}
                        <div className="mb-3 row">
                            <div className="col-sm-6">
                                <label className="form-label">Entidad registrada del Juzgado que emitió el amparo</label>
                                <input
                                    disabled
                                    type="text"
                                    className="form-control"
                                    value={detallesAmparo.estadoJuzgado}
                                ></input>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label">Modificar el estado del juzgado</label>
                                <select
                                    type="text"
                                    className="form-control"
                                    name="ID_ESTADO_JUZ"
                                    onChange={handleChangeEstado}
                                    value={amparoModificado.ID_ESTADO_JUZ}
                                >
                                    <option value="">Seleccione el estado del juzgado</option>
                                    {cat_entidades.map((entidad) => (
                                        <option key={entidad.ID_ESTADO} value={entidad.ID_ESTADO}>
                                            {entidad.ENTIDAD}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Juzgado */}
                        <div className="mb-3 row">
                            <div className="col-sm-6">
                                <label className="form-label">Juzgado registrado</label>
                                <input
                                    disabled
                                    type="text"
                                    className="form-control"
                                    value={detallesAmparo.juzgado}
                                ></input>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label">Modificar el nuevo Juzgado</label>
                                <select
                                    type="text"
                                    className="form-control"
                                    name="ID_JUZGADO"
                                    onChange={handleChangeJuzgado}
                                    value={amparoModificado.ID_JUZGADO}
                                >
                                    <option value="">Seleccione un Juzgado</option>
                                    {cat_juzgados.map((juzgados) => (
                                        <option key={juzgados.ID_JUZGADO} value={juzgados.ID_JUZGADO}>
                                            {juzgados.DESCRIP_JUZGADO}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Resolución */}
                        <div className="mb-3 row">
                            <div className="col-sm-6">
                                <label className="form-label">Resolución registrada</label>
                                <input
                                    disabled
                                    type="text"
                                    className="form-control"
                                    value={detallesAmparo.resolucion}
                                ></input>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label">Modificar la resolución</label>
                                <select
                                    type="text"
                                    className="form-control"
                                    name="ID_RESOLUCION"
                                    onChange={handleChangeResolucion}
                                    value={amparoModificado.ID_RESOLUCION}
                                >
                                    <option value="">Resoluciones</option>
                                    {cat_resolucion.map((res) => (
                                        <option key={res.CLAVE} value={res.CLAVE}>
                                            {res.TIPO}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="botones-mod-amp">
                            <button className="btn-modificar-amp" onClick={handleClickModificar} disabled={isModificarDisabled}>Modificar Amparo</button>
                            <button className="btn-regresar-amp" onClick={handleClickCancelar}>Regresar</button>
                        </div>

                        {isModificarDisabled && (
                         <div className="mensaje-desabilitado">
                            El botón "Modificar Amparo" está deshabilitado porque el amparo no está procesado.
                         </div>
                        )}



                    </div>
                </div>
            </div>
        </>
    );
};

export default Modificacion_amparo_selec;
























