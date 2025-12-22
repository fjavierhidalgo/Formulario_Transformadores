import React, { useState, useEffect } from "react";

export default function InputData({ 
  inputData: inputDataProp, 
  referenciaActual,
  transformadorId,
  mensajeInputData: mensajeInicial, 
  onClose,
  onSave
}) {

  /* ===================== ESTADO LOCAL ===================== */
  const [formData, setFormData] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState(mensajeInicial || "");
  const [guardando, setGuardando] = useState(false);

  /* ===================== INICIALIZAR FORM DATA ===================== */
  useEffect(() => {
    if (inputDataProp) {
      setFormData(inputDataProp);
      setModoEdicion(false);
    } else {
      // Crear nuevo registro con valores por defecto
      setFormData(getEmptyInputData(transformadorId));
      setModoEdicion(true);
    }
  }, [inputDataProp, transformadorId]);

  /* ===================== ESTRUCTURA VACÍA DE INPUT DATA ===================== */
  const getEmptyInputData = (transId) => ({
    id: 0,
    transformadorId: transId || 0,
    project: "",
    customer: "",
    power: 0,
    frecc: 0,
    cooling: "",
    hVTapNegNumero: 0,
    hVTapNegRegulacion: 0,
    hVTapNegMin: 0,
    hVTapPosNumero: 0,
    hVTapPosRegulacion: 0,
    hVTapPosMax: 0,
    oilKind: "",
    standard: "",
    date: new Date().toISOString(),
    rev: "",
    type: "",
    oFNum: "",
    designer: "",
    lineVoltHV1: 0,
    lineVoltGuion: 0,
    lineVoltLV1: 0,
    lineVoltVacio: 0,
    lineVoltVacio2: 0,
    conectionHV1: "",
    conectionLV1: "",
    conectionVacio2: "",
    turnsLV1: 0,
    foils: 0,
    altitude: 0,
    tMax: 0,
    hVBIL: "",
    lVBIL: "",
    hVKIND: "",
    lVKIND: "",
    nLLosses: "",
    llosses: "",
    hVMAT: "",
    lVMAT: "",
    noise: 0,
    sC: 0,
    noiseKP: "",
    noiseKHi: "",
    noiseKSB: "",
    noiseKV: "",
    kRBT: 0,
    kRAB: 0
  });

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

  /* ===================== TIPOS DE CAMPO ===================== */
  const camposNumericos = [
    "power", "frecc", "hVTapNegNumero", "hVTapNegRegulacion", "hVTapNegMin",
    "hVTapPosNumero", "hVTapPosRegulacion", "hVTapPosMax", "lineVoltHV1",
    "lineVoltGuion", "lineVoltLV1", "lineVoltVacio", "lineVoltVacio2",
    "turnsLV1", "foils", "altitude", "tMax", "noise", "sC", "kRBT", "kRAB"
  ];

  /* ===================== DETERMINAR TAMAÑO DEL CAMPO ===================== */
  const getFieldSize = (key, value) => {
    if (key === "date") return "medium";
    if (camposNumericos.includes(key)) return "small";
    if (typeof value === "string") {
      if (value.length > 20) return "large";
      if (value.length > 10) return "medium";
      return "medium";
    }
    return "medium";
  };

  /* ===================== MANEJAR CAMBIOS ===================== */
  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: camposNumericos.includes(key) ? parseFloat(value) || 0 : value
    }));
  };

  /* ===================== FORMATEAR VALOR PARA MOSTRAR ===================== */
  const formatValue = (key, value) => {
    if (value === null || value === undefined) return "";
    if (key === "date" && value) {
      // Para input type="date" necesitamos formato YYYY-MM-DD
      if (modoEdicion) {
        return value.split("T")[0];
      }
      return new Date(value).toLocaleDateString("es-ES");
    }
    return value.toString();
  };

  /* ===================== GUARDAR ===================== */
  const handleGuardar = async () => {
    setGuardando(true);
    try {
      const res = await fetch("https://Transformadores.somee.com/InputData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        setMensaje("⚠ Error al guardar Input Data");
        setGuardando(false);
        return;
      }

      const data = await res.json();
      setFormData(data);
      setMensaje(formData.id === 0 
        ? `✔ Input Data creado con ID: ${data.id}` 
        : `✔ Input Data actualizado`
      );
      setModoEdicion(false);
      
      if (onSave) onSave(data);
    } catch (err) {
      setMensaje("⚠ Error al guardar Input Data");
    }
    setGuardando(false);
  };

  /* ===================== CANCELAR EDICIÓN ===================== */
  const handleCancelar = () => {
    if (inputDataProp) {
      setFormData(inputDataProp);
      setModoEdicion(false);
      setMensaje("");
    } else {
      onClose();
    }
  };

  /* ===================== RENDER ===================== */
  if (!formData) return null;

  return (
    <div className="form-panel form-panel--wide">
      <div className="form-panel__header">
        <h3 className="form-panel__title">
          📊 Input Data - <span className="form-panel__ref">{referenciaActual}</span>
          {formData.id === 0 && <span className="badge-new">Nuevo</span>}
        </h3>
        <button
          className="form-panel__close"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className="form-panel__body form-panel__body--scroll">
        <div className="input-data-grid">
          {Object.entries(formData)
            .filter(([key]) => !camposOcultos.includes(key))
            .map(([key, value]) => {
              const size = getFieldSize(key, value);
              const isNumeric = camposNumericos.includes(key);
              const isDate = key === "date";

              return (
                <div 
                  className={`input-data-item input-data-item--${size}`} 
                  key={key}
                >
                  <label className="input-label">
                    {inputDataLabels[key] || key}
                  </label>
                  <input
                    type={isDate ? "date" : isNumeric ? "number" : "text"}
                    step={isNumeric ? "any" : undefined}
                    className={`input-field ${modoEdicion ? 'input-field--editable' : ''}`}
                    value={formatValue(key, value)}
                    onChange={(e) => handleChange(key, isDate ? e.target.value + "T00:00:00.000Z" : e.target.value)}
                    disabled={!modoEdicion}
                  />
                </div>
              );
            })}
        </div>

        {/* ===================== BOTONES ===================== */}
        <div className="btn-group" style={{ marginTop: "20px" }}>
          {modoEdicion ? (
            <>
              <button 
                onClick={handleGuardar} 
                className="btn-primary"
                disabled={guardando}
              >
                {guardando ? "⏳ Guardando..." : "✔ Guardar"}
              </button>
              <button onClick={handleCancelar} className="btn-danger">
                ✖ Cancelar
              </button>
            </>
          ) : (
            <button onClick={() => setModoEdicion(true)} className="btn-primary">
              ✏️ Editar
            </button>
          )}
        </div>

        {mensaje && <div className="mensaje">{mensaje}</div>}
      </div>
    </div>
  );
}