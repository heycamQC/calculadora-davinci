export default function StepResumen({
  dataIdioma,
  dataModalidad,
  selections,
  isWhatsAppReady,
  onSelectFormato,
  onSelectHorario,
  onEnviarWhatsApp,
}) {
  if (!dataIdioma || !selections.plan) return null;

  return (
    <section className="step-container fade-in">
      <div 
        className="banner-orange" 
        style={{ backgroundColor: dataIdioma.colorTema || '#e8702a' }}
      >
        <h2>TU COTIZACIÓN</h2>
        <span>{dataIdioma.nombre} - {dataModalidad?.nombre}</span>
      </div>
      
      <div className="summary-box">
        <div className="summary-breakdown">
          <div className="breakdown-row">
            <span>Matrícula Única:</span>
            <strong>Bs. {dataIdioma.matricula}</strong>
          </div>
          <div className="breakdown-row">
            <span>{selections.plan.nombre}:</span>
            <strong>Bs. {selections.plan.precio} {selections.plan.esPorHora ? '/ hora' : ''}</strong>
          </div>
          <div className="breakdown-total">
            <span>Total a Invertir:</span>
            <strong className="total-number">Bs. {dataIdioma.matricula + selections.plan.precio}</strong>
          </div>
          {selections.plan.esPorHora && (
            <small className="hourly-note">* El total referencial incluye matrícula más 1 hora base.</small>
          )}
        </div>

        <div className="summary-options">
          <h3 className="options-title">Detalles finales para tu inscripción:</h3>
          
          <div className="option-group">
            <label>1. Elige tu formato:</label>
            <div className="chips-container">
              {dataModalidad?.formatos.map(fmt => (
                <button 
                  key={fmt} 
                  type="button"
                  className={`chip-btn ${selections.formato === fmt ? 'is-selected' : ''}`}
                  onClick={() => onSelectFormato(fmt)}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <label>2. Horario:</label>
            {selections.modalidad === 'onetoone' ? (
              <div className="range-info-box">
                <strong>Rangos disponibles:</strong>
                <p>{dataModalidad?.horarios.join(" | ")}</p>
                <small><em>Tu horario se coordinará en base a estos rangos.</em></small>
              </div>
            ) : (
              <div className="chips-container">
                {dataModalidad?.horarios.map(horario => (
                  <button 
                    key={horario} 
                    type="button"
                    className={`chip-btn ${selections.horario === horario ? 'is-selected' : ''}`}
                    onClick={() => onSelectHorario(horario)}
                  >
                    {horario}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button 
          type="button" 
          className={`btn-whatsapp ${isWhatsAppReady ? 'ready' : ''}`} 
          onClick={onEnviarWhatsApp}
          disabled={!isWhatsAppReady}
        >
          {isWhatsAppReady ? 'Enviar cotización' : 'Selecciona formato y horario'}
        </button>
      </div>
    </section>
  );
}