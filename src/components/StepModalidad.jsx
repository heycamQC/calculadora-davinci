export default function StepModalidad({ dataIdioma, selectedModalidad, onSelectModalidad }) {
  if (!dataIdioma) return null;

  return (
    <section className="step-container fade-in">
      <div className="banner-orange">
        <h2>MODALIDAD</h2>
        <span>Selecciona tu ritmo de estudio</span>
      </div>
      <div className="grid-1-col">
        {Object.keys(dataIdioma.modalidades).map((key) => {
          const mod = dataIdioma.modalidades[key];
          return (
            <button
              key={key}
              type="button"
              className={`option-btn btn-large ${selectedModalidad === key ? 'is-selected' : ''}`}
              onClick={() => onSelectModalidad(key)}
            >
              <strong className="btn-title">{mod.nombre}</strong>
              <span className="btn-subtitle">{mod.duracion}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}