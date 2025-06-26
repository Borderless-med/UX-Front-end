
-- Add RLS policies to allow migration operations on clinics_data table

-- Allow public insert for migration (needed for the migration script)
CREATE POLICY "Allow public insert for migration" 
  ON public.clinics_data 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Allow public update for migration (in case we need to update existing records)
CREATE POLICY "Allow public update for migration" 
  ON public.clinics_data 
  FOR UPDATE 
  TO anon 
  USING (true) 
  WITH CHECK (true);

-- Allow public delete for migration (needed to clear existing data before migration)
CREATE POLICY "Allow public delete for migration" 
  ON public.clinics_data 
  FOR DELETE 
  TO anon 
  USING (true);
