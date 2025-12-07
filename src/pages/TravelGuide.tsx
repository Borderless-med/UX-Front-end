import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, MapPin, Clock, DollarSign, FileText, AlertCircle, Car } from 'lucide-react';
import MasterTemplate from '@/components/layout/MasterTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import ChatHelperTextbox from '@/components/chat/ChatHelperTextbox';

interface TravelFAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  tags?: string[];
  last_updated: string;
}

// Category metadata for icons and display - Professional 5-color palette
const categoryConfig: Record<string, { icon: any; label: string; color: string; order: number }> = {
  // BLUE: Planning & Preparation (4 categories)
  preparation: { icon: FileText, label: 'Preparation & Documents', color: 'bg-blue-100 text-blue-700', order: 1 },
  timing: { icon: Clock, label: 'Best Times to Cross', color: 'bg-blue-100 text-blue-700', order: 2 },
  costs: { icon: DollarSign, label: 'Costs & Payments', color: 'bg-blue-100 text-blue-700', order: 6 },
  insurance_records: { icon: FileText, label: 'Insurance & Records', color: 'bg-blue-100 text-blue-700', order: 20 },
  
  // TEAL: Transit & Navigation (7 categories)
  transport: { icon: Car, label: 'Transport Options', color: 'bg-teal-100 text-teal-700', order: 3 },
  driving: { icon: Car, label: 'Driving Your Car', color: 'bg-teal-100 text-teal-700', order: 5 },
  clinic_travel: { icon: MapPin, label: 'Getting to Clinics', color: 'bg-teal-100 text-teal-700', order: 7 },
  crossing_process: { icon: FileText, label: 'Crossing Process', color: 'bg-teal-100 text-teal-700', order: 4 },
  immigration: { icon: FileText, label: 'Immigration & Customs', color: 'bg-teal-100 text-teal-700', order: 8 },
  tech_connectivity: { icon: AlertCircle, label: 'Mobile Data & Apps', color: 'bg-teal-100 text-teal-700', order: 9 },
  payments_currency: { icon: DollarSign, label: 'Currency & Cards', color: 'bg-teal-100 text-teal-700', order: 10 },
  
  // GRAY: Healthcare & Operations (6 categories)
  appointments: { icon: Clock, label: 'Appointments', color: 'bg-gray-100 text-gray-700', order: 12 },
  clinic_experience: { icon: FileText, label: 'Clinic Experience', color: 'bg-gray-100 text-gray-700', order: 17 },
  health_safety: { icon: AlertCircle, label: 'Health & Safety', color: 'bg-gray-100 text-gray-700', order: 11 },
  return_followup: { icon: MapPin, label: 'Returning & Follow-up', color: 'bg-gray-100 text-gray-700', order: 13 },
  post_treatment: { icon: AlertCircle, label: 'Post-Treatment Care', color: 'bg-gray-100 text-gray-700', order: 18 },
  meta: { icon: FileText, label: 'General Information', color: 'bg-gray-100 text-gray-700', order: 21 },
  
  // AMBER: Caution & Important Info (2 categories)
  pitfalls: { icon: AlertCircle, label: 'Common Mistakes', color: 'bg-amber-100 text-amber-700', order: 14 },
  safety: { icon: AlertCircle, label: 'Personal Safety', color: 'bg-amber-100 text-amber-700', order: 19 },
  
  // RED: Urgent & Emergency (2 categories)
  edge_emergency: { icon: AlertCircle, label: 'Emergency Situations', color: 'bg-red-100 text-red-700', order: 15 },
  afterhours: { icon: Clock, label: 'After Hours Care', color: 'bg-red-100 text-red-700', order: 16 },
};

// Top 10 must-know question IDs (based on most commonly asked)
const TOP_10_IDS = [1, 2, 9, 10, 11, 15, 20, 21, 22, 27];

