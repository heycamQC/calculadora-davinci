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

  const handleSelectIdioma = (idioma) => {
    setSelections({ idioma, modalidad: '', formato: '', plan: null, horario: '' });
  };

  const handleSelectModalidad = (modalidad) => {
    setSelections((prev) => ({ ...prev, modalidad, formato: '', plan: null, horario: '' }));
  };

  const handleSelectFormato = (formato) => {
    if (selections.modalidad === 'onetoone') {
      setSelections((prev) => ({ 
        ...prev, 
        formato, 
        plan: null,
        horario: 'A coordinar (Rango disponible)' 
      }));
    } else {
      setSelections((prev) => ({ ...prev, formato, plan: null, horario: '' }));
    }
  };

  const handleSelectPlan = (plan) => {
    setSelections((prev) => ({ ...prev, plan }));
  };

  const handleSelectHorario = (horario) => {
    setSelections((prev) => ({ ...prev, horario }));
  };

  const handleNext = () => { if (step < 4) setStep(step + 1); };
  const handlePrev = () => { if (step > 0) setStep(step - 1); };

  const isNextDisabled = () => {
    if (step === 0 && !selections.idioma) return true;
    if (step === 1 && !selections.modalidad) return true;
    if (step === 2 && !selections.formato) return true;
    if (step === 3 && !selections.plan) return true;
    if (step === 4) return true; 
    return false;
  };

  const dataIdioma = selections.idioma ? pricingData?.[selections.idioma] : null;
  const dataModalidad = dataIdioma?.modalidades?.[selections.modalidad];
  const isWhatsAppReady = selections.horario !== '';

  const enviarWhatsApp = () => {
    const telefono = "59160119014"; 
    const plan = selections.plan;
    
    // Verificación estricta del estado de promoción 
    const esPromo = plan.enPromocion === true || plan.enPromocion === 'TRUE' || plan.enPromocion === 'true';
    const esPorHora = plan.esPorHora === 'TRUE' || plan.esPorHora === true;

    const primeraCuota = esPromo
      ? Number(plan.primeraCuotaPromo || 0)
      : Number(plan.primeraCuotaRegular || (dataIdioma.matricula + plan.cuotaMontoRegular));

    const cuotaMensual = esPromo
      ? Number(plan.cuotaMontoPromo || 0)
      : Number(plan.cuotaMontoRegular || 0);

    const totalCuotas = Number(plan.cuotasCantidad || 1);
    const cuotasRestantes = totalCuotas - 1;

    const horarioDisplay = selections.modalidad === 'onetoone' 
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

    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
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