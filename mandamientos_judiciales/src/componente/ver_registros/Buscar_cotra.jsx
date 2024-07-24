import React, { useState } from 'react';
import Menu from '../menu/MenuLateral';
import Titulo from '../menu/Titulo';
import { FaCheck, FaEdit, FaSyncAlt, FaSearch } from 'react-icons/fa';
import useTokenLogin from '../../useTokenLogin';
import MenuModificar from '../menu/MenuModificar';


export const Buscar_cotra = () => {
    const hasToken = useTokenLogin();
    const [correo, setCorreo] = useState('');
    const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const handleChange = (e) => {
        setCorreo(e.target.value);
    };

    const handleUpdateClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSuccessMessage('');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden');
            return;
        }

        try {
            // Llamar a la API para actualizar la contraseña
            const response = await fetch('http://localhost:8081/user/actualizarContrasena', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: usuarioEncontrado.correo,
                    nuevaContrasena: newPassword,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage('Contraseña actualizada con éxito!')
               
                setErrorMessage('');
                setConfirmPassword('');
                setNewPassword('');
                
            } else {
                alert('Error al actualizar la contraseña');
            }

        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            alert('Error al actualizar la contraseña');
        }
    };


    const obtenerContrasenaHasheada = async () => {
        try {
            const response = await fetch(`http://localhost:8081/user/compararContrasena/${correo}`);
            const data = await response.json();

            if (data.success) {
                setContrasenaHasheada(data.contrasenaHasheada);
            } else {
                setError('Usuario no encontrado');
            }
        } catch (err) {
            console.error('Error al obtener la contraseña:', err);
            setError('Error al obtener la contraseña');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8081/user/buscar-usuario/${correo}`);
            const data = await response.json();

            if (data.success) {
                setUsuarioEncontrado(data.user);
                setError(null);
            } else {
                setUsuarioEncontrado(null);
                setError('Usuario no encontrado');
            }
        } catch (err) {
            console.error('Error al buscar usuario:', err);
            setError('Error al buscar usuario');
        }
    };

    return (
        <>
            <div className={`contenedor_principal ${hasToken ? '' : 'd-none'}`}>
                <Titulo />
                <MenuModificar />
                <div className="mb-12 row">
                    <br />
                </div>
                <div className="row mb-3">
                    <div className="col-sm-12">
                        <div className='table-container form' style={{ width: '800px' }}>
                            <h3 className="titulo-busqueda">Buscar por correo</h3>
                            <div className="table-responsive">
                                <table className="table table-bordered tabla-usuario">
                                    <thead className="table-secondary">
                                        <tr>
                                            <th scope="col">Buscador</th>
                                            <th scope="col">Usuario</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <form onSubmit={handleSubmit} className="input-group">
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Ingrese correo electrónico"
                                                        value={correo}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <button type="submit" className="btn btn-success boton-buscar">
                                                        <FaSearch /> Buscar
                                                    </button>
                                                </form>
                                            </td>

                                            <td>{usuarioEncontrado ? usuarioEncontrado.correo : '---'}</td>
                                        </tr>
                                        <tr>

                                            <td>
                                                {error ? (
                                                    <div className="alert alert-danger">{error}</div>
                                                ) : (
                                                    usuarioEncontrado ? (
                                                        <button className="btn btn-secondary" onClick={handleUpdateClick} style={{ float: 'right' }}>
                                                            Actualizar
                                                        </button>
                                                    ) : (
                                                        '---'
                                                    )
                                                )}
                                            </td>
                                            <td>{usuarioEncontrado ? usuarioEncontrado.contrasena : '---'}</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modal para actualizar contraseña */}
            {showModal && (
                <div className="modal" style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-content">
                        <span className="close-btn" onClick={handleCloseModal}>&times;</span>
                        <h2>Actualizar Contraseña</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Nueva Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <br></br>
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                            {successMessage && <div className="alert alert-success">{successMessage}</div>}
                            <br></br>
                            <button type="submit" className="btn btn-success" onClick={handleUpdate}><FaCheck /> Actualizar</button>
                        </form>

                    </div>
                </div>
            )}
        </>
    );
};

export default Buscar_cotra;
