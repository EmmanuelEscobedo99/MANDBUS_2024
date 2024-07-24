
//datos generales

export function  valEmisor(emisor) {
    // Verificar si el campo está vacío
    if (emisor.trim() === '') {
        return 'Debes de seleccionar la institucion que emite la informacion';
    }
    // Si la validación pasa, retorna null
    return null;
}

export function  valMandato(mandato) {
    // Verificar si el campo está vacío
    if (mandato.trim() === '') {
        return 'Ingresa un numero de mandato';
    }
    // Si la validación pasa, retorna null
    return null;
}




// componente delitos


export function validarDelito(delito) {
    // Verificar si el campo está vacío
    if (delito.trim() === '') {
        return 'Debes de seleccionar un delito';
    }
    // Si la validación pasa, retorna null
    return null;
}

export function validarModalidad(modalidad) {
    // Verificar si el campo está vacío
    if (modalidad.trim() === '') {
        return 'El campo Modalidad es obligatorio';
    }
    // Si la validación pasa, retorna null
    return null;
}
