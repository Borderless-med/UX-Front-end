
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Directory Search',
      description: 'Our system searches directory listings through information collection and data analysis for comprehensive clinic information',
      color: 'bg-blue-600'
    },
    {
      number: 2,
      title: 'Smart Matching',
      description: 'Priority clinic matching based on your treatment needs, location preferences, and available information',
      color: 'bg-blue-600'
    },
    {
      number: 3,
      title: 'Traffic-Aware Scheduling',
      description: 'Integrated scheduling using real-time traffic data with automatic rescheduling for causeway delays',
      color: 'bg-blue-600'
    },
    {
      number: 4,
      title: '24/7 Support',
      description: 'Continuous support throughout your treatment journey with emergency hotline and follow-up coordination',
      color: 'bg-blue-600'
    }
  ];

  const informationFeatures = [
    {
      title: 'Directory Information Collection',
      description: 'Cross-reference with available dental board listings'
    },
    {
      title: 'Credential Information',
      description: 'Education records and specialization information gathering'
    },
    {
      title: 'Facility Information',
      description: 'General information collection and available facility details'
    },
    {
      title: 'Patient Safety Information',
      description: 'General safety procedures and available emergency information'
    }
  ];

  const sentimentFeatures = [
    {
      title: 'Review Pattern Analysis',
      description: 'Advanced algorithms identify potential inauthentic reviews with 94.2% accuracy'
    },
    {
      title: 'Linguistic Analysis',
      description: 'Natural language processing detects authentic patient experiences vs promotional content'
    },
    {
      title: 'Pattern Recognition',
      description: 'Identifies suspicious review patterns, timing clusters, and coordinated posting activities'
    },
    {
      title: 'Confidence Scoring',
      description: 'Each review gets a confidence score based on authenticity, detail level, and available information'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Step-by-step process for safe, affordable dental care
          </p>
        </div>

        {/* Standardized Important Disclaimer */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-blue-100 via-blue-150 to-blue-200/90 border-l-4 border-blue-500 rounded-r-lg px-6 py-5 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-300/70 backdrop-blur-sm relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none after:absolute after:top-0 after:left-0 after:right-0 after:h-px after:bg-white/40">
            <div className="flex items-start gap-4 relative z-10">
              <div className="flex-shrink-0 mt-0.5">
                <Info className="h-5 w-5 text-blue-700 drop-shadow-lg filter" style={{ filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }} />
              </div>
              <div className="text-sm text-blue-900 leading-relaxed font-medium" style={{ textShadow: '0 1px 2px rgba(59, 130, 246, 0.1)' }}>
                <strong className="text-blue-800 font-bold">Important Disclaimer:</strong> This platform provides general information only and does not constitute dental advice. 
                No professional relationship is created with listed practitioners. Always consult qualified dental professionals.
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step) => (
            <Card key={step.number} className="bg-light-card border-gray-200 hover:border-teal-accent transition-all duration-300 shadow-sm hover:shadow-md">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}>
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Features with Tabs */}
        <Card className="bg-light-card border-gray-200 shadow-sm">
          <CardContent className="p-8">
            <Tabs defaultValue="information" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 border-gray-200">
                <TabsTrigger value="information" className="text-gray-700 data-[state=active]:bg-teal-accent data-[state=active]:text-white">
                  Directory Information System
                </TabsTrigger>
                <TabsTrigger value="sentiment" className="text-gray-700 data-[state=active]:bg-teal-accent data-[state=active]:text-white">
                  Review Analysis
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="information" className="mt-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Directory Information System</h3>
                  <p className="text-gray-600">Our information collection process gathers comprehensive clinic details from available sources</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {informationFeatures.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-teal-accent/10 p-4 rounded-lg mb-4 border border-teal-accent/20">
                        <h4 className="text-gray-900 font-semibold mb-2">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sentiment" className="mt-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Review Analysis</h3>
                  <p className="text-gray-600 mb-6">
                    Beyond simple ratings - our proprietary system provides authentic patient feedback analysis
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sentimentFeatures.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-blue-500/10 p-4 rounded-lg mb-4 border border-blue-500/20">
                        <h4 className="text-gray-900 font-semibold mb-2">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="text-gray-900 font-semibold mb-3">Why This Matters for International Patients</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      When seeking dental care across borders, authentic patient feedback is crucial for safety and quality assessment. 
                      Our review analysis helps you make decisions based on genuine patient experiences rather than manipulated ratings.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HowItWorksSection;
