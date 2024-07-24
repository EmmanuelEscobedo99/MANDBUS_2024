import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

import Alta from './componente/registro/Registrar';
import Ver from './componente/ver_registros/Ver_registro';
import Ver_validados from './componente/ver_registros/Ver_validados';
import Delitos from './componente/registro/Delitos';
import Proceso from './componente/registro/Proceso';
import Inicio from './componente/registro/Inicio_registrar';
import Domicilio from './componente/registro/Domicilio';
import Menu_inter from './componente/registro/Menu_intermedio';
import Prueba from './componente/registro/RegistroEj';
import Otro_nomb from './componente/registro/Otros_nombres';
import Amparos from './componente/registro/Amparos';
import Ministerial from './componente/registro/Ministerial';
import Colaboracion from './componente/registro/Colaboracion';
import Imagen from './componente/registro/Imagen';
import Media_filacion from './componente/registro/Media_filacion';
import E_datosgrls from './componente/modificar/E_datosgrls';
import { E_Principal } from './componente/modificar/E_Principal';
import Ver_tablas from './componente/ver_registros/Ver_tablas';
import Ver_errores from './componente/ver_registros/Ver_errores';
import Login from './componente/Login';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import { Buscar_cotra } from './componente/ver_registros/Buscar_cotra';
import Titulo_registro from './componente/menu/Titulo_registro';
import Modificacion from './componente/modificacion/Modificacion';
import Baja from './componente/baja/Baja';
import RegistroBaja from './componente/baja/RegistroBaja';
import Menu_opcional from './componente/registro/Menu_opcional';
import Modificar_reg_mf from './componente/registro/Modificar_reg_mf';
import Modif_reg from './componente/modificacion/Modif_reg';
import Titulo_mo from './componente/menu/Titulo_mo';
import Modif_sel_delitos from "./componente/modificacion/Modificacion_seleccion_delitos"
import Modif_agregar from "./componente/modificacion/Modificacion_delitos_agregar"
import Mod_amp_agregar from "./componente/modificacion/Modificacion_Amparo_agregar"
import Modif_sel_amparo from "./componente/modificacion/Modificacion_amparo_selec"
import Aviso from "./componente/modificacion/Modificacion_aviso"




import Menu_opc from "./componente/registro/Menu_opcional"
import Titulo_reg from "./componente/menu/Titulo_registro"
import ModRegMf from "./componente/registro/Modificar_reg_mf"
import CompBa from "./componente/baja/Baja"
import CompReg from "./componente/baja/RegistroBaja"
import Mod_registro from "./componente/modificacion/Modif_reg"
import Busqueda from "./componente/modificar/Busqueda"


function App() {
  const [count, setCount] = useState(0);

  return (

    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/ver" element={<Ver />} />
          <Route path="/VerTablas" element={<Ver_tablas />} />
          <Route path="/VerValidados" element={<Ver_validados />} />
          <Route path="/VerErrores" element={<Ver_errores />} />
          <Route path="/BuscarContra" element={<Buscar_cotra />} />
          <Route path="/o_nombre" element={<Otro_nomb />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Delitos" element={<Delitos />} />
          <Route path="/Proceso" element={<Proceso />} />
          <Route path="/Domicilio" element={<Domicilio />} />
          <Route path="/Minter" element={<Menu_inter />} />
          <Route path="/amparos" element={<Amparos />} />
          <Route path="/ministerial" element={<Ministerial />} />
          <Route path="/colaboracion" element={<Colaboracion />} />
          <Route path="/mediafiliacion" element={<Media_filacion />} />
          <Route path="/Prueba" element={<Prueba />} />
          <Route path="/imagen" element={<Imagen />} />
          <Route path="/Editar" element={<E_datosgrls />} />
          <Route path="/Modificar/:id/:errorDescription?" element={<E_Principal />} />

          <Route path="/" element={<Inicio />}></Route>
          <Route path="/Alta" element={<Alta />}></Route>
          <Route path="/MenuOpcional" element={<Menu_opcional />}></Route>
          <Route path="/Delitos" element={<Delitos />}></Route> {/* quitar parametro   */}
          <Route path="/Proceso" element={<Proceso />} />
          <Route path="/Domicilio" element={<Domicilio />}></Route>
          <Route path="/o_nombre" element={<Otro_nomb />}></Route>
          <Route path="/amparos" element={<Amparos />}></Route>
          <Route path="/mediafiliacion" element={<Media_filacion />}></Route>
          <Route path="/ministerial" element={<Ministerial />}></Route>
          <Route path="/colaboracion" element={<Colaboracion />}></Route>
          <Route path="/imagen" element={<Imagen />}></Route>

          <Route path="/Minter" element={<Menu_inter />}></Route>
          <Route path="/editarRegMf/:ID_MEDIA_EXT/:LLAVE" element={<Modificar_reg_mf />}></Route>
          <Route path="/Editar" element={<E_datosgrls />}></Route>
          <Route path="/Modificar" element={<E_Principal />}></Route>
          <Route path="/Titulo_mo" element={<Titulo_mo />}></Route>
          <Route path="/menu_opc" element={<Menu_opcional />}></Route>
          <Route path="/Titulo_reg" element={<Titulo_registro />}></Route>

          <Route path="/comba" element={<Baja />}></Route>
          <Route path="/comRe" element={<RegistroBaja />}></Route>


          <Route path="/modificacion" element={<Modificacion />}></Route>
          <Route path="/compo_mod" element={<Modif_reg />}></Route>

          <Route path="/selec_del" element={<Modif_sel_delitos />}></Route>
          <Route path="/mod_mas" element={<Modif_agregar />}></Route>

          <Route path="/mod_amp_agregar" element={<Mod_amp_agregar />}></Route>
          <Route path="/mod_amp_sel" element={<Modif_sel_amparo />}></Route>

          <Route path="/aviso" element={<Aviso />}></Route>



          <Route path="/menu_opc" element={<Menu_opc/>}></Route>
          <Route path="/Titulo_reg" element={<Titulo_reg/>}></Route>
          <Route path="/editarRegMf/:ID_MEDIA_EXT/:LLAVE" element={<ModRegMf/>}></Route>
          <Route path="/comba"  element={<CompBa/>}></Route> 
          <Route path="/comRe"  element={<CompReg/>}></Route>
          <Route path="/compo_mod"  element={<Mod_registro/>}></Route> 
          <Route path="/busqueda"  element={<Busqueda/>}></Route> 

        </Routes>
      </AuthProvider>
    </BrowserRouter>

  );
}

export default App;
