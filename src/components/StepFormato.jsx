// src/components/StepFormato.jsx
export default function StepFormato({dataIdioma, dataModalidad, selectedFormato, onSelectFormato, onAutoNext }) {
  if (!dataModalidad) return null;

  const handleSelect = (formato) => {
    onSelectFormato(formato);
    setTimeout(() => {
      if (onAutoNext) onAutoNext();
    }, 300);
  };

  return (
    <section className="step-container fade-in">
      <div className="banner-orange"
        style={{ backgroundColor: dataIdioma.colorTema || '#e8702a' }}>
        <h2>FORMATO DE CLASES</h2>
        <span>¿Cómo prefieres asistir?</span>
      </div>

      <div className="grid-2-col">
        {dataModalidad.formatos.map((formato) => {
          const isSelected = selectedFormato === formato;

          return (
            <button
              key={formato}
              type="button"
              className={`option-btn ${isSelected ? 'is-selected' : ''}`}
              onClick={() => handleSelect(formato)}
            >
              <strong className="btn-title">{formato}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}