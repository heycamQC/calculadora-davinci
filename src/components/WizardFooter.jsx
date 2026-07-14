export default function WizardFooter({ step, onPrev, onNext, isNextDisabled }) {
  return (
    <footer className="wizard-footer">
      <button
        type="button"
        className="nav-arrow"
        onClick={onPrev}
        disabled={step === 0}
      >
        &#60;
      </button>
      <button
        type="button"
        className="nav-arrow"
        onClick={onNext}
        disabled={isNextDisabled}
      >
        &#62;
      </button>
    </footer>
  );
}