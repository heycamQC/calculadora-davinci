// src/components/StepIdioma.jsx
export default function StepIdioma({ data, selectedIdioma, onSelectIdioma }) {
  if (!data) return null;

  return (
    <section className="step-container fade-in">
      <h2>IDIOMA</h2>
      <p className="step-subtitle">Selecciona un idioma para comenzar:</p>
      
      <div className="grid-idiomas">
        {Object.entries(data).map(([keyId, idioma]) => {
          const isSelected = selectedIdioma === idioma.nombre;
          const cleanName = (idioma.id || keyId)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""); // Borra tildes (ej: "inglés" -> "ingles")

          return (
            <button
              key={keyId}
              type="button"
              className={`option-btn btn-idioma-img ${isSelected ? 'is-selected' : ''}`}
              /* Probamos primero con .jpeg y si tienes alguna .jpg funcionará igual o estandarizamos */
              style={{ backgroundImage: `url('/images/${cleanName}.jpeg')` }}
              onClick={() => onSelectIdioma(idioma.nombre)}
            >
            </button>
          );
        })}
      </div>
    </section>
  );
}