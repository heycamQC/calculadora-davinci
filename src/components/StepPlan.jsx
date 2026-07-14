export default function StepPlan({ dataModalidad, selectedPlan, onSelectPlan }) {
  if (!dataModalidad) return null;

  return (
    <section className="step-container fade-in">
      <div className="banner-orange">
        <h2>PLAN DE PAGO</h2>
        <span>Elige tu modalildad de inversión</span>
      </div>
      <div className="grid-1-col">
        {dataModalidad.planes.map((plan) => (
          <button
            key={plan.id}
            type="button"
            className={`option-btn btn-large ${selectedPlan?.id === plan.id ? 'is-selected' : ''}`}
            onClick={() => onSelectPlan(plan)}
          >
            <strong className="btn-title">{plan.nombre}</strong>
            <span className="btn-price">Bs. {plan.precio} {plan.esPorHora ? '/ hora' : ''}</span>
            {plan.descripcion && <span className="btn-desc">{plan.descripcion}</span>}
          </button>
        ))}
      </div>
    </section>
  );
}