import React, { useEffect, useState } from "react";
import "./styles.css";

export default function TransformadorForm() {

  /* ===================== LISTADO TRANSFORMADORES ===================== */
  const [transformadores, setTransformadores] = useState([]);

  /* ===================== FORMULARIO TRANSFORMADOR ===================== */
  const [modoConsulta, setModoConsulta] = useState(true);
  const [formData, setFormData] = useState({
    id: 0,
    nombre: "",
    referencia: "",
    detalle: ""
  });
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [mensaje, setMensaje] = useState("");

  /* ===================== PANEL INPUT DATA ===================== */
  const [inputData, setInputData] = useState(null);
  const [mostrarInputData, setMostrarInputData] = useState(false);
  const [mensajeInputData, setMensajeInputData] = useState("");
  const [referenciaActual, setReferenciaActual] = useState("");

  /* ===================== CARGA LISTA ===================== */
  useEffect(() => {
    cargarTransformadores();
  }, []);

  const cargarTransformadores = async () => {
    try {
      const res = await fetch(
        "https://Transformadores.somee.com/Transformadores/Lista"
      );
      const data = await res.json();
      setTransformadores(data.transformadores || []);
    } catch (err) {
      console.error("Error cargando transformadores", err);
    }
  };

  /* ===================== FUNCIONES FORMULARIO ===================== */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNuevo = () => {
    setFormData({ id: 0, nombre: "", referencia: "", detalle: "" });
    setMensaje("🆕 Introduzca datos para crear un transformador");
    setModoConsulta(false);
    setMostrarPanel(true);
    setMostrarInputData(false);
  };

  const handleCancel = () => {
    setFormData({ id: 0, nombre: "", referencia: "", detalle: "" });
    setMensaje("");
    setModoConsulta(true);
    setMostrarPanel(false);
  };

  const handleCreate = async () => {
    try {
      const res = await fetch("https://Transformadores.somee.com/Transformadores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        setMensaje("⚠ Error al crear transformador");
        return;
      }

      const data = await res.json();
      setMensaje(`✔ Transformador creado con ID: ${data.id || "?"}`);
      setModoConsulta(true);
      cargarTransformadores();
    } catch (err) {
      setMensaje("⚠ Error al crear transformador");
    }
  };

  const handleEdit = () => {
    setModoConsulta(false);
    setMensaje("✏️ Modo edición activado");
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`https://Transformadores.somee.com/Transformadores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        setMensaje("⚠ Error al actualizar transformador");
        return;
      }

      setMensaje(`✔ Transformador ${formData.id} actualizado`);
      setModoConsulta(true);
      cargarTransformadores();
    } catch (err) {
      setMensaje("⚠ Error al actualizar transformador");
    }
  };

  /* ===================== CLICK EN FILA ===================== */
  const handleFilaClick = (transformador) => {
    setFormData({
      id: transformador.id,
      nombre: transformador.nombre || "",
      referencia: transformador.referencia || "",
      detalle: transformador.detalle || ""
    });
    setModoConsulta(true);
    setMostrarPanel(true);
    setMostrarInputData(false);
    setMensaje(`✔ Transformador ${transformador.referencia} cargado`);
  };

  /* ===================== CARGAR INPUT DATA ===================== */
  const handleInputDataClick = async (e, transformador) => {
    e.stopPropagation();

    try {
      const res = await fetch(
        `https://Transformadores.somee.com/InputData/${transformador.referencia}`
      );

      if (!res.ok) {
        setMensajeInputData("❗ No se encontró Input Data para este transformador");
        setInputData(null);
        setReferenciaActual(transformador.referencia);
        setMostrarInputData(true);
        setMostrarPanel(false);
        return;
      }

      const data = await res.json();
      setInputData(data);
      setReferenciaActual(transformador.referencia);
      setMostrarInputData(true);
      setMostrarPanel(false);
      setMensajeInputData(`✔ Input Data cargado`);
    } catch (err) {
      setMensajeInputData("⚠ Error al consultar Input Data");
      setInputData(null);
      setReferenciaActual(transformador.referencia);
      setMostrarInputData(true);
      setMostrarPanel(false);
    }
  };

  /* ===================== LABELS LEGIBLES PARA INPUT DATA ===================== */
  const inputDataLabels = {
    project: "Proyecto",
    customer: "Cliente",
    power: "Potencia",
    frecc: "Frecuencia",
    cooling: "Refrigeración",
    hVTapNegNumero: "HV Tap Neg Número",
    hVTapNegRegulacion: "HV Tap Neg Regulación",
    hVTapNegMin: "HV Tap Neg Mín",
    hVTapPosNumero: "HV Tap Pos Número",
    hVTapPosRegulacion: "HV Tap Pos Regulación",
    hVTapPosMax: "HV Tap Pos Máx",
    oilKind: "Tipo de Aceite",
    standard: "Estándar",
    date: "Fecha",
    rev: "Revisión",
    type: "Tipo",
    oFNum: "OF Número",
    designer: "Diseñador",
    lineVoltHV1: "Voltaje Línea HV1",
    lineVoltGuion: "Voltaje Línea Guión",
    lineVoltLV1: "Voltaje Línea LV1",
    lineVoltVacio: "Voltaje Línea Vacío",
    lineVoltVacio2: "Voltaje Línea Vacío 2",
    conectionHV1: "Conexión HV1",
    conectionLV1: "Conexión LV1",
    conectionVacio2: "Conexión Vacío 2",
    turnsLV1: "Vueltas LV1",
    foils: "Láminas",
    altitude: "Altitud",
    tMax: "T Máx",
    hVBIL: "HV BIL",
    lVBIL: "LV BIL",
    hVKIND: "HV Kind",
    lVKIND: "LV Kind",
    nLLosses: "NL Losses",
    llosses: "L Losses",
    hVMAT: "HV Material",
    lVMAT: "LV Material",
    noise: "Ruido",
    sC: "SC",
    noiseKP: "Noise KP",
    noiseKHi: "Noise KHi",
    noiseKSB: "Noise KSB",
    noiseKV: "Noise KV",
    kRBT: "KRBT",
    kRAB: "KRAB"
  };

  /* ===================== CAMPOS A OCULTAR ===================== */
  const camposOcultos = ["id", "transformadorId"];

  /* ===================== DETERMINAR TAMAÑO DEL CAMPO ===================== */
  const getFieldSize = (key, value) => {
    // Si es fecha
    if (key === "date") return "medium";
    
    // Si el valor es null o undefined
    if (value === null || value === undefined) return "small";
    
    // Si es número entero
    if (typeof value === "number" && Number.isInteger(value)) return "small";
    
    // Si es número decimal
    if (typeof value === "number" && !Number.isInteger(value)) return "medium";
    
    // Si es string
    if (typeof value === "string") {
      if (value.length > 20) return "large";
      if (value.length > 10) return "medium";
      return "small";
    }
    
    return "medium";
  };

  const formatValue = (key, value) => {
    if (value === null || value === undefined) return "-";
    if (key === "date" && value) {
      return new Date(value).toLocaleDateString("es-ES");
    }
    return value.toString();
  };

  /* ===================== RENDER ===================== */
  return (
    <div className={`product-container ${mostrarInputData ? 'product-container--expanded' : ''}`}>

      {/* ===================== HEADER ===================== */}
      <header className="product-header">
        <h1 className="product-header__title">
          ⚡ Gestor de Transformadores
        </h1>
        <div className="product-header__buttons">
          <button
            className="btn-header btn-header--nuevo"
            onClick={handleNuevo}
          >
            ➕ Nuevo Transformador
          </button>
          <button
            className="btn-header btn-header--toggle"
            onClick={() => {
              if (mostrarPanel) {
                setMostrarPanel(false);
              } else if (mostrarInputData) {
                setMostrarInputData(false);
              } else {
                setMostrarPanel(true);
              }
            }}
          >
            {(mostrarPanel || mostrarInputData) ? "◀ Ocultar Panel" : "▶ Mostrar Panel"}
          </button>
        </div>
      </header>

      <div className="product-content">

        {/* ===================== PANEL FORMULARIO TRANSFORMADOR ===================== */}
        {mostrarPanel && (
          <div className="form-panel">
            <div className="form-panel__header">
              <h3 className="form-panel__title">
                {modoConsulta 
                  ? "📋 Detalle del Transformador" 
                  : formData.id === 0 
                    ? "✏️ Nuevo Transformador" 
                    : "✏️ Editar Transformador"
                }
              </h3>
              <button
                className="form-panel__close"
                onClick={() => setMostrarPanel(false)}
              >
                ✕
              </button>
            </div>

            <div className="form-panel__body">
              <div className="input-group">
                <label className="input-label">ID</label>
                <input
                  name="id"
                  type="number"
                  value={formData.id}
                  className="input-field"
                  disabled
                />
              </div>

              <div className="input-group">
                <label className="input-label">Nombre</label>
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del transformador"
                  disabled={modoConsulta}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Referencia</label>
                <input
                  name="referencia"
                  value={formData.referencia}
                  onChange={handleChange}
                  placeholder="Referencia"
                  disabled={modoConsulta}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Detalle</label>
                <textarea
                  name="detalle"
                  value={formData.detalle}
                  onChange={handleChange}
                  placeholder="Detalle del transformador"
                  disabled={modoConsulta}
                  className="textarea-field"
                />
              </div>

              <div className="btn-group">
                {modoConsulta ? (
                  <>
                    <button onClick={handleNuevo} className="btn-primary">
                      ➕ Nuevo
                    </button>
                    {formData.id !== 0 && (
                      <button onClick={handleEdit} className="btn-secondary">
                        ✏️ Editar
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {formData.id === 0 ? (
                      <button onClick={handleCreate} className="btn-primary">
                        ✔ Crear
                      </button>
                    ) : (
                      <button onClick={handleUpdate} className="btn-primary">
                        ✔ Guardar
                      </button>
                    )}
                    <button onClick={handleCancel} className="btn-danger">
                      ✖ Cancelar
                    </button>
                  </>
                )}
              </div>

              {mensaje && <div className="mensaje">{mensaje}</div>}
            </div>
          </div>
        )}

        {/* ===================== PANEL INPUT DATA ===================== */}
        {mostrarInputData && (
          <div className="form-panel form-panel--wide">
            <div className="form-panel__header">
              <h3 className="form-panel__title">
                📊 Input Data - <span className="form-panel__ref">{referenciaActual}</span>
              </h3>
              <button
                className="form-panel__close"
                onClick={() => setMostrarInputData(false)}
              >
                ✕
              </button>
            </div>

            <div className="form-panel__body form-panel__body--scroll">
              {inputData ? (
                <div className="input-data-grid">
                  {Object.entries(inputData)
                    .filter(([key]) => !camposOcultos.includes(key))
                    .map(([key, value]) => {
                      const size = getFieldSize(key, value);
                      return (
                        <div 
                          className={`input-data-item input-data-item--${size}`} 
                          key={key}
                        >
                          <label className="input-label">
                            {inputDataLabels[key] || key}
                          </label>
                          <input
                            className="input-field"
                            value={formatValue(key, value)}
                            disabled
                          />
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p>No hay datos disponibles</p>
              )}

              {mensajeInputData && <div className="mensaje">{mensajeInputData}</div>}
            </div>
          </div>
        )}

        {/* ===================== LISTADO ===================== */}
        <div className="list-panel">
          <div className="list-panel__header">
            <h3 className="list-panel__title">
              📦 Listado de Transformadores ({transformadores.length})
            </h3>
          </div>

          <div className={`list-panel__body ${(mostrarPanel || mostrarInputData) ? 'list-panel__body--expanded' : ''}`}>
            <table className="product-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Referencia</th>
                  <th>Detalle</th>
                  <th className="th--center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {transformadores.map((t) => (
                  <tr key={t.id} onClick={() => handleFilaClick(t)}>
                    <td>{t.id}</td>
                    <td>{t.nombre}</td>
                    <td>{t.referencia}</td>
                    <td>{t.detalle}</td>
                    <td className="td--center">
                      <button
                        className="btn-table btn-table--info"
                        onClick={(e) => handleInputDataClick(e, t)}
                      >
                        📊 Input Data
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
