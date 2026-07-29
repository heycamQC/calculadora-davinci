// src/components/StepPlan.jsx
export default function StepPlan({ dataIdioma ,dataModalidad, selectedFormato, selectedPlan, onSelectPlan }) {
  if (!dataModalidad) return null;

  const planesFiltrados = dataModalidad.planes.filter(plan => {
    if (!plan.formatosAplica) return true;
    const formatoUser = selectedFormato.toLowerCase().trim();
    const formatosRow = plan.formatosAplica.toLowerCase();
    
    if (formatoUser.includes('presencial') && formatosRow.includes('presencial')) return true;
    if (formatoUser.includes('virtual') && formatosRow.includes('virtual')) return true;
    if (formatoUser.includes('híbrido') && formatosRow.includes('hibrido')) return true;

    return formatosRow.includes(formatoUser);
  });

  return (
    <section className="step-container fade-in">
      <div 
        className="banner-orange"
        style={{ backgroundColor: dataIdioma.colorTema || '#e8702a' }}
      >
        <h2>PLAN DE PAGO</h2>
        <span>Elige tu plan ({selectedFormato})</span>
      </div>
      <div className="grid-1-col">
        {planesFiltrados.map((plan) => {
          const estaEnPromo = plan.enPromocion === true || plan.enPromocion === 'TRUE' || plan.enPromocion === 'true';

          return (
            <button
              key={plan.id + plan.nombre}
              type="button"
              className={`option-btn btn-large ${selectedPlan?.id === plan.id && selectedPlan?.nombre === plan.nombre ? 'is-selected' : ''}`}
              onClick={() => onSelectPlan(plan)}
            >
              <strong className="btn-title">{plan.nombre}</strong>
              

              {estaEnPromo && plan.etiquetaPromo && (
                <span className="btn-desc" style={{ color: '#d52b1e', fontWeight: 'bold', marginTop: '4px' }}>
                  🔥 {plan.etiquetaPromo}
                </span>
              )}
              
              {plan.descripcion && <span className="btn-desc" style={{ marginTop: '4px' }}>{plan.descripcion}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}