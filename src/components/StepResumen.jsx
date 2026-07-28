// src/components/StepResumen.jsx
export default function StepResumen({
  dataIdioma,
  dataModalidad,
  selections,
  isWhatsAppReady,
  onSelectHorario,
  onEnviarWhatsApp,
}) {
  if (!dataIdioma || !selections.plan) return null;

  const plan = selections.plan;
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

  return (
    <section className="step-container fade-in">
      <div 
        className="banner-orange" 
        style={{ backgroundColor: dataIdioma.colorTema || '#e8702a' }}
      >
        <h2>TU COTIZACIÓN</h2>
        <span>{dataIdioma.nombre} - {dataModalidad?.nombre} ({selections.formato})</span>
      </div>
      
      <div className="summary-box">
        {esPromo && plan.etiquetaPromo && (
          <div className="promo-badge" style={{ marginBottom: '12px', textAlign: 'center' }}>
            <span style={{ 
              backgroundColor: '#d52b1e', 
              color: '#fff', 
              padding: '4px 12px', 
              borderRadius: '12px', 
              fontWeight: 'bold',
              fontSize: '0.85rem'
            }}>
              🔥 Promoción Activa: {plan.etiquetaPromo}
            </span>
          </div>
        )}

        <div className="summary-breakdown">
          {esPorHora ? (
             <>
               <div className="breakdown-row">
                 <span>1ª Cuota (Matrícula + 1 Hora base):</span>
                 <strong>Bs. {primeraCuota}</strong>
               </div>
               
               <div className="breakdown-total" style={{ borderTop: '2px dashed #e5e7eb', paddingTop: '10px', marginTop: '10px' }}>
                 <span>Total para empezar hoy:</span>
                 <strong className="total-number" style={{ color: '#0e0ead' }}>Bs. {primeraCuota}</strong>
               </div>
             </>
          ) : (
             <>
               <div className="breakdown-row">
                 <span>1ª Cuota (Inscripción + 1er Mes):</span>
                 <strong>Bs. {primeraCuota}</strong>
               </div>
               
               {cuotasRestantes > 0 && (
                 <div className="breakdown-row">
                   <span>Siguientes {cuotasRestantes} cuotas:</span>
                   <strong>Bs. {cuotaMensual} / mes</strong>
                 </div>
               )}

               <div className="breakdown-total" style={{ borderTop: '2px dashed #e5e7eb', paddingTop: '10px', marginTop: '10px' }}>
                 <span>Total para empezar hoy:</span>
                 <strong className="total-number" style={{ color: '#0e0ead' }}>Bs. {primeraCuota}</strong>
               </div>
             </>
          )}

          {esPorHora && (
            <small className="hourly-note">* El total referencial incluye matrícula más 1 hora base de clases.</small>
          )}
        </div>

        <div className="summary-options">
          <h3 className="options-title">Selecciona tu horario:</h3>
          
          <div className="option-group">
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
          {isWhatsAppReady ? 'Enviar cotización' : 'Selecciona tu horario'}
        </button>
      </div>
    </section>
  );
}