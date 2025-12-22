import React from "react";

export default function InputData({ 
  inputData, 
  referenciaActual, 
  mensajeInputData, 
  onClose 
}) {

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
    if (key === "date") return "medium";
    if (value === null || value === undefined) return "small";
    if (typeof value === "number" && Number.isInteger(value)) return "small";
    if (typeof value === "number" && !Number.isInteger(value)) return "medium";
    if (typeof value === "string") {
      if (value.length > 20) return "large";
      if (value.length > 10) return "medium";
      return "small";
    }
    return "medium";
  };

  /* ===================== FORMATEAR VALOR ===================== */
  const formatValue = (key, value) => {
    if (value === null || value === undefined) return "-";
    if (key === "date" && value) {
      return new Date(value).toLocaleDateString("es-ES");
    }
    return value.toString();
  };

  /* ===================== RENDER ===================== */
  return (
    <div className="form-panel form-panel--wide">
      <div className="form-panel__header">
        <h3 className="form-panel__title">
          📊 Input Data - <span className="form-panel__ref">{referenciaActual}</span>
        </h3>
        <button
          className="form-panel__close"
          onClick={onClose}
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
  );
}