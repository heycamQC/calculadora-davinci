// src/components/StepIdioma.jsx
export default function StepIdioma({ data, selectedIdioma, onSelectIdioma, onAutoNext }) {
  if (!data) return null;

  const handleSelect = (idioma) => {
    onSelectIdioma(idioma);
    // 🚀 RETRASO PRO: Espera 300ms para mostrar la animación de clic y avanza
    setTimeout(() => {
      if (onAutoNext) onAutoNext();
    }, 300);
  };

  return (
    <section className="step-container fade-in">
      <div className="banner-orange">
        <h2>IDIOMA</h2>
        <span>Selecciona un idioma para comenzar</span>
      </div>
      
      
      <div className="grid-2-col">
        {Object.values(data).map((idioma) => {
          const isSelected = selectedIdioma?.nombre === idioma.nombre;
          
          return (
            <button
              key={idioma.nombre}
              type="button"
              /* Añadimos una clase de estilo y pasamos el color del Excel como variable CSS */
              className={`option-btn btn-idioma ${isSelected ? 'is-selected' : ''}`}
              style={{ '--idioma-color': idioma.colorTema || '#e8702a' }}
              onClick={() => handleSelect(idioma)}
            >
              <strong className="btn-title">{idioma.nombre}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}