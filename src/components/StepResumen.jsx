// src/components/StepResumen.jsx
import { useState } from 'react';
import { useHorarios } from '../hooks/useHorarios'; 
export default function StepResumen({
  dataIdioma,
  dataModalidad,
  selections,
  isWhatsAppReady,
  onSelectHorario,
  onEnviarWhatsApp,
}) {
  const [showCupos, setShowCupos] = useState(false);

  const { horarios } = useHorarios();

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

  const idiomaKey = dataIdioma?.id || selections.idioma?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || '';
  const modalidadNombre = dataModalidad?.nombre || '';
  const planKey = modalidadNombre.toLowerCase().includes('intensivo') ? 'intensivo' : 'estandar';
  const cuposUrl = `https://disponibilidad-cupos.vercel.app/?idioma=${idiomaKey}&plan=${planKey}`;

  const normalizar = (txt) => String(txt || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  const horariosDelIdioma = horarios.filter(h => 
    h.Idioma && normalizar(h.Idioma) === normalizar(dataIdioma.nombre) && h.Estado !== 'Inactivo'
  );

  const horariosFiltradosPorModalidad = horariosDelIdioma.filter(h => {
    if (!h.Modalidad) return false;
    const modH = normalizar(h.Modalidad);
    if (planKey === 'intensivo') {
      return modH.includes('intensivo');
    } else {
      return modH.includes('estandar');
    }
  });

  const listaHorariosDisponibles = horariosFiltradosPorModalidad.map(h => h.Horario || h.horario || h.Texto || Object.values(h)[3]);
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
                {listaHorariosDisponibles.length > 0 ? (
                  listaHorariosDisponibles.map(horario => (
                    <button 
                      key={horario} 
                      type="button"
                      className={`chip-btn ${selections.horario === horario ? 'is-selected' : ''}`}
                      onClick={() => onSelectHorario(horario)}
                    >
                      {horario}
                    </button>
                  ))
                ) : (
                  <p style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', width: '100%' }}>
                    Cargando horarios disponibles...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
            SECCIÓN: INTEGRACIÓN DE CUPOS EN VIVO
            ========================================== */}
        {!esPorHora && selections.modalidad !== 'onetoone' && (
          <div style={{ marginTop: '8px', marginBottom: '8px', borderTop: '2px solid #e5e7eb', paddingTop: '16px' }}>
            <button 
              type="button"
              onClick={() => setShowCupos(!showCupos)}
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: showCupos ? 'var(--color-blue-bg)' : '#f8fafc',
                border: `2px solid ${showCupos ? 'var(--color-blue-active)' : '#cbd5e1'}`,
                borderRadius: '14px',
                color: showCupos ? 'var(--color-blue-active)' : 'var(--color-text-dark)',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease-in-out',
                fontSize: '0.95rem'
              }}
            >
              <span>📅 Ver cupos: {dataIdioma.nombre} ({planKey === 'intensivo' ? 'Intensivo' : 'Estándar'})</span>
              <span>{showCupos ? '▲ Ocultar' : '▼ Consultar'}</span>
            </button>

            {showCupos && (
              <div className="fade-in cupos-iframe-container">
                <iframe 
                  src={cuposUrl} 
                  title="Disponibilidad de Cupos"
                  className="cupos-iframe"
                />
              </div>
            )}
          </div>
        )}
        {/* ========================================== */}

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