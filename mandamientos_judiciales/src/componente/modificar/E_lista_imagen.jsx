import React, { useState, useEffect } from 'react';
import { Modal, Card, Button } from 'react-bootstrap';
import axios from 'axios';

const E_lista_imagen = ({ id }) => {
    const [inputDataList, setInputDataList] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [imagenes, setImagenes] = useState([]);
    const [modalImagen, setModalImagen] = useState(null);
    const [imagenCompleta, setImagenCompleta] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [imagesPerPage] = useState(2);
    const [isLoadingImage, setIsLoadingImage] = useState(false); // Estado para controlar la carga de la imagen

    useEffect(() => {
        obtenerDatosImagen();
        obtenerGrupos();
        obtenerImagenes(id);
    }, [id]);

    const obtenerGrupos = async () => {
        try {
            const response = await axios.get("http://localhost:8081/e-imagen/getCatGrupoImagen");
            if (response.data && response.data.length > 0) {
                setGrupos(response.data);
            } else {
                console.error('Error: No se encontraron grupos de imagen');
            }
        } catch (error) {
            console.error('Error al obtener grupos de imagen:', error);
        }
    };

    const obtenerDatosImagen = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/e-imagen/getdatos/${id}`);
            setInputDataList(response.data);
        } catch (error) {
            console.error('Error al obtener los datos generales:', error);
        }
    };

    const obtenerImagenes = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8081/e-imagen/getimagenid/${id}`);
            setImagenes(response.data);
        } catch (error) {
            console.error('Error al obtener las imágenes:', error);
        }
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const newInputDataList = [...inputDataList];
        newInputDataList[index][name] = value;
        setInputDataList(newInputDataList);
    };

    const handleSelectChange = (event, index) => {
        const { name, value } = event.target;
        const newInputDataList = [...inputDataList];
        newInputDataList[index][name] = value;
        setInputDataList(newInputDataList);
    };

    const handleImagenSeleccionada = async (e, index) => {
        const file = e.target.files[0];
        if (file) {
            setIsLoadingImage(true); // Indicar que se está cargando la imagen
            const newInputDataList = [...inputDataList];
            newInputDataList[index].imagenSeleccionada = file;
            setInputDataList(newInputDataList);
            setIsLoadingImage(false); // Indicar que se ha completado la carga de la imagen
        }
    };

    const handleUpdateProceso = async (index) => {
        try {
            const formData = new FormData();
            if (inputDataList[index].imagenSeleccionada) {
                formData.append('imagenData', inputDataList[index].imagenSeleccionada);
            }
            const inputData = inputDataList[index];
            formData.append('ID_IMAGEN_EXT', inputData.ID_IMAGEN_EXT);
            formData.append('DESCRIP_IMAGEN', inputData.DESCRIP_IMAGEN);
            formData.append('TIPO_IMAGEN', inputData.TIPO_IMAGEN);
            formData.append('GRUPO', inputData.GRUPO);
            formData.append('ID_IMAGEN_EXT_H', inputData.ID_IMAGEN_EXT);
            const response = await axios.put(`http://localhost:8081/e-imagen/actualizarimg/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Datos actualizados correctamente!');
            
        } catch (error) {
            console.error('Error al actualizar los datos:', error);
        }
    };

    const mostrarImagen = (id) => {
        const imagen = imagenes.find(imagen => imagen.id === id);
        setModalImagen(imagen.url);
    };

    const cerrarImagenCompleta = () => {
        setImagenCompleta(null);
    };

    const handleTipoImagenChange = (e, index) => {
        const { value } = e.target;
        const newInputDataList = [...inputDataList];
        newInputDataList[index].TIPO_IMAGEN = value;
        setInputDataList(newInputDataList);
    };


    // Obtener índices de la primera y última imagen en la página actual
    const indexOfLastImage = currentPage * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = inputDataList.slice(indexOfFirstImage, indexOfLastImage);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>

            <h3 style={{color:'black'}} className="mb-4">EDITAR IMAGEN</h3>
            <div className="d-flex flex-wrap justify-content-start">
                {currentImages.map((inputData, index) => (
                    <Card key={index} className="mb-3 imagen-card" style={{ width: '100%' }}>
                        <Card.Body className="d-flex justify-content-between">
                            <img
                                src={imagenes[index]}
                                style={{ width: '300px', maxHeight: '400px', cursor: 'pointer' }}
                                alt={`Imagen ${index}`}
                                onClick={() => setImagenCompleta(imagenes[index])}
                            />

                            <div className="flex-grow-1">
                                <Card.Title>Imagen {inputData.ID_IMAGEN_EXT}</Card.Title>
                                <input
                                    type='hidden'
                                    name='ID_IMAGEN_EXT_H'
                                    className='form-control form-control-sm mb-3 imagen-input-hidden'
                                    defaultValue={inputData.ID_IMAGEN_EXT}
                                />
                                <label>Descripción</label>
                                <input
                                    type='text'
                                    className='form-control form-control-sm mb-3'
                                    style={{ maxWidth: '200px' }}
                                    name='DESCRIP_IMAGEN'
                                    value={inputData.DESCRIP_IMAGEN}
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                                <label>Tipo</label>
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`TIPO_IMAGEN_${index}`}
                                            value="d"
                                            checked={inputData.TIPO_IMAGEN === 'd'}
                                            onChange={(e) => handleTipoImagenChange(e, index)}
                                        />
                                        Documento
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`TIPO_IMAGEN_${index}`}
                                            value="f"
                                            checked={inputData.TIPO_IMAGEN === 'f'}
                                            onChange={(e) => handleTipoImagenChange(e, index)}
                                        />
                                        Foto
                                    </label>
                                </div>
                                <label>Grupo</label>
                                <select
                                    name="GRUPO"
                                    className="form-select form-select-sm mb-3"
                                    value={inputData.GRUPO}
                                    onChange={(e) => handleSelectChange(e, index)}
                                    style={{ maxWidth: '200px' }}
                                >
                                    <option value="">Seleccione un grupo</option>
                                    {grupos.map((grupo) => (
                                        <option key={grupo.CLAVE} value={grupo.CLAVE}>{grupo.TIPO}</option>
                                    ))}
                                </select>
                                <label>Imagen</label>
                                <input
                                    type="file"
                                    className='form-control form-control-sm mb-2'
                                    style={{ maxWidth: '200px' }}
                                    onChange={(e) => handleImagenSeleccionada(e, index)}
                                    accept="image/*"
                                />
                                {/* Indicador de carga */}
                                {isLoadingImage && <div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div>}
                                <Button
                                    className="btn btn-success mt-3"
                                    onClick={() => handleUpdateProceso(index)}
                                >
                                    Actualizar
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            {/* Botones de paginación */}
            {inputDataList.length > imagesPerPage && (
                <nav>
                    <br></br>
                    <ul className="pagination justify-content-center">
                        {Array(Math.ceil(inputDataList.length / imagesPerPage)).fill().map((_, i) => (
                            <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                                <button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}


            <Modal show={imagenCompleta !== null} onHide={cerrarImagenCompleta} centered>
                <Modal.Body>
                    <img src={imagenCompleta} alt="Imagen Completa" style={{ width: '100%', height: 'auto' }} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default E_lista_imagen;
