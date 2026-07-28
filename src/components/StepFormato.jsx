// src/components/StepFormato.jsx
export default function StepFormato({ dataModalidad, selectedFormato, onSelectFormato }) {
  if (!dataModalidad) return null;

  return (
    <section className="step-container fade-in">
      <div className="banner-orange">
        <h2>FORMATO DE ESTUDIO</h2>
        <span>¿Cómo prefieres pasar tus clases?</span>
      </div>
      
      <div className="grid-1-col" style={{ padding: '24px 20px' }}>
        {dataModalidad.formatos.map(fmt => (
          <button 
            key={fmt} 
            type="button"
            className={`option-btn btn-large ${selectedFormato === fmt ? 'is-selected' : ''}`}
            onClick={() => onSelectFormato(fmt)}
          >
            <strong className="btn-title">{fmt}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}