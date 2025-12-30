import React, { useState, useEffect, useRef } from "react";

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
  
  // Ref para controlar si acabamos de guardar
  const justSaved = useRef(false);

  /* ===================== INICIALIZAR FORM DATA ===================== */
  useEffect(() => {
    // Si acabamos de guardar, no sobrescribir
    if (justSaved.current) {
      justSaved.current = false;
      return;
    }
    
    if (inputDataProp) {
      setFormData(inputDataProp);
      setModoEdicion(false);
      setMensaje("");
    } else {
      setFormData(getEmptyInputData(transformadorId));
      setModoEdicion(true);
      setMensaje("");
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
    project: "PROJECT",
    customer: "CUSTOMER",
    power: "POWER",
    frecc: "Frecc.",
    cooling: "Cooling",
    standard: "STANDARD",
    date: "DATE"
  };

  /* ===================== CAMPOS DE LA PRIMERA FILA CON ANCHOS ===================== */
  const camposPrimeraFila = [
    { key: "project", width: "15%" },
    { key: "customer", width: "40%" },
    { key: "standard", width: "30%" },
    { key: "date", width: "15%" }
  ];

  /* ===================== CAMPOS DE LA TABLA IZQUIERDA ===================== */
  const camposTablaIzquierda = ["power", "frecc", "cooling"];

  /* ===================== TIPOS DE CAMPO ===================== */
  const camposNumericos = [
    "power", "frecc", 
    "hVTapNegNumero", "hVTapPosNumero",
    "hVTapNegRegulacion", "hVTapPosRegulacion",
    "hVTapNegMin", "hVTapPosMax",
    "lineVoltHV1", "lineVoltGuion"
  ];

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
      return value.split("T")[0];
    }
    return value.toString();
  };

  /* ===================== CAMPOS CALCULADOS ===================== */
  const calcularLineVoltHV1Formula = () => {
    if (!formData) return 0;
    const { hVTapPosNumero, hVTapPosRegulacion, lineVoltHV1 } = formData;
    return (hVTapPosNumero * hVTapPosRegulacion * lineVoltHV1 / 100).toFixed(2);
  };

  const getHV2Condicionado = () => {
    if (!formData) return "-";
    return formData.hVKIND === "HV2" ? "HV2" : "-";
  };

  // Constante para raíz cuadrada de 3
  const SQRT3 = Math.sqrt(3);

  // Ph. Volt columna 2: Si conectionHV1 = D -> lineVoltHV1, sino lineVoltHV1 / √3
  const calcularPhVoltCol2 = () => {
    if (!formData) return 0;
    const { conectionHV1, lineVoltHV1 } = formData;
    const valor = conectionHV1 === "D" ? lineVoltHV1 : lineVoltHV1 / SQRT3;
    return valor.toFixed(2);
  };

  // Ph. Volt columna 3: Si conectionHV1 = D -> fila2col3, sino fila2col3 / √3
  const calcularPhVoltCol3 = () => {
    if (!formData) return 0;
    const { conectionHV1 } = formData;
    const fila2Col3 = parseFloat(calcularLineVoltHV1Formula());
    const valor = conectionHV1 === "D" ? fila2Col3 : fila2Col3 / SQRT3;
    return valor.toFixed(2);
  };

  // Ph. Volt columna 4: Si hVKIND = HV1 -> "-", sino (Si conectionHV1 = D -> lineVoltGuion, sino lineVoltGuion / √3)
  const calcularPhVoltCol4 = () => {
    if (!formData) return "-";
    const { hVKIND, conectionHV1, lineVoltGuion } = formData;
    if (hVKIND === "HV1") return "-";
    const valor = conectionHV1 === "D" ? lineVoltGuion : lineVoltGuion / SQRT3;
    return valor.toFixed(2);
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
      
      // Marcar que acabamos de guardar para evitar que el useEffect sobrescriba
      justSaved.current = true;
      
      setFormData(data);  // Actualiza el estado local con los datos guardados
      setMensaje(formData.id === 0 
        ? `✔ Input Data creado con ID: ${data.id}` 
        : `✔ Input Data actualizado`
      );
      setModoEdicion(false);
      
      if (onSave) onSave(data);  // Notifica al padre con los nuevos datos
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
        
        {/* ===================== PRIMERA FILA: PROJECT, CUSTOMER, STANDARD, DATE ===================== */}
        <div className="input-data-row">
          {camposPrimeraFila.map(({ key, width }) => {
            const value = formData[key];
            const isDate = key === "date";

            return (
              <div className="input-data-row__item" style={{ width }} key={key}>
                <label className="input-data-row__label">
                  {inputDataLabels[key]}
                </label>
                <input
                  type={isDate ? "date" : "text"}
                  className={`input-data-row__input ${modoEdicion ? 'input-field--editable' : ''}`}
                  value={formatValue(key, value)}
                  onChange={(e) => handleChange(key, isDate ? e.target.value + "T00:00:00.000Z" : e.target.value)}
                  disabled={!modoEdicion}
                />
              </div>
            );
          })}
        </div>

        {/* ===================== CONTENEDOR DE TABLAS ===================== */}
        <div className="input-data-tables">
          
          {/* ===================== COLUMNA IZQUIERDA ===================== */}
          <div className="input-data-column">
            
            {/* ===================== TABLA POWER, FRECC, COOLING, HV TAP ===================== */}
            <div className="input-data-table input-data-table--single">
              {camposTablaIzquierda.map((key) => {
                const value = formData[key];
                const isNumeric = camposNumericos.includes(key);

                return (
                  <React.Fragment key={key}>
                    <div className="input-data-table__label">
                      {inputDataLabels[key]}
                    </div>
                    <div className="input-data-table__cell">
                      <input
                        type={isNumeric ? "number" : "text"}
                        step={isNumeric ? "any" : undefined}
                        className={`input-data-table__input ${modoEdicion ? 'input-field--editable' : ''}`}
                        value={formatValue(key, value)}
                        onChange={(e) => handleChange(key, e.target.value)}
                        disabled={!modoEdicion}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
              <div className="input-data-table__label">
                HV Tap
              </div>
            </div>

            {/* ===================== TABLA HV TAP (2 COLUMNAS) ===================== */}
            <div className="input-data-table input-data-table--double input-data-table--middle">
              <div className="input-data-table__row">
                <div className="input-data-table__label">-</div>
                <div className="input-data-table__label">+</div>
              </div>
              <div className="input-data-table__row">
                <div className="input-data-table__cell">
                  <input
                    type="number"
                    step="any"
                    className={`input-data-table__input ${modoEdicion ? 'input-field--editable' : ''}`}
                    value={formatValue("hVTapNegNumero", formData.hVTapNegNumero)}
                    onChange={(e) => handleChange("hVTapNegNumero", e.target.value)}
                    disabled={!modoEdicion}
                  />
                </div>
                <div className="input-data-table__cell">
                  <input
                    type="number"
                    step="any"
                    className={`input-data-table__input ${modoEdicion ? 'input-field--editable' : ''}`}
                    value={formatValue("hVTapPosNumero", formData.hVTapPosNumero)}
                    onChange={(e) => handleChange("hVTapPosNumero", e.target.value)}
                    disabled={!modoEdicion}
                  />
                </div>
              </div>
              <div className="input-data-table__row">
                <div className="input-data-table__cell">
                  <input
                    type="number"
                    step="any"
                    className={`input-data-table__input ${modoEdicion ? 'input-field--editable' : ''}`}
                    value={formatValue("hVTapNegRegulacion", formData.hVTapNegRegulacion)}
                    onChange={(e) => handleChange("hVTapNegRegulacion", e.target.value)}
                    disabled={!modoEdicion}
                  />
                </div>
                <div className="input-data-table__cell">
                  <input
                    type="number"
                    step="any"
                    className={`input-data-table__input ${modoEdicion ? 'input-field--editable' : ''}`}
                    value={formatValue("hVTapPosRegulacion", formData.hVTapPosRegulacion)}
                    onChange={(e) => handleChange("hVTapPosRegulacion", e.target.value)}
                    disabled={!modoEdicion}
                  />
                </div>
              </div>
              <div className="input-data-table__row">
                <div className="input-data-table__label">Min</div>
                <div className="input-data-table__label">Max</div>
              </div>
              <div className="input-data-table__row">
                <div className="input-data-table__cell">
                  <input
                    type="number"
                    step="any"
                    className={`input-data-table__input ${modoEdicion ? 'input-field--editable' : ''}`}
                    value={formatValue("hVTapNegMin", formData.hVTapNegMin)}
                    onChange={(e) => handleChange("hVTapNegMin", e.target.value)}
                    disabled={!modoEdicion}
                  />
                </div>
                <div className="input-data-table__cell">
                  <input
                    type="number"
                    step="any"
                    className={`input-data-table__input ${modoEdicion ? 'input-field--editable' : ''}`}
                    value={formatValue("hVTapPosMax", formData.hVTapPosMax)}
                    onChange={(e) => handleChange("hVTapPosMax", e.target.value)}
                    disabled={!modoEdicion}
                  />
                </div>
              </div>
            </div>

            {/* ===================== TABLA OIL KIND ===================== */}
            <div className="input-data-table input-data-table--single input-data-table--bottom">
              <div className="input-data-table__label">
                Oil Kind
              </div>
              <div className="input-data-table__cell">
                <input
                  type="text"
                  className={`input-data-table__input ${modoEdicion ? 'input-field--editable' : ''}`}
                  value={formatValue("oilKind", formData.oilKind)}
                  onChange={(e) => handleChange("oilKind", e.target.value)}
                  disabled={!modoEdicion}
                />
              </div>
            </div>

          </div>

          {/* ===================== TABLA 4 COLUMNAS (LINE VOLT, ETC) ===================== */}
          <div className="input-data-table input-data-table--quad">
            {/* Fila 1: Headers */}
            <div className="input-data-table__row">
              <div className="input-data-table__label"></div>
              <div className="input-data-table__label">HV1</div>
              <div className="input-data-table__label">{formData.hVKIND || "-"}</div>
              <div className="input-data-table__label">{getHV2Condicionado()}</div>
            </div>
            
            {/* Fila 2: Line Volt */}
            <div className="input-data-table__row">
              <div className="input-data-table__label">Line Volt</div>
              <div className="input-data-table__cell">
                <input
                  type="number"
                  step="any"
                  className={`input-data-table__input ${modoEdicion ? 'input-field--editable' : ''}`}
                  value={formatValue("lineVoltHV1", formData.lineVoltHV1)}
                  onChange={(e) => handleChange("lineVoltHV1", e.target.value)}
                  disabled={!modoEdicion}
                />
              </div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularLineVoltHV1Formula()}</span>
              </div>
              <div className="input-data-table__cell">
                <input
                  type="number"
                  step="any"
                  className={`input-data-table__input ${modoEdicion ? 'input-field--editable' : ''}`}
                  value={formatValue("lineVoltGuion", formData.lineVoltGuion)}
                  onChange={(e) => handleChange("lineVoltGuion", e.target.value)}
                  disabled={!modoEdicion}
                />
              </div>
            </div>

            {/* Fila 3: Conection */}
            <div className="input-data-table__row">
              <div className="input-data-table__label">Conection</div>
              <div className="input-data-table__cell">
                <input
                  type="text"
                  className={`input-data-table__input ${modoEdicion ? 'input-field--editable' : ''}`}
                  value={formatValue("conectionHV1", formData.conectionHV1)}
                  onChange={(e) => handleChange("conectionHV1", e.target.value)}
                  disabled={!modoEdicion}
                />
              </div>
              <div className="input-data-table__cell input-data-table__cell--readonly">
                <span className="input-data-table__value">{formData.conectionHV1 || "-"}</span>
              </div>
              <div className="input-data-table__cell input-data-table__cell--readonly">
                <span className="input-data-table__value">{formData.conectionHV1 || "-"}</span>
              </div>
            </div>

            {/* Fila 4: Ph. Volt */}
            <div className="input-data-table__row">
              <div className="input-data-table__label">Ph. Volt</div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularPhVoltCol2()}</span>
              </div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularPhVoltCol3()}</span>
              </div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularPhVoltCol4()}</span>
              </div>
            </div>

            {/* Filas 5-14: Se añadirán después */}
          </div>

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