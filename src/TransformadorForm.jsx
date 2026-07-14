import React, { useEffect, useState } from "react";
import "./styles.css";
import InputData from "./InputData";

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

  /* ===================== DATOS HI VOLTAGE ===================== */
  const [hiVoltage, setHiVoltage] = useState(null);

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

  /* ===================== CARGAR INPUT DATA Y HI VOLTAGE ===================== */
  const handleInputDataClick = async (e, transformador) => {
    e.stopPropagation();

    // Cargar InputData y HiVoltage en paralelo
    const [inputDataRes, hiVoltageRes] = await Promise.allSettled([
      fetch(`https://Transformadores.somee.com/InputData/${transformador.referencia}`),
      fetch(`https://Transformadores.somee.com/HiVoltage/${transformador.referencia}`)
    ]);

    // Procesar InputData
    let inputDataLoaded = null;
    let inputDataMsg = "";
    
    if (inputDataRes.status === "fulfilled" && inputDataRes.value.ok) {
      try {
        inputDataLoaded = await inputDataRes.value.json();
        inputDataMsg = "✔ Input Data cargado";
      } catch {
        inputDataMsg = "⚠ Error al procesar Input Data";
      }
    } else {
      inputDataMsg = "❗ No se encontró Input Data para este transformador";
    }

    // Procesar HiVoltage
    let hiVoltageLoaded = null;
    
    if (hiVoltageRes.status === "fulfilled" && hiVoltageRes.value.ok) {
      try {
        hiVoltageLoaded = await hiVoltageRes.value.json();
        if (inputDataLoaded) {
          inputDataMsg += " | HiVoltage cargado";
        }
      } catch {
        console.warn("Error al procesar HiVoltage");
      }
    }

    // Actualizar estados
    setInputData(inputDataLoaded);
    setHiVoltage(hiVoltageLoaded);
    setReferenciaActual(transformador.referencia);
    setMostrarInputData(true);
    setMostrarPanel(false);
    setMensajeInputData(inputDataMsg);
  };

  /* ===================== CERRAR INPUT DATA ===================== */
  const handleCloseInputData = () => {
    setMostrarInputData(false);
  };

  /* ===================== RENDER ===================== */
  return (
    <div className={`product-container transformador-container ${mostrarInputData ? 'product-container--expanded' : ''}`}>

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
          <InputData
            inputData={inputData}
            hiVoltage={hiVoltage}
            referenciaActual={referenciaActual}
            transformadorId={formData.id}
            mensajeInputData={mensajeInputData}
            onClose={handleCloseInputData}
            onSave={(data) => {
              setInputData(data);
              setMensajeInputData("✔ Datos guardados correctamente");
            }}
          />
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
