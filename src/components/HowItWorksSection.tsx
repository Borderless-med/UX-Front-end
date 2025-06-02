
import { Card, CardContent } from '@/components/ui/card';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: 'AI Verification',
      description: 'Our system verifies clinic credentials through MDA license verification and credential analysis with 98.7% match accuracy',
      color: 'bg-teal-accent'
    },
    {
      number: 2,
      title: 'Smart Matching',
      description: 'Priority clinic matching based on your treatment needs, location preferences, and quality requirements',
      color: 'bg-blue-500'
    },
    {
      number: 3,
      title: 'Traffic-Aware Scheduling',
      description: 'Integrated scheduling using real-time traffic data with automatic rescheduling for causeway delays',
      color: 'bg-teal-accent'
    },
    {
      number: 4,
      title: '24/7 Support',
      description: 'Continuous support throughout your treatment journey with emergency hotline and follow-up coordination',
      color: 'bg-blue-500'
    }
  ];

  const verificationFeatures = [
    {
      title: 'MDA License Verification',
      description: 'Cross-check with Malaysian dental board registrations'
    },
    {
      title: 'Credential Analysis',
      description: 'Continuing education records and specialization verification'
    },
    {
      title: 'Facility Inspection',
      description: 'Hygiene scoring and certification protocol compliance'
    },
    {
      title: 'Patient Safety',
      description: 'Emergency procedures and medical evacuation protocols'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Step-by-step process for safe, affordable dental care
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step) => (
            <Card key={step.number} className="bg-dark-bg border-gray-600 hover:border-teal-accent transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}>
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Verification System */}
        <Card className="bg-dark-bg border-gray-600">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">AI Verification System</h3>
              <p className="text-gray-300">Our advanced verification process ensures every partner clinic meets the highest standards</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {verificationFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-teal-accent/20 p-4 rounded-lg mb-4">
                    <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HowItWorksSection;
