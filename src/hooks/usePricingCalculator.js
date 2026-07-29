// src/hooks/usePricingCalculator.js
import { useState, useEffect } from 'react';
import { fetchPricingData } from '../services/sheetsService';

export function usePricingCalculator() {
  const [pricingData, setPricingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    idioma: '',
    modalidad: '',
    formato: '',
    plan: null,
    horario: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPricingData();
        setPricingData(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error crítico al cargar Google Sheets:", err);
        setError("No pudimos cargar los precios. Por favor, verifica tu conexión o intenta más tarde.");
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 1️⃣ SELECCIÓN CON AVANCE SEGURO Y TRANSICIÓN SUAVE (Sin rebotes de useEffect)
  const handleSelectIdioma = (idioma) => {
    const nombreIdioma = typeof idioma === 'object' ? idioma.nombre : idioma;
    setSelections({
      idioma: nombreIdioma,
      modalidad: null,
      formato: null,
      plan: null,
      horario: '',
    });
    setTimeout(() => {
      setStep(1);
    }, 250);
  };

  const handleSelectModalidad = (modKey, modValue) => {
    setSelections((prev) => ({
      ...prev,
      modalidad: { key: modKey, ...modValue },
      formato: null,
      plan: null,
      horario: '',
    }));
    setTimeout(() => {
      setStep(2);
    }, 250);
  };

  const handleSelectFormato = (formato) => {
    setSelections((prev) => ({
      ...prev,
      formato: formato,
      plan: null,
      horario: '',
    }));
    setTimeout(() => {
      setStep(3);
    }, 250);
  };

  const handleSelectPlan = (plan) => {
    setSelections((prev) => ({
      ...prev,
      plan: plan,
      horario: '',
    }));
    setTimeout(() => {
      setStep(4);
    }, 250);
  };

  const handleSelectHorario = (horario) => {
    setSelections((prev) => ({ ...prev, horario }));
  };

  // 2️⃣ NAVEGACIÓN INTELIGENTE (Solución al botón "Atrás")
  const handleNext = () => {
    if (step < 4) setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (step > 0) {
      // Limpiamos la selección del paso al que estamos regresando
      // para que el usuario pueda elegir tranquilamente sin que el sistema lo reubique solo.
      setSelections((prev) => {
        const reset = { ...prev };
        if (step === 1) reset.idioma = '';
        if (step === 2) reset.modalidad = null;
        if (step === 3) reset.formato = null;
        if (step === 4) reset.plan = null;
        return reset;
      });
      setStep((prev) => prev - 1);
    }
  };

  // 3️⃣ VALIDACIÓN DE BOTONES
  const isNextDisabled = () => {
    if (step === 0 && !selections.idioma) return true;
    if (step === 1 && !selections.modalidad) return true;
    if (step === 2 && !selections.formato) return true;
    if (step === 3 && !selections.plan) return true;
    if (step === 4) return true;
    return false;
  };

  // 4️⃣ LECTURA SEGURA DE DATOS
  const dataIdioma = selections.idioma ? pricingData?.[selections.idioma] : null;
  const modalKey = selections.modalidad?.key || selections.modalidad;
  const dataModalidad = dataIdioma?.modalidades?.[modalKey];
  const isWhatsAppReady = selections.horario !== '';

  // 5️⃣ GENERADOR DE MENSAJE WHATSAPP
  const enviarWhatsApp = () => {
    const telefono = "59169782201";
    const plan = selections.plan;

    const esPromo =
      plan.enPromocion === true ||
      plan.enPromocion === 'TRUE' ||
      plan.enPromocion === 'true';
    const esPorHora = plan.esPorHora === 'TRUE' || plan.esPorHora === true;

    const primeraCuota = esPromo
      ? Number(plan.primeraCuotaPromo || 0)
      : Number(plan.primeraCuotaRegular || (dataIdioma.matricula + plan.cuotaMontoRegular));

    const cuotaMensual = esPromo
      ? Number(plan.cuotaMontoPromo || 0)
      : Number(plan.cuotaMontoRegular || 0);

    const totalCuotas = Number(plan.cuotasCantidad || 1);
    const cuotasRestantes = totalCuotas - 1;

    const horarioDisplay =
      modalKey === 'onetoone'
        ? `A coordinar (Rangos: ${dataModalidad?.horarios.join(" | ")})`
        : selections.horario;

    let desgloseInversion ;

    if (esPorHora) {
      desgloseInversion = `*DESGLOSE DE INVERSIÓN${esPromo ? ` (${plan.etiquetaPromo})` : ''}:*
- 1ª Cuota (Matrícula + 1 Hora base): Bs. ${primeraCuota}

*TOTAL PARA EMPEZAR HOY:* Bs. ${primeraCuota}`;
    } else if (esPromo) {
      desgloseInversion = `*DESGLOSE DE INVERSIÓN (${plan.etiquetaPromo}):*
- 1ª Cuota (Inscripción + 1er Mes): Bs. ${primeraCuota}
${cuotasRestantes > 0 ? `- Siguientes ${cuotasRestantes} cuotas: Bs. ${cuotaMensual} / mes` : ''}

*TOTAL PARA EMPEZAR HOY:* Bs. ${primeraCuota}`;
    } else {
      desgloseInversion = `*DESGLOSE DE INVERSIÓN (REGULAR):*
- 1ª Cuota (Inscripción + 1er Mes): Bs. ${primeraCuota}
${cuotasRestantes > 0 ? `- Siguientes ${cuotasRestantes} cuotas: Bs. ${cuotaMensual} / mes` : ''}

*TOTAL PARA EMPEZAR HOY:* Bs. ${primeraCuota}`;
    }

    const mensaje = `¡Hola! Quiero cotizar mi inscripción en el Instituto Davinci:

*IDIOMA:* ${dataIdioma?.nombre}
*MODALIDAD:* ${dataModalidad?.nombre}
*FORMATO:* ${selections.formato}
*PLAN:* ${plan?.nombre}
*HORARIO:* ${horarioDisplay}

${desgloseInversion}`;

    window.open(
      `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`,
      '_blank'
    );
  };

  return {
    pricingData,
    isLoading,
    error,
    step,
    selections,
    dataIdioma,
    dataModalidad,
    isWhatsAppReady,
    handleSelectIdioma,
    handleSelectModalidad,
    handleSelectFormato,
    handleSelectPlan,
    handleSelectHorario,
    handleNext,
    handlePrev,
    isNextDisabled,
    enviarWhatsApp,
  };
}