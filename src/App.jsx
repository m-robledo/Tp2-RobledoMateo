import React, { useState } from 'react';
import './App.css';

const RequisitoItem = ({ cumplido, texto }) => (
  <li className={cumplido ? "cumplido" : "pendiente"}>
    <span className="material-icons icono-check">
      {cumplido ? "check_circle" : "cancel"}
    </span>
    {texto}
  </li>
);

const GeneradorPro = ({ alGenerar }) => {
  const [config, setConfig] = useState({ largo: 12, simbolos: true, numeros: true });

  const crearPassword = () => {
    let caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (config.numeros) caracteres += "0123456789";
    if (config.simbolos) caracteres += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    let resultado = "";
    for (let i = 0; i < config.largo; i++) {
      resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    alGenerar(resultado);
  };

  return (
    <div className="generador-panel">
      <h3>Generador de contraseñas super seguras</h3>
      <div className="control">
        <label>Largo: {config.largo}</label>
        <input 
          type="range" min="8" max="32" 
          value={config.largo} 
          onChange={(e) => setConfig({...config, largo: parseInt(e.target.value)})} 
        />
      </div>
      <div className="checks">
        <label>
          <input type="checkbox" checked={config.numeros} onChange={(e) => setConfig({...config, numeros: e.target.checked})} /> Números
        </label>
        <label>
          <input type="checkbox" checked={config.simbolos} onChange={(e) => setConfig({...config, simbolos: e.target.checked})} /> Símbolos
        </label>
      </div>
      <button onClick={crearPassword} className="btn-generar">Generar Nueva Clave</button>
    </div>
  );
};

export default function App() {
  const [password, setPassword] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const validaciones = {
    largo: password.length >= 8,
    numero: /\d/.test(password),
    mayuscula: /[A-Z]/.test(password),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const calcularFortaleza = () => {
    const puntos = Object.values(validaciones).filter(Boolean).length;
    if (password.length === 0) return { texto: "Esperando...", color: "#ccc" };
    if (puntos <= 1) return { texto: "Poco segura", color: "#ff4d4d" };
    if (puntos <= 3) return { texto: "Segura", color: "#ffa500" };
    return { texto: "Muy segura", color: "#2ecc71" };
  };

  const fortaleza = calcularFortaleza();

  const copiarClave = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>ShieldPass <span className="material-icons">security</span></h1>
        
        <div className="input-group">
          <input 
            type={mostrar ? "text" : "password"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su clave ..."
          />
          <button onClick={() => setMostrar(!mostrar)} className="btn-ojo">
            <span className="material-icons">
              {mostrar ? "visibility" : "visibility_off"}
            </span>
          </button>
        </div>

        <button onClick={copiarClave} className="btn-copiar">
          {copiado ? "¡Copiado con éxito!" : "Copiar al portapapeles"}
        </button>
        <div className="fortaleza-barra">
          <div 
            className="progreso" 
            style={{ width: '100%', backgroundColor: fortaleza.color }}>
            {fortaleza.texto}
          </div>
        </div>
        <ul className="checklist">
          <RequisitoItem cumplido={validaciones.largo} texto="Mínimo 8 caracteres" />
          <RequisitoItem cumplido={validaciones.numero} texto="Al menos un número" />
          <RequisitoItem cumplido={validaciones.mayuscula} texto="Una letra mayúscula" />
          <RequisitoItem cumplido={validaciones.especial} texto="Un carácter especial" />
        </ul>
        <hr />
        <GeneradorPro alGenerar={setPassword} />
      </div>
    </div>
  );
}