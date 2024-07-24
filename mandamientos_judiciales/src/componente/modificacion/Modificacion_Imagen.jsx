import React from "react";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import "../styles/modificaciones.css"
import Titulo from "../menu/Titulo_registro";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";

const Modificacion_Imagen = ({ llave , datos}) => {
  const nombre   = datos[0].NOMBRE
  const apaterno = datos[0].APATERNO
  const amaterno = datos[0].AMATERNO
  const of_juz   = datos[0].OFICIO_JUZGADO

  return (
    <>
    <div className="componente-img">
      <div className="datos-nmod-img">
 
      <div className="row" id="lista-campos">
                <h5>Datos no modificables</h5>
                <div className="col-10">
                  <label className="form-label">NOMBRE</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    name="AMATERNO"
                    id="AMATERNO"
                    placeholder=""
                    defaultValue={nombre}
                  />
                </div>

                <div className="col-10">
                  <label className="form-label">A. PATERNO</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    name="ALIAS"
                    id="ALIAS"
                    placeholder=""
                    defaultValue={apaterno}
                  />
                </div>

                <div className="col-10">
                  <label className="form-label">A. MATERNO</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    name="ALIAS"
                    id="ALIAS"
                    placeholder=""
                    defaultValue={amaterno}
                  />
                </div>

                <div className="col-10">
                  <label className="form-label">OFICIO JUZGADO</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    name="ALIAS"
                    id="ALIAS"
                    placeholder=""
                    defaultValue={of_juz}
                  />
                </div>

              </div>



      </div>
      <div className="datos-lista-img">

      <div>Modificacion_imagen{llave}</div>

      </div>
    </div>
  </>
  )
}

export default Modificacion_Imagen