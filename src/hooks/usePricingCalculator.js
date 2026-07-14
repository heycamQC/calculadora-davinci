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
    plan: null,
    formato: '',
    horario: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPricingData();
        setPricingData(data);
        setIsLoading(false);
      } catch (err) {
        // Solución al linter: Ahora registramos el error técnico en consola
        console.error("Error crítico al cargar Google Sheets:", err);
        setError("No pudimos cargar los precios. Por favor, verifica tu conexión o intenta más tarde.");
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSelectIdioma = (idioma) => {
    setSelections({ idioma, modalidad: '', plan: null, formato: '', horario: '' });
  };

  const handleSelectModalidad = (modalidad) => {
    setSelections((prev) => ({ ...prev, modalidad, plan: null, formato: '', horario: '' }));
  };

  const handleSelectPlan = (plan) => {
    setSelections((prev) => ({ ...prev, plan }));
  };

  const handleSelectFormato = (formato) => {
    if (selections.modalidad === 'onetoone') {
      setSelections((prev) => ({ 
        ...prev, 
        formato, 
        horario: 'A coordinar (Rango disponible)' 
      }));
    } else {
      setSelections((prev) => ({ ...prev, formato, horario: '' }));
    }
  };

  const handleSelectHorario = (horario) => {
    setSelections((prev) => ({ ...prev, horario }));
  };

  const handleNext = () => { if (step < 3) setStep(step + 1); };
  const handlePrev = () => { if (step > 0) setStep(step - 1); };

  const isNextDisabled = () => {
    if (step === 0 && !selections.idioma) return true;
    if (step === 1 && !selections.modalidad) return true;
    if (step === 2 && !selections.plan) return true;
    if (step === 3) return true; 
    return false;
  };

  const dataIdioma = selections.idioma ? pricingData?.[selections.idioma] : null;
  const dataModalidad = dataIdioma?.modalidades?.[selections.modalidad];
  const isWhatsAppReady = selections.formato !== '' && selections.horario !== '';

  const enviarWhatsApp = () => {
    const telefono = "59170000000"; 
    const totalInicial = (dataIdioma?.matricula || 0) + (selections.plan?.precio || 0);
    const horarioDisplay = selections.modalidad === 'onetoone' 
      ? `A coordinar (Rangos: ${dataModalidad?.horarios.join(" | ")})` 
      : selections.horario;
    
    const mensaje = `¡Hola! Quiero cotizar mi inscripción en el Instituto Davinci:

*IDIOMA:* ${dataIdioma?.nombre}
*MODALIDAD:* ${dataModalidad?.nombre}
*FORMATO:* ${selections.formato}
*HORARIO:* ${horarioDisplay}

*DESGLOSE DE INVERSIÓN:*
- Matrícula: Bs. ${dataIdioma?.matricula}
- ${selections.plan?.nombre}: Bs. ${selections.plan?.precio}

*TOTAL INICIAL REFERENCIAL:* Bs. ${totalInicial}`;

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
    handleSelectPlan,
    handleSelectFormato,
    handleSelectHorario,
    handleNext,
    handlePrev,
    isNextDisabled,
    enviarWhatsApp,
  };
}