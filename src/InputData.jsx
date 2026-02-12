import React, { useState, useEffect, useRef } from "react";

export default function InputData({ 
  inputData: inputDataProp, 
  hiVoltage: hiVoltageProp,
  referenciaActual,
  transformadorId,
  mensajeInputData: mensajeInicial, 
  onClose,
  onSave
}) {

  /* ===================== ESTADO LOCAL ===================== */
  const [formData, setFormData] = useState(null);
  const [hiVoltageData, setHiVoltageData] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState(mensajeInicial || "");
  const [guardando, setGuardando] = useState(false);
  
  // Ref para controlar si acabamos de guardar
  const justSaved = useRef(false);

  /* ===================== INICIALIZAR HI VOLTAGE DATA ===================== */
  useEffect(() => {
    setHiVoltageData(hiVoltageProp || getEmptyHiVoltage());
  }, [hiVoltageProp]);

  /* ===================== ESTRUCTURA VACÍA DE HI VOLTAGE ===================== */
  const getEmptyHiVoltage = () => ({
    id: 0,
    transformadorId: 0,
    wire: "",
    stripSizeMin: 0,
    stripSizeMax: 0,
    parallCondGrossWireMin: 0,
    parallCondGrossWireMax: 0,
    nudeCondGrossWire: 0,
    nudeCond: 0,
    parallCondMin: 0,
    parallCondMax: 0
  });

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

  // Constante 10^3 = 1000
  const MIL = 1000;

  // Line Amp columna 2: Power / √3 / LineVoltHV1 * 1000
  const calcularLineAmpCol2 = () => {
    if (!formData) return 0;
    const { power, lineVoltHV1 } = formData;
    if (lineVoltHV1 === 0) return 0;
    const valor = (power / SQRT3 / lineVoltHV1) * MIL;
    return valor.toFixed(2);
  };

  // Line Amp columna 3: 
  // Si hVKIND = HV1: Power / √3 / (LineVoltHV1 + Fila2Col3) * 1000
  // Sino: Power / √3 / (LineVoltGuion + Fila2Col3) * 1000
  const calcularLineAmpCol3 = () => {
    if (!formData) return 0;
    const { power, hVKIND, lineVoltHV1, lineVoltGuion } = formData;
    const fila2Col3 = parseFloat(calcularLineVoltHV1Formula());
    const divisor = hVKIND === "HV1" 
      ? (lineVoltHV1 + fila2Col3) 
      : (lineVoltGuion + fila2Col3);
    if (divisor === 0) return 0;
    const valor = (power / SQRT3 / divisor) * MIL;
    return valor.toFixed(2);
  };

  // Line Amp columna 4: 
  // Si hVKIND = HV1: "-"
  // Sino: Power / √3 / LineVoltGuion * 1000
  const calcularLineAmpCol4 = () => {
    if (!formData) return "-";
    const { power, hVKIND, lineVoltGuion } = formData;
    if (hVKIND === "HV1") return "-";
    if (lineVoltGuion === 0) return 0;
    const valor = (power / SQRT3 / lineVoltGuion) * MIL;
    return valor.toFixed(2);
  };

  // Ph. Amp columna 2: 
  // Si conectionHV1 = D: (Power / 3) / LineVoltHV1 * 1000
  // Sino: (Power / √3) / LineVoltHV1 * 1000
  const calcularPhAmpCol2 = () => {
    if (!formData) return 0;
    const { power, conectionHV1, lineVoltHV1 } = formData;
    if (lineVoltHV1 === 0) return 0;
    const divisor = conectionHV1 === "D" ? 3 : SQRT3;
    const valor = (power / divisor / lineVoltHV1) * MIL;
    return valor.toFixed(2);
  };

  // Ph. Amp columna 3:
  // Si hVKIND = HV1:
  //   Si conectionHV1 = D: (Power / 3) / (LineVoltHV1 + fila2col3) * 1000
  //   Sino: (Power / √3) / (LineVoltHV1 + fila2col3) * 1000
  // Sino:
  //   Si conectionHV1 = D: (Power / 3) / (LineVoltGuion + fila2col3) * 1000
  //   Sino: (Power / √3) / (LineVoltGuion + fila2col3) * 1000
  const calcularPhAmpCol3 = () => {
    if (!formData) return 0;
    const { power, hVKIND, conectionHV1, lineVoltHV1, lineVoltGuion } = formData;
    const fila2Col3 = parseFloat(calcularLineVoltHV1Formula());
    const divisorPower = conectionHV1 === "D" ? 3 : SQRT3;
    const baseVolt = hVKIND === "HV1" ? lineVoltHV1 : lineVoltGuion;
    const divisorVolt = baseVolt + fila2Col3;
    if (divisorVolt === 0) return 0;
    const valor = (power / divisorPower / divisorVolt) * MIL;
    return valor.toFixed(2);
  };

  // Ph. Amp columna 4:
  // Si hVKIND = HV1: "-"
  // Sino:
  //   Si conectionHV1 = D: (Power / 3) / LineVoltGuion * 1000
  //   Sino: (Power / √3) / LineVoltGuion * 1000
  const calcularPhAmpCol4 = () => {
    if (!formData) return "-";
    const { power, hVKIND, conectionHV1, lineVoltGuion } = formData;
    if (hVKIND === "HV1") return "-";
    if (lineVoltGuion === 0) return 0;
    const divisor = conectionHV1 === "D" ? 3 : SQRT3;
    const valor = (power / divisor / lineVoltGuion) * MIL;
    return valor.toFixed(2);
  };

  // Variable VT:
  // Si conectionLV1 = "z": (lineVoltLV1 / √3) * 1.155 / turnsLV1
  // Sino:
  //   Si conectionLV1 = "d": lineVoltLV1 / turnsLV1
  //   Sino: (lineVoltLV1 / √3) / turnsLV1
  const calcularVT = () => {
    if (!formData) return 0;
    const { conectionLV1, lineVoltLV1, turnsLV1 } = formData;
    if (turnsLV1 === 0) return 0;
    
    if (conectionLV1 === "z") {
      return (lineVoltLV1 / SQRT3) * 1.155 / turnsLV1;
    } else if (conectionLV1 === "d") {
      return lineVoltLV1 / turnsLV1;
    } else {
      return (lineVoltLV1 / SQRT3) / turnsLV1;
    }
  };

  // Turns columna 2:
  // Si hVKIND = HV1: Math.trunc(fila4col2 / VT)
  // Sino: Math.trunc((fila4col2 - fila4col4) / VT)
  const calcularTurnsCol2 = () => {
    if (!formData) return 0;
    const { hVKIND } = formData;
    const VT = calcularVT();
    if (VT === 0) return 0;
    
    const fila4Col2 = parseFloat(calcularPhVoltCol2());
    const fila4Col4 = parseFloat(calcularPhVoltCol4()) || 0;
    
    if (hVKIND === "HV1") {
      return Math.trunc(fila4Col2 / VT);
    } else {
      return Math.trunc((fila4Col2 - fila4Col4) / VT);
    }
  };

  // Turns columna 3: Math.trunc(fila4col2 / VT)
  const calcularTurnsCol3 = () => {
    if (!formData) return 0;
    const VT = calcularVT();
    if (VT === 0) return 0;
    
    const fila4Col2 = parseFloat(calcularPhVoltCol2());
    return Math.trunc(fila4Col2 / VT);
  };

  // Turns columna 4:
  // Si hVKIND = HV1: "-"
  // Sino: Math.trunc(fila4col4 / VT)
  const calcularTurnsCol4 = () => {
    if (!formData) return "-";
    const { hVKIND } = formData;
    if (hVKIND === "HV1") return "-";
    
    const VT = calcularVT();
    if (VT === 0) return 0;
    
    const fila4Col4 = parseFloat(calcularPhVoltCol4()) || 0;
    return Math.trunc(fila4Col4 / VT);
  };

  /* ===================== FILA 8: SECTION ===================== */
  // Section columna 2:
  // Si Wire = "S": ((StripSizeMin * StripSizeMax) - 0.375) * ParallCondGrossWireMin * ParallCondGrossWireMax
  // Sino: Si hVKIND = "HV1": (π * (NudeCondGrossWire/2)²) * ParallCondGrossWireMin * ParallCondGrossWireMax
  //       Sino: (π * (NudeCond/2)²) * ParallCondMin * ParallCondMax
  const calcularSectionCol2 = () => {
    if (!formData || !hiVoltageData) return "0.00";
    const { hVKIND } = formData;
    const { wire, stripSizeMin, stripSizeMax, parallCondGrossWireMin, parallCondGrossWireMax, nudeCondGrossWire, nudeCond, parallCondMin, parallCondMax } = hiVoltageData;
    
    let resultado;
    if (wire === "S") {
      resultado = ((stripSizeMin * stripSizeMax) - 0.375) * parallCondGrossWireMin * parallCondGrossWireMax;
    } else {
      if (hVKIND === "HV1") {
        resultado = (Math.PI * Math.pow(nudeCondGrossWire / 2, 2)) * parallCondGrossWireMin * parallCondGrossWireMax;
      } else {
        resultado = (Math.PI * Math.pow(nudeCond / 2, 2)) * parallCondMin * parallCondMax;
      }
    }
    return resultado.toFixed(2);
  };

  // Section columna 3:
  // Si Wire = "S": ((StripSizeMin * StripSizeMax) - 0.375) * ParallCondGrossWireMin * ParallCondGrossWireMax
  // Sino: (π * (NudeCondGrossWire/2)²) * ParallCondGrossWireMin * ParallCondGrossWireMax
  const calcularSectionCol3 = () => {
    if (!hiVoltageData) return "0.00";
    const { wire, stripSizeMin, stripSizeMax, parallCondGrossWireMin, parallCondGrossWireMax, nudeCondGrossWire } = hiVoltageData;
    
    let resultado;
    if (wire === "S") {
      resultado = ((stripSizeMin * stripSizeMax) - 0.375) * parallCondGrossWireMin * parallCondGrossWireMax;
    } else {
      resultado = (Math.PI * Math.pow(nudeCondGrossWire / 2, 2)) * parallCondGrossWireMin * parallCondGrossWireMax;
    }
    return resultado.toFixed(2);
  };

  // Section columna 4:
  // Si hVKIND = "HV1": "-"
  // Sino: (π * (NudeCondGrossWire/2)²) * ParallCondGrossWireMin * ParallCondGrossWireMax
  const calcularSectionCol4 = () => {
    if (!formData || !hiVoltageData) return "-";
    const { hVKIND } = formData;
    if (hVKIND === "HV1") return "-";
    
    const { parallCondGrossWireMin, parallCondGrossWireMax, nudeCondGrossWire } = hiVoltageData;
    const resultado = (Math.PI * Math.pow(nudeCondGrossWire / 2, 2)) * parallCondGrossWireMin * parallCondGrossWireMax;
    return resultado.toFixed(2);
  };

  /* ===================== FILA 9: DENSITY ===================== */
  // Density columna 2: (fila6col2 / fila8col2).toFixed(2)
  const calcularDensityCol2 = () => {
    const fila6col2 = parseFloat(calcularPhAmpCol2()) || 0;
    const fila8col2 = parseFloat(calcularSectionCol2()) || 0;
    if (fila8col2 === 0) return "0.00";
    return (fila6col2 / fila8col2).toFixed(2);
  };

  // Density columna 3: (fila6col3 / fila8col3).toFixed(2)
  const calcularDensityCol3 = () => {
    const fila6col3 = parseFloat(calcularPhAmpCol3()) || 0;
    const fila8col3 = parseFloat(calcularSectionCol3()) || 0;
    if (fila8col3 === 0) return "0.00";
    return (fila6col3 / fila8col3).toFixed(2);
  };

  // Density columna 4: Si hVKIND = "HV1" → "-", sino (fila6col3 / VT).toFixed(2)
  const calcularDensityCol4 = () => {
    if (!formData) return "-";
    const { hVKIND } = formData;
    if (hVKIND === "HV1") return "-";
    
    const fila6col3 = parseFloat(calcularPhAmpCol3()) || 0;
    const VT = calcularVT();
    if (VT === 0) return "0.00";
    return (fila6col3 / VT).toFixed(2);
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

      <div className="form-panel__body form-panel__body--scroll" style={{ position: "relative" }}>
        
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

            {/* Fila 5: Line Amp. */}
            <div className="input-data-table__row">
              <div className="input-data-table__label">Line Amp.</div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularLineAmpCol2()}</span>
              </div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularLineAmpCol3()}</span>
              </div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularLineAmpCol4()}</span>
              </div>
            </div>

            {/* Fila 6: Ph. Amp. */}
            <div className="input-data-table__row">
              <div className="input-data-table__label">Ph. Amp.</div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularPhAmpCol2()}</span>
              </div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularPhAmpCol3()}</span>
              </div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularPhAmpCol4()}</span>
              </div>
            </div>

            {/* Fila 7: Turns */}
            <div className="input-data-table__row">
              <div className="input-data-table__label">Turns</div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularTurnsCol2()}</span>
              </div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularTurnsCol3()}</span>
              </div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularTurnsCol4()}</span>
              </div>
            </div>

            {/* Fila 8: Section */}
            <div className="input-data-table__row">
              <div className="input-data-table__label">Section</div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularSectionCol2()}</span>
              </div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularSectionCol3()}</span>
              </div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularSectionCol4()}</span>
              </div>
            </div>

            {/* Fila 9: Density */}
            <div className="input-data-table__row">
              <div className="input-data-table__label">Density</div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularDensityCol2()}</span>
              </div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularDensityCol3()}</span>
              </div>
              <div className="input-data-table__cell input-data-table__cell--calculated">
                <span className="input-data-table__value">{calcularDensityCol4()}</span>
              </div>
            </div>

            {/* Filas 10-14: Se añadirán después */}
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

        {/* ===================== INDICADOR HI VOLTAGE ===================== */}
        <div style={{ 
          position: "absolute", 
          bottom: "50px", 
          right: "15px", 
          fontSize: "0.6rem", 
          color: "#888",
          display: "flex",
          gap: "4px"
        }}>
          <span style={{ fontWeight: "600" }}>WIRE:</span>
          <span>{hiVoltageData?.wire || "-"}</span>
        </div>
      </div>
    </div>
  );
}