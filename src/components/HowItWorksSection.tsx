
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Directory Search',
      description: 'Our system searches directory listings through information collection and data analysis for comprehensive clinic information',
      color: 'bg-blue-600',
      hasBadge: false
    },
    {
      number: 2,
      title: 'Smart Matching + AI Recommendations',
      description: 'Priority clinic matching based on your treatment needs, location preferences, and AI-powered personalized recommendations',
      color: 'bg-blue-600',
      hasBadge: true,
      badgeText: 'AI Enhanced'
    },
    {
      number: 3,
      title: 'Travel Planning Support',
      description: 'Convenient access to traffic monitoring tools like Waze, Google Maps, and OneMotoring.com to help you plan your journey and appointments effectively',
      color: 'bg-blue-600',
      hasBadge: false
    },
    {
      number: 4,
      title: '24/7 Support + Intelligent Assistant',
      description: 'Continuous support throughout your treatment journey with emergency hotline, follow-up coordination, and intelligent AI assistant for instant answers',
      color: 'bg-blue-600',
      hasBadge: true,
      badgeText: 'AI Chatbot'
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

  const aiFeatures = [
    {
      icon: '🤖',
      title: 'Intelligent Chatbot Assistant',
      description: 'Get instant answers about treatments, booking, clinic recommendations, and access to helpful travel planning resources - available 24/7',
      badge: 'Launching Q3 2025'
    },
    {
      icon: '📊',
      title: 'Real-Time Analytics Dashboard',
      description: 'Clinic partners receive advanced sentiment analysis and patient feedback insights to optimize their practice',
      badge: 'Launching Q3 2025'
    }
  ];

  return (
    <section id="how-it-works" className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Step-by-step process for safe, affordable dental care
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step) => (
            <Card key={step.number} className="bg-light-card border-gray-200 hover:border-teal-accent transition-all duration-300 shadow-sm hover:shadow-md relative">
              <CardContent className="p-6 text-center">
                {step.hasBadge && (
                  <Badge className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 z-10 hover:bg-blue-600 shadow-sm">
                    {step.badgeText}
                  </Badge>
                )}
                <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}>
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Technology Section */}
        <div className="mt-16 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Powered by Advanced AI Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of dental care with our cutting-edge AI innovations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {aiFeatures.map((feature, index) => (
              <Card key={index} className="bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 shadow-sm hover:shadow-md relative">
                <CardContent className="p-6 text-center">
                  <Badge className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-sm">
                    {feature.badge}
                  </Badge>
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
