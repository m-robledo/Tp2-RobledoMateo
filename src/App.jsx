import React, { useState } from 'react';
import './App.css';

// COMPONENTE 1: Item individual
function RequisitoItem({ cumplido, texto }) {
  return (
    <li className={cumplido ? "cumplido" : "pendiente"}>
      <span className="material-icons">
        {cumplido ? "check_circle" : "radio_button_unchecked"}
      </span>
      {texto}
    </li>
  );
}

// COMPONENTE 2: Lista de requisitos (Ahora con 4 validaciones)
function Checklist({ validaciones }) {
  return (
    <ul className="lista-check">
      <RequisitoItem cumplido={validaciones.largo} texto="Mínimo 8 letras" />
      <RequisitoItem cumplido={validaciones.numero} texto="Al menos un número" />
      <RequisitoItem cumplido={validaciones.mayuscula} texto="Una mayúscula" />
      <RequisitoItem cumplido={validaciones.especial} texto="Carácter especial (@#$!)" />
    </ul>
  );
}

// COMPONENTE 3: Barra de fortaleza
function BarraFortaleza({ nivel }) {
  const niveles = {
    0: { texto: "Insegura", color: "#ccc" },
    1: { texto: "Débil", color: "#ff4d4d" },
    2: { texto: "Segura", color: "#ffa500" },
    3: { texto: "Muy segura", color: "#2ecc71" },
    4: { texto: "¡Excelente!", color: "#1d8348" } // Nivel extra por el carácter especial
  };

  const actual = niveles[nivel];

  return (
    <div className="barra-fondo">
      <div 
        className="barra-progreso" 
        style={{ width: '100%', backgroundColor: actual.color }}
      >
        {actual.texto}
      </div>
    </div>
  );
}

// COMPONENTE 4: Generador
function Generador({ alGenerar }) {
  const [largo, setLargo] = useState(12);

  function crearPassword() {
    // Agregamos caracteres especiales a la bolsa del generador
    const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let resultado = "";
    for (let i = 0; i < largo; i++) {
      resultado += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    alGenerar(resultado);
  }

  return (
    <div className="generador-box">
      <h3>Generador Pro</h3>
      <input type="range" min="6" max="20" value={largo} onChange={(e) => setLargo(e.target.value)} />
      <p>Largo: {largo}</p>
      <button onClick={crearPassword}>Generar</button>
    </div>
  );
}

// COMPONENTE 5: Orquestador Principal
export default function App() {
  const [password, setPassword] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // NUEVA VALIDACIÓN: Caracteres especiales
  const validaciones = {
    largo: password.length >= 8,
    numero: /\d/.test(password),
    mayuscula: /[A-Z]/.test(password),
    especial: /[!@#$%^&*(),.?":{}|<>_]/.test(password) // Verifica símbolos
  };

  // Contamos cuántos requisitos se cumplen
  const puntos = Object.values(validaciones).filter(Boolean).length;

  function copiar() {
    if (password === "") return;
    navigator.clipboard.writeText(password);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  }

  return (
    <div className="main-container">
      <div className="app-card">
        <h1>ShieldPass</h1>

        <div className="input-container">
          <input 
            type={mostrar ? "text" : "password"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña..."
          />
          <button className="btn-icon" onClick={() => setMostrar(!mostrar)}>
            <span className="material-icons">{mostrar ? "visibility" : "visibility_off"}</span>
          </button>
        </div>

        <button className="btn-copy" onClick={copiar}>
          {copiado ? "¡Copiado!" : "Copiar Contraseña"}
        </button>

        <BarraFortaleza nivel={puntos} />
        
        <Checklist validaciones={validaciones} />

        <hr />
        
        <Generador alGenerar={setPassword} />
      </div>
    </div>
  );
}