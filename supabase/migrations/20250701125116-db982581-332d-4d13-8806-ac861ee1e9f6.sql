
-- Add AI features interest fields to partner_applications table
ALTER TABLE public.partner_applications 
ADD COLUMN sentiment_analysis_interest BOOLEAN DEFAULT FALSE,
ADD COLUMN ai_chatbot_interest BOOLEAN DEFAULT FALSE;
