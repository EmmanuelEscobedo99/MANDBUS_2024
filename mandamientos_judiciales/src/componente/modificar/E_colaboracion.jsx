import React, { useState, useEffect } from 'react'
import "../../../src/index.css"
import axios from 'axios'
import { FaCheck, FaEdit, FaSyncAlt } from 'react-icons/fa';


const E_colaboracion = ({ id }) => {

  const [datos, setDatos] = useState({
    numeroColaboracion: '',
    noOficio: '',
    fechaOficio: '',
    fechaInicio: '',
    fechaTermino: '',
    acuerdoConvenio: '',
    razonColaboracion: '',
    //gravedadCaso: '',
    nombreEstadoEmisor: '',
    idEstadoEmisor: '',
    nombreEmisor: '',
    idEmisor: '',
    nombreEstadoColaboracion: '',
    idEstadoColaboracion: '',
    nombreEmisorColaboracion: '',
    idEmisorColaboracion: '',
    nombreGravedadCaso: '',
    idGravedadCaso: '',

    estadoEmisor: [],
    emisor: [],
    estadoColaboracion: [],
    emisorColaboracion: [],
    gravedadCaso: []
  })

  // Define el estado para manejar los mensajes de error
  const [errors, setErrors] = useState({
    fechaOficio: '',
    fechaInicio: '',
    fechaTermino: '',
    // Agrega más campos de error según sea necesario
  });


  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-colaboracion/getdatos/${id}`)
        if (response.data && response.data.length > 0) {
          const data = response.data[0]
          setDatos({
            ...datos,
            numeroColaboracion: data.NUMERO_COLABORACION,
            noOficio: data.NO_OFICIO,
            fechaOficio: new Date(data.FECHA_OFICIO).toISOString().split('T')[0],
            fechaInicio: new Date(data.FECHA_INICIO).toISOString().split('T')[0],
            fechaTermino: new Date(data.FECHA_TERMINO).toISOString().split('T')[0],
            acuerdoConvenio: data.ACUERDO_CONVENIO,
            razonColaboracion: data.RAZON_COLABORACION,
            //gravedadCaso: data.GRAVEDAD_CASO
          })
        } else {
          console.error('Error: No se encontraron datos para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    }

    const obtenerNombreEstadoEmisor = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-colaboracion/entidades/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreEstadoEmisor: response.data[0].ENTIDAD,
            idEstadoEmisor: response.data[0].ID_ESTADO,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
        }
      } catch (error) {  
        console.error('Error al obtener el nombre del emisor:', error)
      }
    }

    const obtenerNombreEmisor = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-colaboracion/emisor/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreEmisor: response.data[0].TIPO, 
            idEmisor: response.data[0].ID_EMISOR,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error)
      }
    }

    const obtenerNombreEstadoEmisorColabora = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-colaboracion/entidadescolabora/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreEstadoColaboracion: response.data[0].ENTIDAD,
            idEstadoColaboracion: response.data[0].ID_ESTADO,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error)
      }
    }

    const obtenerNombreEmisorColabora = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-colaboracion/emisorcolabora/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreEmisorColaboracion: response.data[0].TIPO,
            idEmisorColaboracion: response.data[0].ID_INSTITUCION,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error)
      }
    }

    const obtenerNombreGravedad = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-colaboracion/gravedad/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreGravedadCaso: response.data[0].TIPO,
            idGravedadCaso: response.data[0].CLAVE,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error)
      }
    }

    obtenerDatos();
    obtenerNombreEstadoEmisor();
    obtenerNombreEmisor();
    obtenerNombreEstadoEmisorColabora();
    obtenerNombreEmisorColabora();
    obtenerNombreGravedad();
  }, [id])

  useEffect(() => {
    const obtenerEntidades = async () => {
      try {
        const responseEntidades = await axios.get("http://localhost:8081/e-colaboracion/getcatentidades");
        if (responseEntidades.data && responseEntidades.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            estadoEmisor: responseEntidades.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    const obtenerEmisor = async () => {
      try {
        const responseEmisor = await axios.get("http://localhost:8081/e-colaboracion/getcatemisor");
        if (responseEmisor.data && responseEmisor.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            emisor: responseEmisor.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    const obtenerEntidadesColabora = async () => {
      try {
        const responseEntidadesColabora = await axios.get("http://localhost:8081/e-colaboracion/getcatentidadescolabora");
        if (responseEntidadesColabora.data && responseEntidadesColabora.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            estadoColaboracion: responseEntidadesColabora.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    const obtenerNombreEmisorColabora = async () => {
      try {
        const responseEmisorColabora = await axios.get("http://localhost:8081/e-colaboracion/getcatemisorcolabora");
        if (responseEmisorColabora.data && responseEmisorColabora.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            emisorColaboracion: responseEmisorColabora.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    const obtenerListaGravedad = async () => {
      try {
        const responseGravedad = await axios.get("http://localhost:8081/e-colaboracion/getcatgravedad");
        if (responseGravedad.data && responseGravedad.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            gravedadCaso: responseGravedad.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    obtenerEntidades();
    obtenerEmisor();
    obtenerEntidadesColabora();
    obtenerNombreEmisorColabora();
    obtenerListaGravedad();
  }, [])

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

    // Validar que el campo no esté vacío
    if (value.trim() === '') {
      errorMessage = 'Este campo no puede estar vacío.';
    }

    // Realiza la validación según el campo y asigna el mensaje de error correspondiente
    switch (fieldName) {
      case 'fechaOficio':
        const fechaActual = new Date();
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const año = fechaActual.getFullYear();
        const fechaFormateada = `${dia}/${mes}/${año}`;

        if (datos.fechaOficio < datos.fechaInicio) {
          errorMessage = 'La fecha de oficio no puede ser menor a la fecha inicio.';
        }
        break;
      case 'fechaInicio':
        if (datos.fechaInicio > datos.fechaTermino) {
          errorMessage = 'La fecha de inicio no puede ser mayor a la fecha de termino';
        }
        break;
      case 'fechaTermino':
        if (datos.fechaTermino < datos.fechaOficio) {
          errorMessage = 'La fecha de termino no puede ser menor a la fecha oficio';
        }
        break;
      case 'numeroColaboracion':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Número Colaboración" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Número Colaboración" no puede terminar en espacio.'
        }
        break;
      case 'noOficio':
        if (value.includes('  ')) {
          errorMessage = 'El campo "No de Oficio" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "No de Oficio" no puede terminar en espacio.'
        }
        break;
      case 'acuerdoConvenio':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Acuerdo Convenio" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Acuerdo Convenio" no puede terminar en espacio.'
        }
        break;
      case 'razonColaboracion':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Razón Colaboración" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Razón Colaboración" no puede terminar en espacio.'
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
        const response = await axios.put(`http://localhost:8081/e-colaboracion/actualizar/${id}`, datos);
        alert('Datos actualizados correctamente!');
      } catch (error) {
        console.error('Error al actualizar los datos:', error);
      }
    }
  };

  return (
    <>

      <div className='table-container form'>
        <div className="mb-12 row">
          <h3 style={{color:'black'}}>Edicion Colaboracion</h3>
          <div className="col-sm-3">
            <label className="form-label">Numero colaboracion</label>
            <input type="text" className="form-control" id="NUMERO_COLABORACION" name="numeroColaboracion" placeholder="" value={datos.numeroColaboracion} onChange={handleChange}></input>
            <span className="error-message">{errors.numeroColaboracion}</span>
          </div>
          <div className="col-sm-3">
            <label className="form-label">N° de oficio</label>
            <input type="text" className="form-control" id="NO_OFICIO" name="noOficio" placeholder="" value={datos.noOficio} onChange={handleChange}></input>
            <span className="error-message">{errors.noOficio}</span>
          </div>
          <div className="col-sm-3">
            <label className="form-label">Fecha oficio</label>
            <input type="date" className="form-control" id="FECHA_OFICIO" name="fechaOficio" placeholder="" value={datos.fechaOficio} onChange={handleChange}></input>
            <span className="error-message">{errors.fechaOficio}</span>
          </div>
          <div className="col-sm-3">
            <label className="form-label">Fecha inicio</label>
            <input type="date" className="form-control" name="fechaInicio" id="FECHA_INICIO" placeholder="" value={datos.fechaInicio} onChange={handleChange}></input>
            <span className="error-message">{errors.fechaInicio}</span>
          </div>
        </div>

        <div className="mb-3 row">


          <div className="col-sm-3">
            <label className="form-label">Fecha termino</label>
            <input type="date" className="form-control" name="fechaTermino" id="FECHA_TERMINO" placeholder="" value={datos.fechaTermino} onChange={handleChange}></input>
            <span className="error-message">{errors.fechaTermino}</span>
          </div>
          <div className="col-sm-3">
            <label className="form-label">Estado Colaboración</label>
            
              <select
                name="idEstadoColaboracion"
                id='ID_ESTADO_COLABORA'
                className="form-select"
                value={datos.idEstadoColaboracion}
                onChange={handleSelectChange}>
                <option value="">{datos.nombreEstadoColaboracion}</option>
                {datos.estadoColaboracion.map(estC => (
                  <option key={estC.ID_ESTADO} value={estC.ID_ESTADO}>{estC.ENTIDAD}</option>
                ))}
              </select>
            
          </div>
          <div className="col-sm-3">
            <label className="form-label">Emisor Colaboración</label>
            
              <select
                name="idEmisorColaboracion"
                id='ID_EMISOR_COLABORA'
                className="form-select"
                value={datos.idEmisorColaboracion}
                onChange={handleSelectChange}>
                <option value="">{datos.nombreEmisorColaboracion}</option>
                {datos.emisorColaboracion.map(emC => (
                  <option key={emC.ID_INSTITUCION} value={emC.ID_INSTITUCION}>{emC.TIPO}</option>
                ))}
              </select>
           
          </div>
          <div className="col-sm-3">
            <label className="form-label">Acuerdo convenio</label>
            <input type="text" className="form-control" name="acuerdoConvenio" id="ACUERDO_CONVENIO" placeholder="" value={datos.acuerdoConvenio} onChange={handleChange}></input>
            <span className="error-message">{errors.acuerdoConvenio}</span>
          </div>
        </div>

        <div className="mb-3 row">
          <div className="col-sm-3">
            <label className="form-label">Razon colaboracion</label>
            <input type="text" className="form-control" name="razonColaboracion" id="RAZON_COLABORACION" placeholder="" value={datos.razonColaboracion} onChange={handleChange}></input>
            <span className="error-message">{errors.razonColaboracion}</span>
          </div>

          <div className="col-sm-3">
            <label className="form-label">Gravedad del caso</label>
        
              <select
                name="idGravedadCaso"
                id='GRAVEDAD_CASO'
                className="form-select"
                value={datos.idGravedadCaso}
                onChange={handleSelectChange}>
                <option value="">{datos.nombreGravedadCaso}</option>
                {datos.gravedadCaso.map(grav => (
                  <option key={grav.CLAVE} value={grav.CLAVE}>{grav.TIPO}</option>
                ))}
                </select>
            
          </div>

        </div>

        <div className="col-sm-4">
          <button className="btn btn-success" onClick={handleUpdateProceso}><FaCheck className='mr-2' /></button>
        </div>
      </div>

    </>
  )
}

export default E_colaboracion