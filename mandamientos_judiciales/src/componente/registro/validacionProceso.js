 export const validarOtrosNombres = (otros_nom) => {
    let errors = {};
  
    if (!otros_nom.O_NOMBRE && !otros_nom.O_ALIAS) {
      errors.O_NOMBRE = "Por favor ingresa un nombre o un alias";
    }
  
    if (!otros_nom.O_APATERNO && !otros_nom.O_AMATERNO && !otros_nom.O_ALIAS) {
      errors.O_APATERNO = "Por favor ingresa al menos un apellido o un alias";
      errors.O_AMATERNO = "Por favor ingresa al menos un apellido o un alias";
    }
  
    return errors;
  };



  export const validarDatos = (registro) => {
    let errors = {};

    

    const regex = / {3,}/; // Expresión regular para buscar más de dos espacios continuos

    if (!registro.NO_MANDATO) {
        errors.NO_MANDATO = "Campo requerido";
    } else if (regex.test(registro.NO_MANDATO)) {
        errors.NO_MANDATO = "No debe contener más de dos espacios continuos";
    }   

     const letrasRegex = /^[a-zA-ZñÑ\s]+$/;

     if (!registro.NOMBRE && !registro.ALIAS) {
         errors.NOMBRE = "Por favor ingresa un nombre o un alias";
     } else if (registro.NOMBRE && !letrasRegex.test(registro.NOMBRE)) {
         errors.NOMBRE = "El nombre solo debe contener letras";
     }
     
     if (!registro.APATERNO && !registro.AMATERNO && !registro.ALIAS) {
         errors.APATERNO = "Por favor ingresa al menos un apellido ";
         errors.AMATERNO = "Por favor ingresa al menos un apellido ";
     } else {
         if (registro.APATERNO && !letrasRegex.test(registro.APATERNO)) {
             errors.APATERNO = "El apellido paterno solo debe contener letras";
         }
         if (registro.AMATERNO && !letrasRegex.test(registro.AMATERNO)) {
             errors.AMATERNO = "El apellido materno solo debe contener letras";
         }
     }
     

    // alias no requerido
    
  
    if (!registro.EDAD) {
      errors.EDAD = "Requerido";
      console.log("error en el edad");
    } else {
      const edad = registro.EDAD.trim(); // Eliminar espacios en blanco al principio y al final
    
      // Expresión regular para verificar si la edad contiene solo dígitos
      const regex = /^[0-9]+$/;
    
      if (!regex.test(edad)) {
        errors.EDAD = "La edad debe ser un número entero.";
        console.log("La edad debe ser un número entero.");
      } else {
        const edadNumero = parseInt(edad);
    
        if (edadNumero < 12 || edadNumero > 100) {
          errors.EDAD = "La edad debe estar entre 12 y 100 años.";
          console.log("La edad debe estar entre 12 y 100 años.");
        }
      }
    }
    
    
   

    // estatura no requerida
    if (!registro.ESTATURA) {
      console.log("Campo no requerido");
  } else {
      // Verificar si el valor de PESO es un número entero
      const regex = /^\d+$/; // Expresión regular que coincide con solo números enteros
      if (!regex.test(registro.ESTATURA)) {
          errors.ESTATURA = "La estatura no debe tener letras";
      }
  }   
   


    if (!registro.PESO) {
      console.log("Campo no requerido");
  } else {
      // Verificar si el valor de PESO es un número entero
      const regex = /^\d+$/; // Expresión regular que coincide con solo números enteros
      if (!regex.test(registro.PESO)) {
          errors.PESO = "El peso no debe tener letras";
      }
  }
  
      

    if (registro.PESO) {
      
      console.log("error en el peso")
    }

    //peso no requerido
    
    if (!registro.ID_SEXO) {
      errors.ID_SEXO = "Requerido";
      console.log("error sexo")
    }    

    //uso anteojos no requerido
    

     // nacionalidad no requerida
    

     if (!registro.ID_JUZGADO) {
      errors.ID_JUZGADO = "Por favor ingresa la informacion solicitada.";
      console.log("error juzgado");
    } else if (registro.ID_JUZGADO < 100 || registro.ID_JUZGADO > 113) {
      errors.ID_JUZGADO = "No se a seleccionado correctamente";
      console.log("error juzgado");
    } 




    
    if (!registro.NO_CAUSA) {
      errors.NO_CAUSA = "Por favor ingresa la informacion solicitada ";
      console.log("error causa")
    }

    if (!registro.OFICIO_JUZGADO) {
      errors.OFICIO_JUZGADO = "Por favor ingresa la informacion solicitada ";
      console.log("error oficio")
    }
  

    // fecha de oficio no requerido
    

    // Si no se proporciona una fecha de oficio, no hay errores
  if (!registro.FECHA_OFICIO) {
    registro.FECHA_OFICIO = "0000-00-00";
  }

  // Convertir la fecha de oficio a un objeto Date
  const fechaSeleccionada = new Date(registro.FECHA_OFICIO);
  const fechaActual = new Date();

  // Verificar si la fecha seleccionada es mayor que la fecha actual
  if (fechaSeleccionada > fechaActual) {
    errors.FECHA_OFICIO = "La fecha de oficio no puede ser mayor que la fecha actual";
  }

  
   
    if (!registro.ID_TIPO_CUANTIA) {
      errors.ID_TIPO_CUANTIA = "Por favor ingresa la informacion solicitada";
      console.log("error fecha")
    }





     





    return errors;
  };


  export const validarProceso = (proceso) => {
    let errors = {};
  
        // NO PUEDE SER MAYOR A LA FECHA ACTUAL O A LA FECHA DE CAPTURA
    if (!proceso.FECHA_LIBRAMIENTO && !proceso.FECHA_LIBRAMIENTO) {
      errors.FECHA_LIBRAMIENTO = "Se debe ingresar una fecha";
    }
  
       
    if (!proceso.ID_FUERO_PROCESO && !proceso.ID_FUERO_PROCESO) {
      errors.ID_FUERO_PROCESO = "Este campo es obligatorio";
    }
    
    if (!proceso.ID_TIPO_MANDATO && !proceso.ID_TIPO_MANDATO) {
      errors.ID_TIPO_MANDATO = "Selecciona un tipo de mandato";
    }

    if (!proceso.NO_PROCESO && !proceso.NO_PROCESO) {
      errors.NO_PROCESO = "Este campo es obligatorio";
    }

    if (!proceso.NO_AVERIGUACION && !proceso.NO_AVERIGUACION) {
      errors.NO_AVERIGUACION = "Este campo es obligatorio";
    }

    if (!proceso.FECHA_CAPTURA && !proceso.FECHA_CAPTURA) {
      errors.FECHA_CAPTURA = "Se debe ingresar una fecha de captura ";
     }

     if (!proceso.FECHA_RECEPCION && !proceso.FECHA_RECEPCION) {
      errors.FECHA_RECEPCION = "Se debe ingresar una fecha de recepcion";
     }
     
     if (!proceso.ID_PROCESO_EXTRADI && !proceso.ID_PROCESO_EXTRADI) {
      errors.ID_PROCESO_EXTRADI = "Este campo es obligatorio ";
     }
      
     if (!proceso.ID_TIPO_PROCESO && !proceso.ID_TIPO_PROCESO) {
      errors.ID_TIPO_PROCESO = "Este campo es obligatorio";
     }


    

  
    return errors;
  };

    


  export const validarDomicilio = (domicilio) => {
    let errors = {};
  
    if (!domicilio.ID_ESTADO_DOM) {
      errors.ID_ESTADO_DOM = "Por favor ingresa la informacion solicitada ";
     
    }
  
    if (!domicilio.ID_MUNICIPIO_DOM) {
      errors.ID_MUNICIPIO_DOM = "Por favor ingresa la informacion solicitada ";
      
    }
    
    
    if (!domicilio.COLONIA) {
      errors.COLONIA = "Por favor ingresa la información solicitada";
    } else if (!/^[a-zA-Z0-9\sñÑ]+$/.test(domicilio.COLONIA)) {
      errors.COLONIA = "La colonia solo debe contener letras y números";
    }
    

    

    if (domicilio.CP && !/^\d+$/.test(domicilio.CP)) {
      errors.CP = "El código postal debe contener solo números";
    }



    if (domicilio.TELEFONO) {
      if (!/^\d+$/.test(domicilio.TELEFONO)) {
        errors.TELEFONO = "El teléfono debe contener solo números";
      } else if (domicilio.TELEFONO.length > 10) {
        errors.TELEFONO = "El teléfono no puede tener más de 10 dígitos";
      }
    }
    
    
  
    return errors;
  };


  export const validarAmparos = (amparo) => {
    let errors = {};
  
    if (!amparo.NO_AMPARO) {
      errors.NO_AMPARO = "Por favor ingresa la informacion solicitada ";     
    }
    
    
    if (!amparo.ID_JUZGADO) {
      errors.ID_JUZGADO = "Selecciona alguna opcion ";      
    }
  
    if (!amparo.FECHA_AMPARO) {
      errors.FECHA_AMPARO = "Selecciona una Fecha ";      
    }
    
    if (!amparo.ID_RESOLUCION) {
      errors.ID_RESOLUCION = "Selecciona una resolucion";      
    }

    if (!amparo.ID_TIPO_AMPARO) {
      errors.ID_TIPO_AMPARO = "Selecciona un tipo de amparo";      
    }





  
    return errors;
  };

  



  export const validarMediaFiliacion = (media_filiacion) => {
    let errors = {};
  
    if (!media_filiacion.ID_FILIACION) {
      errors.ID_FILIACION = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }
    
    if (!media_filiacion.ID_VALOR_FILIACION) {
      errors.ID_VALOR_FILIACION = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }
    
    if (!media_filiacion.NO_CONSECUTIVO) {
      errors.NO_CONSECUTIVO = "Por favor ingresa la información solicitada";
    } else if (!Number.isInteger(Number(media_filiacion.NO_CONSECUTIVO))) {
      errors.NO_CONSECUTIVO = "El valor debe ser un número entero";
    }
  
    return errors;
  };




  export const validarMinisterial = (ministerial) => {
    let errors = {};
  
    if (!ministerial.ORDEN_MINISTERIAL) {
      errors.ORDEN_MINISTERIAL = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }

    if (!ministerial.AGENCIA) {
      errors.AGENCIA = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }

    if (!ministerial.TURNO) {
      errors.TURNO = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }
    
    if (!ministerial.NO_MP) {
      errors.NO_MP = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }
    
    if (ministerial.NOMBREMP) {
      if (!/^[a-zA-ZñÑ\s]*$/.test(ministerial.NOMBREMP)) {
        errors.NOMBREMP = "El nombre solo debe contener letras";
      }
    }
    
    

    if (ministerial.PATERNO_MP) {
      if (!/^[a-zA-ZñÑ\s]*$/.test(ministerial.PATERNO_MP)) {
        errors.PATERNO_MP = "El nombre solo debe contener letras";
      }
    }
    
    if (ministerial.MATERNO_MP) {
      if (!/^[a-zA-ZñÑ\s]*$/.test(ministerial.MATERNO_MP)) {
        errors.MATERNO_MP = "El nombre solo debe contener letras";
      }
    }

    if (!ministerial.NO_CONVALIDACION_JUEZ) {
      errors.NO_CONVALIDACION_JUEZ = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }

    if (!ministerial.FECHA_INICIO) {
      errors.FECHA_INICIO = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }

    if (!ministerial.FECHA_TERMINO) {
      errors.FECHA_TERMINO = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }
   /*
    if (!ministerial.AV_PREVIA) {
      errors.AV_PREVIA = "Por favor  ";
      console.log("error ID_ESTADO_DOM")
    }

    if (!ministerial.CARPETA_INV) {
      errors.CARPETA_INV = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    } */
  
    if (!ministerial.HORA_INICIO) {
      errors.HORA_INICIO = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }

    if (!ministerial.HORA_FIN) {
      errors.HORA_FIN = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }

    if (!ministerial.FECHA_CONVALIDACION) {
      errors.FECHA_CONVALIDACION = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }

    if (!ministerial.JUZGADO_ACREDITACION) {
      errors.JUZGADO_ACREDITACION = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }


    if (!ministerial.JUEZ_ACREDITACION) {
      errors.JUEZ_ACREDITACION = "Por favor ingresa la información solicitada";
    } else if (!/^[a-zA-ZñÑ\s]*$/.test(ministerial.JUEZ_ACREDITACION)) {
      errors.JUEZ_ACREDITACION = "Este campo solo debe contener letras";
    }
    





    if (!ministerial.RAZON_EMISOR) {
      errors.RAZON_EMISOR = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }


    if (!ministerial.DELITO_TIPO) {
      errors.DELITO_TIPO = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }

    if (!ministerial.GRAVEDAD) {
      errors.GRAVEDAD = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }



  
    return errors;
  };


  export const validarColaboracion = (colaboracion) => {
    let errors = {};
  
    if (!colaboracion.NUMERO_COLABORACION) {
      errors.NUMERO_COLABORACION = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }
    
    if (!colaboracion.NO_OFICIO) {
      errors.NO_OFICIO = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }
 
    if (!colaboracion.FECHA_OFICIO) {
      errors.FECHA_OFICIO = "Por favor ingresa la información solicitada.";
    } else if (!colaboracion.FECHA_INICIO) {
      errors.FECHA_INICIO = "Por favor ingresa la información solicitada.";
    } else if (!colaboracion.FECHA_TERMINO) {
      errors.FECHA_TERMINO = "Por favor ingresa la información solicitada.";
    } else {
      // Realizar la comparación de fechas aquí
      const fechaOficio = new Date(colaboracion.FECHA_OFICIO);
      const fechaInicio = new Date(colaboracion.FECHA_INICIO);
      const fechaTermino = new Date(colaboracion.FECHA_TERMINO);

       if (fechaOficio >= fechaInicio ){
            if(fechaInicio <= fechaTermino){
                 if(fechaTermino >= fechaOficio){
                 }else{
                  errors.FECHA_TERMINO = "debe ser mayor o igual a la fecha de oficio";
                 }
            }else{
              errors.FECHA_INICIO = "esta fecha debe ser menor o igual a fecha de termino";
            }
       }else {
        errors.FECHA_OFICIO = "Esta fecha debe ser mayor o igual a la fecha inicio";
       }  
    }
    
 
    if (!colaboracion.ID_ESTADO_COLABORA) {
      errors.ID_ESTADO_COLABORA = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }else{
      if(colaboracion.ID_ESTADO_COLABORA == 10){
        errors.ID_ESTADO_COLABORA = "Seleccion invalida, no puedes seleccionar este Estado";
      }

    }



    if (!colaboracion.ID_EMISOR_COLABORA) {
      errors.ID_EMISOR_COLABORA = "Por favor ingresa la informacion solicitada ";
      console.log("error id emisor colabora....")
    }

    if (!colaboracion.ACUERDO_CONVENIO) {
      errors.ACUERDO_CONVENIO = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }

    if (!colaboracion.RAZON_COLABORACION) {
      errors.RAZON_COLABORACION = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }

    if (!colaboracion.GRAVEDAD_CASO) {
      errors.GRAVEDAD_CASO = "Por favor ingresa la informacion solicitada ";
      console.log("error ID_ESTADO_DOM")
    }





    return errors;
  };







  export default { validarOtrosNombres,  validarDatos, validarProceso, validarDomicilio, validarMediaFiliacion};
  
  
  