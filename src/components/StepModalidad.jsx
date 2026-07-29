// src/components/StepModalidad.jsx
export default function StepModalidad({ dataIdioma, selectedModalidad, onSelectModalidad, onAutoNext }) {
  if (!dataIdioma) return null;

  const handleSelect = (modKey, modValue) => {
    onSelectModalidad(modKey, modValue);
    setTimeout(() => {
      if (onAutoNext) onAutoNext();
    }, 300);
  };

  return (
    <section className="step-container fade-in">
      <div 
        className="banner-orange"
        style={{ backgroundColor: dataIdioma.colorTema || '#e8702a' }}
      >
        <h2>MODALIDAD</h2>
        <span>Elige el ritmo de estudio ({dataIdioma.nombre})</span>
      </div>

      <div className="grid-1-col">
        {Object.entries(dataIdioma.modalidades).map(([modKey, modValue]) => {
          const isSelected = selectedModalidad?.key === modKey;

          return (
            <button
              key={modKey}
              type="button"
              className={`option-btn btn-large ${isSelected ? 'is-selected' : ''}`}
              onClick={() => handleSelect(modKey, modValue)}
            >
              <strong className="btn-title">{modValue.nombre}</strong>
              {modValue.duracion && <span className="btn-desc">{modValue.duracion}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}