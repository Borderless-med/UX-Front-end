
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QASection = () => {
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set());

  const toggleQuestion = (index: number) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(index)) {
      newOpenQuestions.delete(index);
    } else {
      newOpenQuestions.add(index);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const questions = [
    {
      question: 'Is Malaysian dental quality comparable to Singapore?',
      answer: 'Yes, many Malaysian dental clinics maintain international standards. Our verification system ensures all partner clinics meet MDA-SOC cross certification standards with verified credentials.'
    },
    {
      question: 'What if I need follow-up care?',
      answer: 'Our platform includes guaranteed revisit scheduling with traffic-aware timing and 24/7 support coordination for seamless follow-up appointments.'
    },
    {
      question: 'How are payments handled?',
      answer: 'We offer secure payment processing with transparent pricing, no hidden fees, and flexible payment options including installment plans for major treatments.'
    },
    {
      question: 'Are there communication barriers?',
      answer: 'All verified clinics have English and Mandarin speaking staff certified through our verification process to ensure clear communication throughout your treatment.'
    },
    {
      question: 'What about emergency situations?',
      answer: 'We provide 24/7 emergency hotline support and have established protocols with partner clinics for urgent dental situations and medical evacuations if needed.'
    },
    {
      question: 'How can I verify clinic hygiene standards?',
      answer: 'Our verification process includes on-site hygiene scoring and certification protocol compliance checks. All partner clinics maintain detailed hygiene records available for review.'
    },
    {
      question: 'Are the dentists properly qualified?',
      answer: 'All dentists in our network undergo credential verification including education background, continuing education records, and specialization certifications through our AI verification system.'
    },
    {
      question: 'What about travel complications and traffic delays?',
      answer: 'Our smart scheduling system uses real-time traffic data and automatically adjusts appointment times for causeway delays. We also provide travel tips and alternative route suggestions.'
    },
    {
      question: 'Are there hidden costs I should know about?',
      answer: 'Our transparent pricing guarantee ensures all costs are disclosed upfront. We provide detailed breakdowns of all fees including consultation, treatment, and any additional services.'
    },
    {
      question: 'Will my insurance cover treatments in Malaysia?',
      answer: 'Coverage varies by insurance provider. We can provide detailed receipts and documentation needed for insurance claims, and help you understand your coverage options.'
    }
  ];

  return (
    <section id="qa" className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-bg">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-300">
            Addressing the top concerns of Singapore residents
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((item, index) => (
            <Card key={index} className="bg-dark-card border-gray-600 hover:border-teal-accent transition-all duration-300">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full p-6 text-left justify-between hover:bg-transparent"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="text-white font-medium">{item.question}</span>
                  <span className="text-teal-accent text-xl">
                    {openQuestions.has(index) ? '−' : '+'}
                  </span>
                </Button>
                {openQuestions.has(index) && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QASection;
