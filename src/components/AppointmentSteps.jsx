export default function AppointmentSteps({ currentStep }) {
    const steps = [
      { id: 'select-service', name: 'Select Service' },
      { id: 'date-time', name: 'Date & Time' },
      { id: 'personal-details', name: 'Personal Details' },
      { id: 'summary', name: 'Summary' },
    ];
  
    return (
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
              ${currentStep === step.id ? 'bg-blue-600 text-white' : 
                steps.findIndex(s => s.id === currentStep) > index ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
              {index + 1}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium 
                ${currentStep === step.id ? 'text-blue-600' : 
                  steps.findIndex(s => s.id === currentStep) > index ? 'text-green-500' : 'text-gray-500'}`}>
                {step.name}
              </p>
              <p className="text-xs text-gray-500">
                {currentStep === step.id ? 'In Progress' : 
                  steps.findIndex(s => s.id === currentStep) > index ? 'Completed' : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }