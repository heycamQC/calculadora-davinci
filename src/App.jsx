import { usePricingCalculator } from './hooks/usePricingCalculator';
import WizardHeader from './components/WizardHeader';
import StepIdioma from './components/StepIdioma';
import StepModalidad from './components/StepModalidad';
import StepPlan from './components/StepPlan';
import StepResumen from './components/StepResumen';
import WizardFooter from './components/WizardFooter';
import './App.css';

function App() {
  const {
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
  } = usePricingCalculator();

  if (isLoading) {
    return (
      <div className="app-wrapper">
        <main className="wizard-card" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <h2>Conectando con el Instituto... ⏳</h2>
          <p style={{ color: '#6b7280', marginTop: '10px' }}>Cargando tarifas actualizadas</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-wrapper">
        <main className="wizard-card" style={{ justifyContent: 'center', alignItems: 'center', padding: '20px', textAlign: 'center' }}>
          <h2 style={{ color: '#d52b1e' }}>Oops! Hubo un problema</h2>
          <p style={{ color: '#6b7280', marginTop: '10px' }}>{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <main className="wizard-card">
        <WizardHeader />

        {step === 0 && (
          <StepIdioma 
            pricingData={pricingData} 
            selectedIdioma={selections.idioma} 
            onSelectIdioma={handleSelectIdioma} 
          />
        )}

        {step === 1 && (
          <StepModalidad 
            dataIdioma={dataIdioma} 
            selectedModalidad={selections.modalidad} 
            onSelectModalidad={handleSelectModalidad} 
          />
        )}

        {step === 2 && (
          <StepPlan 
            dataModalidad={dataModalidad} 
            selectedPlan={selections.plan} 
            onSelectPlan={handleSelectPlan} 
          />
        )}

        {step === 3 && (
          <StepResumen 
            dataIdioma={dataIdioma}
            dataModalidad={dataModalidad}
            selections={selections}
            isWhatsAppReady={isWhatsAppReady}
            onSelectFormato={handleSelectFormato}
            onSelectHorario={handleSelectHorario}
            onEnviarWhatsApp={enviarWhatsApp}
          />
        )}

        <WizardFooter 
          step={step} 
          onPrev={handlePrev} 
          onNext={handleNext} 
          isNextDisabled={isNextDisabled()} 
        />
      </main>
    </div>
  );
}

export default App;