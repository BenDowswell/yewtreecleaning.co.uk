interface StepperProps {
  steps: string[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      {/* Mobile: compact step indicator */}
      <div className="flex items-center justify-center gap-2 sm:hidden">
        <span className="text-sm font-medium text-brand-green-700">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="text-sm text-gray-500">&mdash;</span>
        <span className="text-sm font-medium text-gray-900">
          {steps[currentStep]}
        </span>
      </div>

      {/* Desktop: full stepper */}
      <ol className="hidden items-center sm:flex">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step}
              className={`flex items-center ${isLast ? '' : 'flex-1'}`}
            >
              <div className="flex flex-col items-center gap-1.5">
                {/* Circle */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    isCompleted
                      ? 'bg-brand-green-400 text-white'
                      : isCurrent
                        ? 'border-2 border-brand-green-400 bg-brand-green-50 text-brand-green-700'
                        : 'border-2 border-gray-200 bg-white text-gray-400'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs text-center whitespace-nowrap ${
                    isCompleted || isCurrent
                      ? 'font-medium text-brand-green-700'
                      : 'text-gray-400'
                  }`}
                >
                  {step}
                </span>
              </div>

              {/* Connector */}
              {!isLast && (
                <div
                  className={`mx-2 mb-5 h-0.5 flex-1 transition-colors ${
                    isCompleted ? 'bg-brand-green-400' : 'bg-gray-200'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