const TravelGuide = () => {
  const [faqs, setFaqs] = useState<TravelFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('before-you-go');

  // Clean up text encoding issues - comprehensive Windows-1252 to UTF-8 fix
  const cleanText = (text: string): string => {
    return text
      // Em-dashes and dashes (0x80, 0x97)
      .replace(/\u0080/g, '—')
      .replace(/\u0097/g, '—')
      .replace(/��/g, '—')
      .replace(/\|\|/g, '—')
      .replace(/\|/g, ', ')
      .replace(/â/g, '–')  // Wrong dash to en-dash for ranges
      
      // Quotes and apostrophes (0x93, 0x94, 0x91, 0x92, 0x99)
      .replace(/\u0093/g, '"')
      .replace(/\u0094/g, '"')
      .replace(/\u0091/g, '\u2018')  // Left single quote
      .replace(/\u0092/g, '\u2019')  // Right single quote
      .replace(/\u0099/g, "'")
      .replace(/ân/g, "'n")  // Touch ân Go → Touch 'n Go
      
      // Arrows and symbols (0x86)
      .replace(/\u0086/g, '→')
      .replace(/Ã/g, '×')  // Multiplication symbol
      
      // Common contractions
      .replace(/\bIm\b/g, "I'm")
      .replace(/\bcant\b/g, "can't")
      .replace(/\bwhats\b/g, "what's")
      .replace(/\bdont\b/g, "don't")
      .replace(/\bisnt\b/g, "isn't")
      .replace(/\bwont\b/g, "won't")
      
      // Possessives (dentists → dentist's, clinics → clinic's)
      .replace(/\bdentists\s+([a-z])/gi, "dentist's $1")
      .replace(/\bclinics\s+([a-z])/gi, "clinic's $1")
      
      // Compound words with hyphens
      .replace(/\boffpeak\b/gi, 'off-peak')
      .replace(/\bwelllit\b/gi, 'well-lit')
      .replace(/\binperson\b/gi, 'in-person')
      .replace(/\bSGfocused\b/g, 'SG-focused')
      
      // Missing spaces after Yes/No
      .replace(/\bYes([a-z])/g, 'Yes; $1')
      .replace(/\byes([a-z])/g, 'yes; $1')
      .replace(/\bNo([a-z])/g, 'No; $1')
      
      // Fix common word concatenations
      .replace(/adjustconfirm/gi, 'adjust; confirm')
      .replace(/jamsalways/gi, 'jams; always')
      .replace(/surgecompare/gi, 'surge; compare')
      .replace(/updateverify/gi, 'update; verify')
      .replace(/parkingcheck/gi, 'parking; check')
      .replace(/hoursconfirm/gi, 'hours; confirm')
      .replace(/areaMount/g, 'area; Mount')
      .replace(/comfortnot/gi, 'comfort; not')
      .replace(/fineconfirm/gi, 'fine; confirm')
      .replace(/varycheck/gi, 'vary; check')
      .replace(/shiftcompare/gi, 'shift; compare')
      .replace(/lateclinic/gi, 'late; clinic')
      .replace(/patienceno/gi, 'patience; no')
      .replace(/guaranteedplan/gi, 'guaranteed; plan')
      .replace(/workfollow/gi, 'work; follow')
      .replace(/reintroductionconfirm/gi, 'reintroduction; confirm')
      .replace(/changeverify/gi, 'change; verify')
      .replace(/visitretain/gi, 'visit; retain')
      .replace(/TuesdayThursday/g, 'Tuesday–Thursday')
      
      // Clean up multiple spaces
      .replace(/  +/g, ' ')
      .trim();
  };

  // Fetch FAQs from Supabase on component mount
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('faqs_semantic')
          .select('id, category, question, answer, last_updated')
          .order('category', { ascending: true })
          .order('id', { ascending: true });

        if (fetchError) throw fetchError;
        
        // Clean text encoding issues
        const cleanedData = (data || []).map(faq => ({
          ...faq,
          question: cleanText(faq.question),
          answer: cleanText(faq.answer)
        }));
        
        setFaqs(cleanedData);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('Failed to load travel FAQs. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // Group FAQs by category and sort by logical order
  const groupedFAQs = useMemo(() => {
    const filtered = searchTerm
      ? faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : faqs;

    const grouped = filtered.reduce((acc, faq) => {
      if (!acc[faq.category]) acc[faq.category] = [];
      acc[faq.category].push(faq);
      return acc;
    }, {} as Record<string, TravelFAQ[]>);

    // Sort categories by logical order
    return Object.fromEntries(
      Object.entries(grouped).sort(([catA], [catB]) => {
        const orderA = categoryConfig[catA]?.order ?? 999;
        const orderB = categoryConfig[catB]?.order ?? 999;
        return orderA - orderB;
      })
    );
  }, [faqs, searchTerm]);

  // Top 10 FAQs (based on predefined IDs)
  const topFAQs = useMemo(() => {
    return faqs.filter((faq) => TOP_10_IDS.includes(faq.id)).slice(0, 10);
  }, [faqs]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleQuestion = (id: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <MasterTemplate 
      title="Travel Guide" 
      subtitle="Your comprehensive guide for crossing from Singapore to Johor Bahru"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <Card className="p-12 text-center">
            <div className="animate-pulse">
              <Clock className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading FAQs...</h3>
              <p className="text-gray-600">Fetching travel information from database</p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-12 text-center border-2 border-red-200 bg-red-50">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading FAQs</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
            >
              Reload Page
            </button>
          </Card>
        )}

        {/* Main Content - Only show when loaded and no error */}
        {!loading && !error && (
          <>
            {/* Header Card */}
            <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-full">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl md:text-5xl font-bold text-blue-900">
                  How to Get to JB Clinics
                </CardTitle>
                <p className="text-lg text-gray-600 mt-1">
                  Complete guide with transport options, timing tips, and border crossing essentials
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search FAQs... (e.g., 'passport', 'timing', 'cost')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-600 mt-2">
                Found {Object.values(groupedFAQs).flat().length} result(s) matching "{searchTerm}"
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top 10 Must-Know Section - Compact Grid */}
        {!searchTerm && topFAQs.length > 0 && (
          <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-blue-900">
                ⭐ Top 10 Must-Know Questions
              </CardTitle>
              <p className="text-xs text-gray-600">Most commonly asked - click to expand</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topFAQs.map((faq, index) => (
                  <button
                    key={faq.id}
                    onClick={() => toggleQuestion(faq.id)}
                    className="text-left p-3 rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-xs leading-tight">{faq.question}</p>
                        {expandedQuestions.has(faq.id) && (
                          <p className="text-gray-700 mt-1.5 text-xs leading-relaxed">{faq.answer}</p>
                        )}
                      </div>
                      <ChevronDown
                        className={`flex-shrink-0 w-3.5 h-3.5 text-gray-400 transition-transform ${
                          expandedQuestions.has(faq.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All FAQs by Journey Phase - Tabbed Interface */}
        <div className="mb-6">
          <div className="mb-6 pb-4 border-b-2 border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Journey Phase</h2>
            <p className="text-gray-600">Select a phase below to see relevant categories - organized by your travel timeline</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8 h-auto">
            <TabsTrigger value="before-you-go" className="text-xs md:text-sm py-2">🚀 Before You Go</TabsTrigger>
            <TabsTrigger value="transport-options" className="text-xs md:text-sm py-2">🚗 Transport Options</TabsTrigger>
            <TabsTrigger value="at-border" className="text-xs md:text-sm py-2">🛂 At the Border</TabsTrigger>
            <TabsTrigger value="at-clinic" className="text-xs md:text-sm py-2">🏥 At the Clinic</TabsTrigger>
            <TabsTrigger value="after-treatment" className="text-xs md:text-sm py-2">🔄 After Treatment</TabsTrigger>
            <TabsTrigger value="special-cases" className="text-xs md:text-sm py-2">⚠️ Special Cases</TabsTrigger>
          </TabsList>

          {/* Before You Go Tab */}
          <TabsContent value="before-you-go" className="space-y-4">
            {['preparation', 'timing', 'costs', 'insurance_records'].map(category => {
              const categoryFAQs = groupedFAQs[category];
              if (!categoryFAQs || categoryFAQs.length === 0) return null;
              
              const config = categoryConfig[category] || {
                icon: FileText,
                label: category,
                color: 'bg-gray-100 text-gray-700',
              };
              const Icon = config.icon;
              const isExpanded = expandedCategories.has(category);

              return (
                <Card key={category} className="border-2 hover:border-blue-300 transition-all">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-blue-50 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Badge className={`${config.color} text-sm px-3 py-1`}>
                        <Icon className="w-4 h-4 mr-2 inline" />
                        {config.label}
                      </Badge>
                      <span className="text-sm text-gray-600">{categoryFAQs.length} FAQs</span>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <CardContent className="pt-0 pb-6 px-6">
                      <div className="space-y-4">
                        {categoryFAQs.map((faq) => (
                          <div
                            key={faq.id}
                            className="border-l-4 border-blue-200 pl-4 py-2 hover:border-blue-400 transition-colors"
                          >
                            <h3 className="font-semibold text-gray-900 mb-2 text-base">
                              {highlightText(faq.question, searchTerm)}
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm">
                              {highlightText(faq.answer, searchTerm)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </TabsContent>

          {/* At the Border Tab */}
          <TabsContent value="at-border" className="space-y-4">
            {['crossing_process', 'immigration', 'payments_currency', 'tech_connectivity'].map(category => {
              const categoryFAQs = groupedFAQs[category];
              if (!categoryFAQs || categoryFAQs.length === 0) return null;
              
              const config = categoryConfig[category] || {
                icon: FileText,
                label: category,
                color: 'bg-gray-100 text-gray-700',
              };
              const Icon = config.icon;
              const isExpanded = expandedCategories.has(category);

              return (
                <Card key={category} className="border-2 hover:border-blue-300 transition-all">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-blue-50 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Badge className={`${config.color} text-sm px-3 py-1`}>
                        <Icon className="w-4 h-4 mr-2 inline" />
                        {config.label}
                      </Badge>
                      <span className="text-sm text-gray-600">{categoryFAQs.length} FAQs</span>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <CardContent className="pt-0 pb-6 px-6">
                      <div className="space-y-4">
                        {categoryFAQs.map((faq) => (
                          <div
                            key={faq.id}
                            className="border-l-4 border-blue-200 pl-4 py-2 hover:border-blue-400 transition-colors"
                          >
                            <h3 className="font-semibold text-gray-900 mb-2 text-base">
                              {highlightText(faq.question, searchTerm)}
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm">
                              {highlightText(faq.answer, searchTerm)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </TabsContent>

          {/* Transport Options Tab */}
          <TabsContent value="transport-options" className="space-y-4">
            {['transport', 'driving', 'clinic_travel'].map(category => {
              const categoryFAQs = groupedFAQs[category];
              if (!categoryFAQs || categoryFAQs.length === 0) return null;
              
              const config = categoryConfig[category] || {
                icon: FileText,
                label: category,
                color: 'bg-gray-100 text-gray-700',
              };
              const Icon = config.icon;
              const isExpanded = expandedCategories.has(category);

              return (
                <Card key={category} className="border-2 hover:border-blue-300 transition-all">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-blue-50 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Badge className={`${config.color} text-sm px-3 py-1`}>
                        <Icon className="w-4 h-4 mr-2 inline" />
                        {config.label}
                      </Badge>
                      <span className="text-sm text-gray-600">{categoryFAQs.length} FAQs</span>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <CardContent className="pt-0 pb-6 px-6">
                      <div className="space-y-4">
                        {categoryFAQs.map((faq) => (
                          <div
                            key={faq.id}
                            className="border-l-4 border-blue-200 pl-4 py-2 hover:border-blue-400 transition-colors"
                          >
                            <h3 className="font-semibold text-gray-900 mb-2 text-base">
                              {highlightText(faq.question, searchTerm)}
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm">
                              {highlightText(faq.answer, searchTerm)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </TabsContent>

          {/* At the Clinic Tab */}
          <TabsContent value="at-clinic" className="space-y-4">
            {['appointments', 'clinic_experience'].map(category => {
              const categoryFAQs = groupedFAQs[category];
              if (!categoryFAQs || categoryFAQs.length === 0) return null;
              
              const config = categoryConfig[category] || {
                icon: FileText,
                label: category,
                color: 'bg-gray-100 text-gray-700',
              };
              const Icon = config.icon;
              const isExpanded = expandedCategories.has(category);

              return (
                <Card key={category} className="border-2 hover:border-blue-300 transition-all">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-blue-50 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Badge className={`${config.color} text-sm px-3 py-1`}>
                        <Icon className="w-4 h-4 mr-2 inline" />
                        {config.label}
                      </Badge>
                      <span className="text-sm text-gray-600">{categoryFAQs.length} FAQs</span>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <CardContent className="pt-0 pb-6 px-6">
                      <div className="space-y-4">
                        {categoryFAQs.map((faq) => (
                          <div
                            key={faq.id}
                            className="border-l-4 border-blue-200 pl-4 py-2 hover:border-blue-400 transition-colors"
                          >
                            <h3 className="font-semibold text-gray-900 mb-2 text-base">
                              {highlightText(faq.question, searchTerm)}
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm">
                              {highlightText(faq.answer, searchTerm)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </TabsContent>

          {/* After Treatment Tab */}
          <TabsContent value="after-treatment" className="space-y-4">
            {['return_followup', 'post_treatment', 'health_safety'].map(category => {
              const categoryFAQs = groupedFAQs[category];
              if (!categoryFAQs || categoryFAQs.length === 0) return null;
              
              const config = categoryConfig[category] || {
                icon: FileText,
                label: category,
                color: 'bg-gray-100 text-gray-700',
              };
              const Icon = config.icon;
              const isExpanded = expandedCategories.has(category);

              return (
                <Card key={category} className="border-2 hover:border-blue-300 transition-all">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-blue-50 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Badge className={`${config.color} text-sm px-3 py-1`}>
                        <Icon className="w-4 h-4 mr-2 inline" />
                        {config.label}
                      </Badge>
                      <span className="text-sm text-gray-600">{categoryFAQs.length} FAQs</span>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <CardContent className="pt-0 pb-6 px-6">
                      <div className="space-y-4">
                        {categoryFAQs.map((faq) => (
                          <div
                            key={faq.id}
                            className="border-l-4 border-blue-200 pl-4 py-2 hover:border-blue-400 transition-colors"
                          >
                            <h3 className="font-semibold text-gray-900 mb-2 text-base">
                              {highlightText(faq.question, searchTerm)}
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm">
                              {highlightText(faq.answer, searchTerm)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </TabsContent>

          {/* Special Cases Tab */}
          <TabsContent value="special-cases" className="space-y-4">
            {['pitfalls', 'edge_emergency', 'afterhours', 'safety', 'meta'].map(category => {
              const categoryFAQs = groupedFAQs[category];
              if (!categoryFAQs || categoryFAQs.length === 0) return null;
              
              const config = categoryConfig[category] || {
                icon: FileText,
                label: category,
                color: 'bg-gray-100 text-gray-700',
              };
              const Icon = config.icon;
              const isExpanded = expandedCategories.has(category);

              return (
                <Card key={category} className="border-2 hover:border-blue-300 transition-all">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-blue-50 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Badge className={`${config.color} text-sm px-3 py-1`}>
                        <Icon className="w-4 h-4 mr-2 inline" />
                        {config.label}
                      </Badge>
                      <span className="text-sm text-gray-600">{categoryFAQs.length} FAQs</span>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <CardContent className="pt-0 pb-6 px-6">
                      <div className="space-y-4">
                        {categoryFAQs.map((faq) => (
                          <div
                            key={faq.id}
                            className="border-l-4 border-blue-200 pl-4 py-2 hover:border-blue-400 transition-colors"
                          >
                            <h3 className="font-semibold text-gray-900 mb-2 text-base">
                              {highlightText(faq.question, searchTerm)}
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm">
                              {highlightText(faq.answer, searchTerm)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Fallback for search results - show all matching categories */}
        {searchTerm && (
          <div className="space-y-4 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Search Results</h3>
            {Object.entries(groupedFAQs).map(([category, categoryFAQs]) => {
            const config = categoryConfig[category] || {
              icon: FileText,
              label: category,
              color: 'bg-gray-100 text-gray-700',
            };
            const Icon = config.icon;
            const isExpanded = expandedCategories.has(category);

            return (
              <Card key={category} className="border-2 hover:border-blue-300 transition-all">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${config.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{config.label}</h3>
                      <p className="text-sm text-gray-600">
                        {categoryFAQs.length} question{categoryFAQs.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                      {categoryFAQs.length}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 space-y-3">
                    {categoryFAQs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg"
                      >
                        <button
                          onClick={() => toggleQuestion(faq.id)}
                          className="w-full text-left"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-semibold text-gray-900 flex-1">
                              {highlightText(faq.question, searchTerm)}
                            </p>
                            <ChevronDown
                              className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                                expandedQuestions.has(faq.id) ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </button>
                        {expandedQuestions.has(faq.id) && (
                          <div className="mt-3 space-y-2">
                            <p className="text-gray-700 leading-relaxed">
                              {highlightText(faq.answer, searchTerm)}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
          </div>
        )}\n\n        {/* Empty State */}\n        {Object.keys(groupedFAQs).length === 0 && searchTerm && (
          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any FAQs matching "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Clear search and browse all questions
            </button>
          </Card>
        )}

            {/* Footer Help */}
            <Card className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-600 rounded-full">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Still have questions?</h3>
                    <p className="text-gray-700 mb-3">
                      Try our AI chatbot for personalized answers to your specific travel situation.
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                      Chat with AI Assistant
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <ChatHelperTextbox />
    </MasterTemplate>
  );
};

export default TravelGuide;
