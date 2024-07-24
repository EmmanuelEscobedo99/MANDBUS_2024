import React, { useState, useEffect } from 'react'
import "../../../src/index.css"
import axios from 'axios'
import { FaCheck, FaEdit, FaSyncAlt } from 'react-icons/fa';


const E_ministerial = ({ id }) => {

  const [datos, setDatos] = useState({
    ordenMinisterial: '',
    agencia: '',
    turno: '',
    noMP: '',
    nombreMP: '',
    paternoMP: '',
    maternoMP: '',
    noConvalidacionJuez: '',
    fechaInicio: '',
    fechaTermino: '',
    avPrevia: '',
    carpetaInv: '',
    horaInicio: '',
    horaFin: '',
    fechaConvalidacion: '',
    juzgadoAcreditacion: '',
    juezAcreditacion: '',
    razonEmisor: '',
    delitoTipo: '',
    gravedad: '',
    nombreEstadoEmisor: '',
    idEstadoEmisor: '',
    nombreEmisor: '',
    idEmisor: '',
    nombreJuzgadoAcreditacion: '',
    idJuzgadoAcreditacion: '',
    nombreGravedad: '',
    idGravedad: '',
    estadoEmisor: [],
    emisor: [],
    juzgadoAcreditacion: [],
    gravedad: []
  })

  // Define el estado para manejar los mensajes de error
  const [errors, setErrors] = useState({
    ordenMinisterial: '',
    agencia: '',
    turno: '',
    noMP: '',
    nombreMP: '',
    paternoMP: '',
    maternoMP: '',
    fechaTermino: '',
    avPrevia: '',
    carpetaInv: '',
    juezAcreditacion: '',
    razonEmisor: '',
    delitoTipo: '',
    // Agrega más campos de error según sea necesario
  });

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-ministerial/getdatos/${id}`);
        if (response.data && response.data.length > 0) {
          const data = response.data[0]
          setDatos({
            ...datos,
            ordenMinisterial: data.ORDEN_MINISTERIAL,
            agencia: data.AGENCIA,
            turno: data.TURNO,
            noMP: data.NO_MP,
            nombreMP: data.NOMBREMP,
            paternoMP: data.PATERNO_MP,
            maternoMP: data.MATERNO_MP,
            noConvalidacionJuez: data.NO_CONVALIDACION_JUEZ,
            fechaInicio: new Date(data.FECHA_INICIO).toISOString().split('T')[0],
            fechaTermino: new Date(data.FECHA_TERMINO).toISOString().split('T')[0],
            avPrevia: data.AV_PREVIA,
            carpetaInv: data.CARPETA_INV,
            horaInicio: data.HORA_INICIO,
            horaFin: data.HORA_FIN,
            fechaConvalidacion: new Date(data.FECHA_CONVALIDACION).toISOString().split('T')[0],
            juezAcreditacion: data.JUEZ_ACREDITACION,
            razonEmisor: data.RAZON_EMISOR,
            delitoTipo: data.DELITO_TIPO
          })
        } else {
          console.error('Error: No se encontraron datos para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    };

    const obtenerNombreEstadoEmisor = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-ministerial/estadoemisor/${id}`)
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
        const response = await axios.get(`http://localhost:8081/e-ministerial/emisor/${id}`)
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

    const obtenerNombreJuzgado = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/e-ministerial/juzgado/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreJuzgadoAcreditacion: response.data[0].DESCRIP_JUZGADO,
            idJuzgadoAcreditacion: response.data[0].ID_JUZGADO,
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
        const response = await axios.get(`http://localhost:8081/e-ministerial/gravedad/${id}`)
        if (response.data && response.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            nombreGravedad: response.data[0].TIPO,
            idGravedad: response.data[0].CLAVE,
          }));
        } else {
          console.error('Error: No se encontró el nombre del juzgado para el ID proporcionado')
        }
      } catch (error) {
        console.error('Error al obtener el nombre del emisor:', error)
      }
    }

    obtenerNombreEstadoEmisor();
    obtenerNombreEmisor();
    obtenerNombreJuzgado();
    obtenerNombreGravedad();
    obtenerDatos();
  }, [id])

  useEffect(() => {
    const obtenerEstadoEmisor = async () => {
      try {
        const responseEstadoEmisor = await axios.get("http://localhost:8081/e-ministerial/getcatestadoemisor");
        if (responseEstadoEmisor.data && responseEstadoEmisor.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            estadoEmisor: responseEstadoEmisor.data,
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
        const responseEmisor = await axios.get("http://localhost:8081/e-ministerial/getcatemisor");
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

    const obtenerJuzgado = async () => {
      try {
        const responseJuzgado = await axios.get("http://localhost:8081/e-ministerial/getcatjuzgados");
        if (responseJuzgado.data && responseJuzgado.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            juzgadoAcreditacion: responseJuzgado.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    const obtenerGravedad = async () => {
      try {
        const responseGravedad = await axios.get("http://localhost:8081/e-ministerial/getcatgravedad");
        if (responseGravedad.data && responseGravedad.data.length > 0) {
          setDatos(prevState => ({
            ...prevState,
            gravedad: responseGravedad.data,
          }));
        } else {
          console.error('Error: No se encontraron amparos');
        }
      } catch (error) {
        console.error('Error al obtener amparos:', error);
      }
    };

    obtenerEstadoEmisor();
    obtenerEmisor();
    obtenerJuzgado();
    obtenerGravedad();
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
      case 'ordenMinisterial':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Orden Ministerial" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Orden Ministerial" no puede terminar en espacio.'
        }
        break;
      case 'agencia':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Agencia" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Agencia" no puede terminar en espacio.'
        }
        break;
      case 'turno':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Turno" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Turno" no puede terminar en espacio.'
        }
        break;
      case 'noMP':
        if (value.includes('  ')) {
          errorMessage = 'El campo "No Ministerio Publico" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "No Ministerio Publico" no puede terminar en espacio.'
        }
        break;
      case 'nombreMP':
        // Verifica si hay un nombre proporcionado y si no hay apellidos
        if (value !== '' && datos.paternoMP === '' && datos.maternoMP === '') {
          errorMessage = 'Se requiere al menos un apellido si se proporciona un nombre.';
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Nombre" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Nombre" no puede terminar en espacio.'
        }
        break;
      case 'paternoMP':
        // Verifica si no hay apellido paterno cuando hay nombre
        if (datos.nombreMP !== '' && datos.maternoMP === '' && value == '') {
          errorMessage = 'Se requiere al menos un apellido si se proporciona un nombre.';
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Paterno" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Paterno" no puede terminar en espacio.'
        }
        break;
      case 'maternoMP':
        // Verifica si no hay apellido materno cuando hay nombre
        if (datos.nombreMP !== '' && datos.paternoMP === '' && value == '') {
          errorMessage = 'Se requiere al menos un apellido si se proporciona un nombre.';
        }
        if (value.includes('  ')) {
          errorMessage = 'El campo "Materno" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Materno" no puede terminar en espacio.'
        }
        break;
      case 'noConvalidacionJuez':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Convalidacion" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Convalidacion" no puede terminar en espacio.'
        }
        break;
      case 'fechaTermino':
        // Verifica si no hay apellido materno cuando hay nombre
        if (datos.fechaTermino < datos.fechaInicio) {
          errorMessage = 'La fecha termino no puede ser menor a la fecha inicio.';
        }
        break;
      case 'avPrevia':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Previa" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Previa" no puede terminar en espacio.'
        }
        break;
      case 'carpetaInv':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Carpeta Inv" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Previa" no puede terminar en espacio.'
        }
        break;
      case 'juezAcreditacion':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Juez Acreditación" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Juez Acreditación" no puede terminar en espacio.'
        }
        break;
      case 'razonEmisor':
        if (value.includes('  ')) {
          errorMessage = 'El campo "razonEmisor" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "razonEmisor" no puede terminar en espacio.'
        }
        break;
      case 'delitoTipo':
        if (value.includes('  ')) {
          errorMessage = 'El campo "Tipo delito" no puede tener más de un espacio en blanco consecutivo.';
        }
        if (value.endsWith(' ')) {
          errorMessage = 'El campo "Tipo delito" no puede terminar en espacio.'
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
        const response = await axios.put(`http://localhost:8081/e-ministerial/actualizar/${id}`, datos);
        alert('Datos actualizados correctamente!');
       
      } catch (error) {
        console.error('Error al actualizar los datos:', error);
      }
    }
  };

  return (
    <>
      <div className="table-container form">
        <div className="mb-12 row">
          <h3 style={{color:'black'}}>Edicion Ministerial</h3>

          <div className="col-sm-3">
            <label className="form-label">Orden ministerial</label>
            <input type="text" className="form-control" name="ordenMinisterial" id="ORDEN_MINSTERIAL" placeholder="" value={datos.ordenMinisterial} onChange={handleChange}></input>
            <span className="error-message">{errors.ordenMinisterial}</span>
          </div>

          <div className="col-sm-3">
            <label className="form-label">Agencia</label>
            <input type="text" className="form-control" name="agencia" id="AGENCIA" placeholder="" value={datos.agencia} onChange={handleChange}></input>
            <span className="error-message">{errors.agencia}</span>
          </div>

          <div className="col-sm-3">
            <label className="form-label">Turno</label>
            <input type="text" className="form-control" name="turno" id="TURNO" placeholder="" value={datos.turno} onChange={handleChange}></input>
            <span className="error-message">{errors.turno}</span>
          </div>

          <div className="col-sm-3">
            <label className="form-label">N° Ministerio Publico</label>
            <input type="text" className="form-control" id="NO_MP" name="noMP" placeholder="" value={datos.noMP} onChange={handleChange}></input>
            <span className="error-message">{errors.noMP}</span>
          </div>
        </div>

        <div className="mb-12 row">

          

          <div className="col-sm-3">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" name="nombreMP" id="NOMBREMP" placeholder="" value={datos.nombreMP} onChange={handleChange}></input>
            <span className="error-message">{errors.nombreMP}</span>
          </div>

          <div className="col-sm-3">
            <label className="form-label">paterno </label>
            <input type="text" className="form-control" name="paternoMP" id="PATERNO_MP" placeholder="" value={datos.paternoMP} onChange={handleChange}></input>
            <span className="error-message">{errors.paternoMP}</span>
          </div>

          <div className="col-sm-3">
            <label className="form-label">Materno </label>
            <input type="text" className="form-control" id="MATERNO_MP" name="maternoMP" placeholder="" value={datos.maternoMP} onChange={handleChange}></input>
            <span className="error-message">{errors.maternoMP}</span>
          </div>

          <div className="col-sm-3">
            <label className="form-label">convalidacion</label>
            <input type="text" className="form-control" name="noConvalidacionJuez" id="NO_CONVALIDACION_JUEZ" placeholder="" value={datos.noConvalidacionJuez} onChange={handleChange}></input>
            <span className="error-message">{errors.noConvalidacionJuez}</span>
          </div>
        </div>
        <div className="mb-3 row">
         
          <div className="col-sm-3">
            <label className="form-label">Fecha inicio</label>
            <input type="date" className="form-control" name="fechaInicio" id="FECHA_INICIO" placeholder="" value={datos.fechaInicio} onChange={handleChange}></input>  
          </div>
          <div className="col-sm-3">
            <label className="form-label">Fecha termino</label>
            <input type="date" className="form-control" id="FECHA_TERMINO" name="fechaTermino" placeholder="" value={datos.fechaTermino} onChange={handleChange}></input>
            <span className="error-message">{errors.fechaTermino}</span>
          </div>
          <div className="col-sm-3">
            <label className="form-label">Previa</label>
            <input type="text" className="form-control" name="avPrevia" id="AV_PREVIA" placeholder="" value={datos.avPrevia} onChange={handleChange}></input>
            <span className="error-message">{errors.avPrevia}</span>
          </div>

          <div className="col-sm-3">
            <label className="form-label">Carpeta inv</label>
            <input type="text" className="form-control" name="carpetaInv" id="CARPETA_INV" placeholder="" value={datos.carpetaInv} onChange={handleChange}></input>
            <span className="error-message">{errors.carpetaInv}</span>
          </div>
        </div>

        <div className="mb-3 row">
          <div className="col-sm-3">
            <label className="form-label">Hora inicio</label>
            <input type="text" className="form-control" id="HORA_INICIO" name="horaInicio" placeholder="" value={datos.horaInicio} onChange={handleChange}></input>
          </div>

          <div className="col-sm-3">
            <label className="form-label">Hora fin</label>
            <input type="text" className="form-control" name="horaFin" id="HORA_FIN" placeholder="" value={datos.horaFin} onChange={handleChange}></input>
          </div>

          <div className="col-sm-3">
            <label className="form-label">Fecha convalidacion</label>
            <input type="date" className="form-control" name="fechaConvalidacion" id="FECHA_CONVALIDACION" placeholder="" value={datos.fechaConvalidacion} onChange={handleChange}></input>
          </div>
        </div>


        <div className="mb-3 row">
          <div className="col-sm-3">
            <label className="form-label">Juzgado Acreditación</label>
            
              <select
                name="idJuzgadoAcreditacion"
                id='JUZGADO_ACREDITACION'
                className="form-select"
                value={datos.idJuzgadoAcreditacion}
                onChange={handleSelectChange}>
                <option value="">{datos.nombreJuzgadoAcreditacion}</option>
                {datos.juzgadoAcreditacion.map(juz => (
                  <option key={juz.ID_JUZGADO} value={juz.ID_JUZGADO}>{juz.DESCRIP_JUZGADO}</option>
                ))}
              </select>
            
          </div>

          <div className="col-sm-3">
            <label className="form-label">Nombre del juez que acredita</label>
            <input type="text" className="form-control" name="juezAcreditacion" id="JUEZ_ACREDITACION" placeholder="" value={datos.juezAcreditacion} onChange={handleChange}></input>
            <span className="error-message">{errors.juezAcreditacion}</span>
          </div>

          <div className="col-sm-3">
            <label className="form-label">Razon emision</label>
            <input type="text" className="form-control" name="razonEmisor" id="RAZON_EMISOR" placeholder="" value={datos.razonEmisor} onChange={handleChange}></input>
            <span className="error-message">{errors.razonEmisor}</span>
          </div>
        </div>

        <div className="mb-3 row">
          <div className="col-sm-3">
            <label className="form-label">Tipo delito </label>
            <input type="text" className="form-control" id="DELITO_TIPO" name="delitoTipo" placeholder="" value={datos.delitoTipo} onChange={handleChange}></input>
            <span className="error-message">{errors.delitoTipo }</span>
          </div>

          <div className="col-sm-3">
            <label className="form-label">Gravedad</label>
           
              <select
                name="idGravedad"
                id='GRAVEDAD'
                className="form-select"
                value={datos.idGravedad}
                onChange={handleSelectChange}>
                <option value="">{datos.nombreGravedad}</option>
                {datos.gravedad.map(grav => (
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

export default E_ministerial