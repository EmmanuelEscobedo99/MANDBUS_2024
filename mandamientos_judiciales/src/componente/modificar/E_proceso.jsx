import React, { useEffect, useState } from 'react';
import "../../../src/index.css";
import axios from 'axios';
import { FaCheck, FaEdit, FaSyncAlt } from 'react-icons/fa';

const E_proceso = ({ id }) => {
  const [datos, setDatos] = useState({
    fechaLibramiento: '',
    numeroProceso: '',
    numeroAveriguacion: '',
    fechaCaptura: '',
    fechaRecepcion: '',
    fechaPreInsc: '',
    fechaCumplimiento: '',
    oficioCumple: '',
    fechaCancelacion: '',
    oficioCancelacion: '',
    observaciones: '',
    carpetaInv: '',
    nombreEmisor: '',
    idEmisor: '',
    nombreFueroProceso: '',
    idFueroProceso: '',
    nombreTipoMandato: '',
    idTipoMandato: '',
    nombreMotivoCancelacion: '',
    idMotivoCancelacion: '',
    nombreProcesoExtradi: '',
    idProcesoExtradi: '',
    nombreTipoProceso: '',
    idTipoProceso: '',
    emisor: [],
    fueroProceso: [],
    tipoMandato: [],
    motivoCancelacion: [],
    tipoProceso: [],
    procesoExtradi: []
  });

  // Define el estado para manejar los mensajes de error
  const [errors, setErrors] = useState({
    noMandato: '',
    nombre: '',
    aPaterno: '',
    aMaterno: '',
    edad: '',
    // Agrega más campos de error según sea necesario
  });

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-proceso/getdatos/${id}`);
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          setDatos({
            ...datos,
            fechaLibramiento: new Date(data.FECHA_LIBRAMIENTO).toISOString().split('T')[0],
            numeroProceso: data.NO_PROCESO,
            numeroAveriguacion: data.NO_AVERIGUACION,
            fechaCaptura: new Date(data.FECHA_CAPTURA).toISOString().split('T')[0],
            fechaRecepcion: data.FECHA_RECEPCION.split('T')[0],
            fechaPreInsc: data.FECHA_PRESCRIPCION.split('T')[0],
            fechaCumplimiento: data.FECHA_CUMPLIMIENTO.split('T')[0],
            oficioCumple: data.OFICIO_CUMPLE,
            fechaCancelacion: data.FECHA_CANCELACION.split('T')[0],
            oficioCancelacion: data.OFICIO_CANCELACION,
            observaciones: data.OBSERVACIONES,
            carpetaInv: data.CARPETA_INV,
          });
        } else {
          console.error('Error: No se encontraron datos para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    const obtenerNombreEmisor = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-proceso/emisor/${id}`);
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreEmisor: response.data[0].TIPO,
            idEmisor: response.data[0].ID_EMISOR,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error);
      }
    };

    const obtenerNombreFueroProceso = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-proceso/fuero/${id}`);
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreFueroProceso: response.data[0].TIPO,
            idFueroProceso: response.data[0].CLAVE,
          }));
        } else {
          console.error('Error: No se encontró el tipo de proceso para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener el tipo de proceso:', error);
      }
    };

    const obtenerNombreTipoMandato = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-proceso/mandato/${id}`);
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreTipoMandato: response.data[0].TIPO,
            idTipoMandato: response.data[0].CLAVE,
          }));
        } else {
          console.error('Error: No se encontró el tipo de mandato para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener el tipo de mandato:', error);
      }
    };

    /*const obtenerNombreMotivoCancelacion = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-proceso/motivocancelacion/${id}`);
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreMotivoCancelacion: response.data[0].TIPO,
            idMotivoCancelacion: response.data[0].CLAVE,
          }));
        } else {
          console.error('Error: No se encontró el motivo de cancelación para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener el motivo de cancelación:', error);
      }
    };*/

    const obtenerNombreProcesoExtradi = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-proceso/procextradicion/${id}`);
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreProcesoExtradi: response.data[0].TIPO,
            idProcesoExtradi: response.data[0].CLAVE,
          }));
        } else {
          console.error('Error: No se encontró el proceso de extradición para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener el proceso de extradición:', error);
      }
    };

    const obtenerNombreTipoProceso = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-proceso/tipoproceso/${id}`);
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreTipoProceso: response.data[0].TIPO,
            idTipoProceso: response.data[0].CLAVE,
          }));
        } else {
          console.error('Error: No se encontró el tipo de proceso para el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener el tipo de proceso:', error);
      }
    };

    obtenerDatos();
    obtenerNombreEmisor();
    obtenerNombreFueroProceso();
    obtenerNombreTipoMandato();
    //obtenerNombreMotivoCancelacion();
    obtenerNombreProcesoExtradi();
    obtenerNombreTipoProceso();
  }, [id]);

  useEffect(() => {
    const obtenerEmisor = async () => {
      try {
        const responseEmisor = await axios.get("http://localhost:8081/e-proceso/getcatemisor");
        if (responseEmisor.data && responseEmisor.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            emisor: responseEmisor.data,
          }));
        } else {
          console.error('Error: No se encontraron emisores');
        }
      } catch (error) {
        console.error('Error al obtener emisores:', error);
      }
    };

    const obtenerFueroProceso = async () => {
      try {
        const responseFuero = await axios.get("http://localhost:8081/e-proceso/getcatfuero");
        if (responseFuero.data && responseFuero.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            fueroProceso: responseFuero.data,
          }));
        } else {
          console.error('Error: No se encontraron fueros de proceso');
        }
      } catch (error) {
        console.error('Error al obtener fueros de proceso:', error);
      }
    };

    const obtenerTipoMandato = async () => {
      try {
        const responseTipoMandato = await axios.get("http://localhost:8081/e-proceso/getcatmandato");
        if (responseTipoMandato.data && responseTipoMandato.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            tipoMandato: responseTipoMandato.data,
          }));
        } else {
          console.error('Error: No se encontraron tipos de mandato');
        }
      } catch (error) {
        console.error('Error al obtener tipos de mandato:', error);
      }
    };

    const obtenerMotivoCancelacion = async () => {
      try {
        const responseMotivoCancelacion = await axios.get("http://localhost:8081/e-proceso/getcatmotivocancelacion");
        if (responseMotivoCancelacion.data && responseMotivoCancelacion.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            motivoCancelacion: responseMotivoCancelacion.data,
          }));
        } else {
          console.error('Error: No se encontraron motivos de cancelación');
        }
      } catch (error) {
        console.error('Error al obtener motivos de cancelación:', error);
      }
    };

    const obtenerTipoProceso = async () => {
      try {
        const responseTipoProceso = await axios.get("http://localhost:8081/e-proceso/getcattipoproceso");
        if (responseTipoProceso.data && responseTipoProceso.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            tipoProceso: responseTipoProceso.data,
          }));
        } else {
          console.error('Error: No se encontraron tipos de proceso');
        }
      } catch (error) {
        console.error('Error al obtener tipos de proceso:', error);
      }
    };

    const obtenerProcesoExtradi = async () => {
      try {
        const responseProcesoExtradi = await axios.get("http://localhost:8081/e-proceso/getcatprocextradicion");
        if (responseProcesoExtradi.data && responseProcesoExtradi.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            procesoExtradi: responseProcesoExtradi.data,
          }));
        } else {
          console.error('Error: No se encontraron procesos de extradición');
        }
      } catch (error) {
        console.error('Error al obtener procesos de extradición:', error);
      }
    };

    obtenerEmisor();
    obtenerFueroProceso();
    obtenerTipoMandato();
    obtenerMotivoCancelacion();
    obtenerTipoProceso();
    obtenerProcesoExtradi();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDatos({
      ...datos,
      [name]: value,
    });
    validateField(name, value);
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setDatos({
      ...datos,
      [name]: value,
    });
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let errorMessage = '';

    // Realiza la validación según el campo y asigna el mensaje de error correspondiente
    switch (fieldName) {
      case 'fechaLibramiento':
        const fechaActual = new Date();
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const año = fechaActual.getFullYear();
        const fechaFormateada = `${dia}/${mes}/${año}`;

        let errorMessageFechaActual = '';
        let errorMessageFechaCumplimiento = '';
        let errorMessagePreInsc = '';
        let errorMessageCancelacion = '';
        let errorMessageRecepcion = '';

        if (new Date(datos.fechaLibramiento) > fechaActual) {
          errorMessageFechaActual = 'La fecha de libramiento no puede ser mayor a la fecha actual.';
        }

        if (datos.fechaLibramiento > datos.fechaCumplimiento) {
          errorMessageFechaCumplimiento = 'La fecha de libramiento no puede ser mayor a la fecha de cumplimiento.';
        }

        if (datos.fechaLibramiento > datos.fechaPreInsc) {
          errorMessagePreInsc = 'La fecha de libramiento no puede ser mayor a la fecha preinscripcion';
        }

        if (datos.fechaLibramiento > datos.fechaCancelacion) {
          errorMessageCancelacion = 'La fecha de libramiento no puede ser mayor a la fecha cancelacion';
        }

        if (datos.fechaLibramiento > datos.fechaRecepcion) {
          errorMessageRecepcion = 'La fecha de libramiento no puede ser mayor a la fecha recepcion';
        }

        // Concatenar los mensajes de error si es necesario
        errorMessage = errorMessageFechaActual + ' ' + errorMessageFechaCumplimiento + ' ' + errorMessagePreInsc + ' ' + errorMessageCancelacion + ' ' + errorMessageRecepcion;

        break;
      case 'numeroProceso':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Número de proceso" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Número de proceso" no puede terminar en espacio.'
        }
        break;
      case 'numeroAveriguacion':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Número de averiguación" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Número de averiguación" no puede terminar en espacio.'
        }
        break;
      case 'oficioCumple':
        if (value) {
          errorMessage = 'El campo "Oficio cumplimiento" debe ser nulo para este proceso'
        }
        break;
      case 'fechaPreInsc':
        if (value) {
          errorMessage = 'El campo "Fecha preinscripcion" debe ser nulo para este proceso'
        }
        break;
      case 'fechaCumplimiento':
        if (value) {
          errorMessage = 'El campo "Fecha de cumplimiento" debe ser nulo para este proceso'
        }
        break;
      case 'oficioCancelacion':
        if (value) {
          errorMessage = 'El campo "Oficio de cancelacion" debe ser nulo para este proceso'
        }
        break;
      case 'fechaCancelacion':
        if (value) {
          errorMessage = 'El campo "Fecha de cancelacion" debe ser nulo para este proceso'
        }
        break;
      case 'idMotivoCancelacion':
        if (value) {
          errorMessage = 'El campo "Motivo de cancelación" debe ser nulo para este proceso'
        }
      case 'carpetaInv':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Carpeta de investigacion" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Carpeta de investigacion" no puede terminar en espacio.'
        }
        break;
      case 'observaciones':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Observaciones" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Observaciones" no puede terminar en espacio.'
        }
        break;
      default:
        // No se encontró ninguna validación para el campo
        console.warn(`Validación no definida para el campo: ${fieldName}`);
    }

    // Actualiza el estado de errores con el nuevo mensaje de error
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: errorMessage }));

  };


  const handleUpdateProceso = async () => {
    // Verifica si hay errores antes de intentar actualizar los datos
    if (Object.values(errors).some(error => error !== '')) {
      alert("No puedes guardar porque existen errores !!");
    } else {
      try {
        const response = await axios.put(`http://localhost:8081/e-proceso/actualizar/${id}`, datos);
        alert('Datos actualizados correctamente!');
      } catch (error) {
        console.error('Error al actualizar los datos:', error);
      }
    }
  };

  return (
    <>
      <div className="mb-12 row">
        <h3 style={{color:'black'}}>Edicion Proceso</h3>
        <div className='table-container form'>
          <div className='mb-3 row'>
            <div className="col-sm-2">
              <label className="form-label">fecha libramiento</label>
              <input type="date" className="form-control" id="FECHA_LIBRAMIENTO" name="fechaLibramiento" placeholder="" value={datos.fechaLibramiento} onChange={handleChange}></input>
              <span className="error-message">{errors.fechaLibramiento}</span>
            </div>
            <div className="col-sm-2">
              <label className="form-label">Fuero proceso</label>
              {datos.nombreFueroProceso && datos.nombreFueroProceso.length > 0 && (
                <select
                  name="idFueroProceso"
                  id="ID_FUERO_PROCESO"
                  className="form-select"
                  value={datos.idFueroProceso}
                  onChange={handleSelectChange}>
                  <option selected value="">{datos.nombreFueroProceso}</option>
                  {datos.fueroProceso.map(fuero => (
                    <option key={fuero.CLAVE} value={fuero.CLAVE}>{fuero.TIPO}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="col-sm-2">
              <label className="form-label">Tipo de mandato</label>
              {datos.nombreTipoMandato && datos.nombreTipoMandato.length > 0 && (
                <select
                  name="idTipoMandato"
                  id='ID_TIPO_MANDATO'
                  className="form-select"
                  value={datos.idTipoMandato}
                  onChange={handleSelectChange}>
                  <option selected value="">{datos.nombreTipoMandato}</option>
                  {datos.tipoMandato.map(mandato => (
                    <option key={mandato.CLAVE} value={mandato.CLAVE}>{mandato.TIPO}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="col-sm-2">
              <label className="form-label">Numero de proceso</label>
              <input type="text" className="form-control" id="NO_PROCESO" name="numeroProceso" placeholder="" value={datos.numeroProceso} onChange={handleChange}></input>
              <span className="error-message">{errors.numeroProceso}</span>
            </div>
          </div>
        </div>
        <div className="mb-3 row">


        </div>
        <div className='table-container form'>
          <div className="mb-3 row">
            <div className="col-sm-2">
              <label className="form-label">Numero de averiguacion</label>
              <input type="text" className="form-control" id="NO_AVERIGUACION" name="numeroAveriguacion" placeholder="" value={datos.numeroAveriguacion} onChange={handleChange}></input>
              <span className="error-message">{errors.numeroAveriguacion}</span>
            </div>
            <div className="col-sm-2">
              <label className="form-label">Fecha de recepcion</label>
              <input type="date" className="form-control" id="FECHA_RECEPCION" name="fechaRecepcion" placeholder="" value={datos.fechaRecepcion} onChange={handleChange}></input>
            </div>
            <div className="col-sm-2">
              <label className="form-label">Fecha de captura</label>
              <input type="date" className="form-control" id="FECHA_CAPTURA" name="fechaCaptura" placeholder="" value={datos.fechaCaptura} onChange={handleChange}></input>
            </div>
          </div>
        </div>
        <div className='table-container form'>
          <div className='mb-3 row'>
            <div className="col-sm-2">
              <label className="form-label">Carpeta de investigacion</label>
              <input type="text" className="form-control" id="CARPETA_INV" name="carpetaInv" placeholder="" value={datos.carpetaInv} onChange={handleChange}></input>
              <span className="error-message">{errors.carpetaInv}</span>
            </div>
            <div className="col-sm-2">
              <label className="form-label">Observaciones</label>
              <input type="text" className="form-control" id="OBSERVACIONES" name="observaciones" placeholder="" value={datos.observaciones} onChange={handleChange}></input>
              <span className="error-message">{errors.observaciones}</span>
            </div>
            <div className="col-sm-3">
              <label className="form-label">Tipo de proceso</label>
              {datos.nombreTipoProceso && datos.nombreTipoProceso.length > 0 && (
                <select
                  name="idTipoProceso"
                  id='ID_TIPO_PROCESO'
                  className="form-select"
                  value={datos.idTipoProceso}
                  onChange={handleSelectChange}>
                  <option selected value="">{datos.nombreTipoProceso}</option>
                  {datos.tipoProceso.map(tipo => (
                    <option key={tipo.CLAVE} value={tipo.CLAVE}>{tipo.TIPO}</option>
                  ))}
                </select>
              )}

            </div>
            <div className="col-sm-2">
              <label className="form-label">Proceso de extradicion</label>
              {datos.nombreProcesoExtradi && datos.nombreProcesoExtradi.length > 0 && (
                <select
                  name="idProcesoExtradi"
                  id='ID_PROCESO_EXTRADI'
                  className="form-select"
                  value={datos.idProcesoExtradi}
                  onChange={handleSelectChange}>
                  <option selected value="">{datos.nombreProcesoExtradi}</option>
                  {datos.procesoExtradi.map(proc => (
                    <option key={proc.CLAVE} value={proc.CLAVE}>{proc.TIPO}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <button className='btn btn-success' onClick={handleUpdateProceso}><FaCheck className='mr-2' /></button>
        </div>
      </div>

    </>
  );
};

export default E_proceso;
