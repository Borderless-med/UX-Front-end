
-- Add AI features interest fields to waitlist_signups table
ALTER TABLE public.waitlist_signups 
ADD COLUMN ai_chatbot_interest BOOLEAN DEFAULT FALSE,
ADD COLUMN clinic_analytics_interest BOOLEAN DEFAULT FALSE;
