export default function StepIdioma({ pricingData, selectedIdioma, onSelectIdioma }) {
  return (
    <section className="step-container fade-in">
      <div className="banner-orange">
        <h2>IDIOMA</h2>
        <span>Selecciona un idioma</span>
      </div>
      <div className="grid-3-cols">
        {Object.keys(pricingData).map((key) => (
          <button
            key={key}
            type="button"
            className={`option-btn ${selectedIdioma === key ? 'is-selected' : ''}`}
            onClick={() => onSelectIdioma(key)}
          >
            {pricingData[key].nombre}
          </button>
        ))}
      </div>
    </section>
  );
}