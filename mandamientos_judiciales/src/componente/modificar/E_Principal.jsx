import React, { useState, useEffect } from 'react';
import Menu from "../menu/MenuLateral";
import axios from 'axios';
import Titulo from "../menu/Titulo";
import { useParams } from "react-router-dom";
import E_datosgrls from './E_datosgrls';
import E_delitos from './E_delitos';
import E_proceso from './E_proceso';
import E_domicilio from './E_domicilio';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import E_otros_nom from './E_otros_nom';
import E_Amparos from './E_Amparos';
import E_ministerial from './E_ministerial';
import E_colaboracion from './E_colaboracion';
import E_media_filiacion from './E_media_filiacion';
import E_lista_imagen from './E_lista_imagen';
import CryptoJS from 'crypto-js';
import MenuModificar from '../menu/MenuModificar';
import useTokenLogin from '../../useTokenLogin';

export const E_Principal = () => {
    const hasToken = useTokenLogin();
    const { id, errorDescription } = useParams();

    const [showFormulario, setShowFormulario] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [decryptionError, setDecryptionError] = useState(null);
    const [originalText, setOriginalText] = useState('');

    useEffect(() => {
        if (id) {
            try {
                //const decodedId = decodeURIComponent(id);  // Decodifica el URI antes de desencriptar
                const bytes = CryptoJS.AES.decrypt(id, 'clave_secreta');
                const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
                if (decryptedText) {
                    setOriginalText(decryptedText);
                } else {
                    throw new Error("Desencriptación fallida");
                }
            } catch (error) {
                console.error("Error al desencriptar:", error);
                setDecryptionError("Error al desencriptar el ID");
            }
        }
    }, [id]);

    const mostrarFormulario = (formulario) => {
        if (showFormulario === formulario) {
            setShowFormulario(null);
        } else {
            setShowFormulario(formulario);
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div>Cargando...</div>
            </div>
        );
    }

    return (
        <>
            <Titulo />
            <MenuModificar />
            <div className={`contenedor_principal_t ${hasToken ? '' : 'd-none'}`}>
                {originalText && <h3 style={{color:'black'}}>No. Registro:  {originalText}</h3>}
                {decryptionError && <h4 style={{color:'black'}}>{decryptionError}</h4>}
                {!decryptionError && errorDescription && <h4 style={{color:'black'}}>Error: {errorDescription}</h4>}
                <br />
                <div className="row">
                    <div className="col-sm-12">
                        <div className="d-flex justify-content-between flex-wrap mb-3">
                            {['datos_Generales', 'delitos', 'proceso', 'domicilio', 'otros_nombres', 'amparos', 'ministerial', 'colaboracion', 'media_filiacion', 'imagen'].map((formulario, index) => (
                                <button
                                    key={index}
                                    className="btn btn-secondary btn-lg mx-2 my-1 custom-button"
                                    type="button"
                                    onClick={() => mostrarFormulario(formulario)}
                                >
                                    {formulario.charAt(0).toUpperCase() + formulario.slice(1).replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {originalText && (
                    <>
                        {showFormulario === 'datos_Generales' && <E_datosgrls id={originalText} />}
                        {showFormulario === 'delitos' && <E_delitos id={originalText} />}
                        {showFormulario === 'proceso' && <E_proceso id={originalText} />}
                        {showFormulario === 'domicilio' && <E_domicilio id={originalText} />}
                        {showFormulario === 'otros_nombres' && <E_otros_nom id={originalText} />}
                        {showFormulario === 'amparos' && <E_Amparos id={originalText} />}
                        {showFormulario === 'ministerial' && <E_ministerial id={originalText} />}
                        {showFormulario === 'colaboracion' && <E_colaboracion id={originalText} />}
                        {showFormulario === 'media_filiacion' && <E_media_filiacion id={originalText} />}
                        {showFormulario === 'imagen' && <E_lista_imagen id={originalText} />}
                    </>
                )}
            </div>
        </>
    );
};
