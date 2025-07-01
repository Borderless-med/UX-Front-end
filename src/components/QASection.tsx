
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
      answer: 'Many Malaysian dental clinics maintain professional standards. Our directory includes general information about clinic facilities and available services to help you make informed decisions.'
    },
    {
      question: 'What if I need follow-up care?',
      answer: 'Our platform includes follow-up scheduling coordination and provides convenient access to traffic monitoring tools for better appointment planning, plus 24/7 support for seamless management.'
    },
    {
      question: 'How are payments handled?',
      answer: 'We provide information about secure payment processing options with transparent pricing details and available payment methods for various treatments.'
    },
    {
      question: 'Are there communication barriers?',
      answer: 'Our directory includes information about language capabilities at listed clinics, with many offering English and Mandarin speaking staff.'
    },
    {
      question: 'What about emergency situations?',
      answer: 'We provide 24/7 emergency hotline support and general information about emergency protocols available at partner clinics.'
    },
    {
      question: 'How can I verify clinic standards?',
      answer: 'Our directory includes available information about clinic facilities and general hygiene practices. We recommend verifying all details directly with clinics.'
    },
    {
      question: 'Are the dentists properly qualified?',
      answer: 'Our directory includes available information about dentist qualifications, education background, and specializations based on publicly available information.'
    },
    {
      question: 'What about travel complications and traffic delays?',
      answer: 'We provide direct links to traffic monitoring tools (Waze, Google Maps, OneMotoring.com) and general travel tips to help you plan your causeway crossings effectively.'
    },
    {
      question: 'Are there hidden costs I should know about?',
      answer: 'Our platform provides available pricing information to help with cost transparency. We recommend confirming all costs directly with clinics before treatment.'
    },
    {
      question: 'Will my insurance cover treatments in Malaysia?',
      answer: 'Coverage varies by insurance provider. We can provide general guidance on documentation needed for insurance claims and help you understand available options.'
    }
  ];

  return (
    <section id="qa" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-dark mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-neutral-gray">
            Addressing the top concerns of Singapore residents
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((item, index) => (
            <Card key={index} className="bg-light-card border-blue-light hover:border-blue-primary transition-all duration-300">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full p-6 text-left justify-between hover:bg-transparent"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="text-blue-dark font-medium">{item.question}</span>
                  <span className="text-blue-primary text-xl">
                    {openQuestions.has(index) ? '−' : '+'}
                  </span>
                </Button>
                {openQuestions.has(index) && (
                  <div className="px-6 pb-6">
                    <p className="text-neutral-gray leading-relaxed">{item.answer}</p>
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
