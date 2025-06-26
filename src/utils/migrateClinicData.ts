
import { supabase } from '@/integrations/supabase/client';
import { clinics } from '@/data/clinics';

export const migrateClinicData = async () => {
  console.log('Starting clinic data migration...');
  
  try {
    // First, clear existing data to avoid duplicates
    const { error: deleteError } = await supabase
      .from('clinics_data')
      .delete()
      .neq('id', 0); // Delete all records

    if (deleteError) {
      console.error('Error clearing existing data:', deleteError);
      return;
    }

    // Transform the original clinic data to match the database schema
    const transformedClinics = clinics.map(clinic => ({
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      dentist: clinic.dentist,
      rating: clinic.rating,
      reviews: clinic.reviews,
      distance: clinic.distance,
      sentiment: clinic.sentiment,
      mda_license: clinic.mdaLicense,
      credentials: clinic.credentials,
      township: clinic.township,
      website_url: clinic.websiteUrl || null,
      // Map treatment booleans to database schema
      tooth_filling: clinic.treatments.toothFilling,
      root_canal: clinic.treatments.rootCanal,
      dental_crown: clinic.treatments.dentalCrown,
      dental_implant: clinic.treatments.dentalImplant,
      teeth_whitening: clinic.treatments.teethWhitening,
      braces: clinic.treatments.braces,
      wisdom_tooth: clinic.treatments.wisdomTooth,
      gum_treatment: clinic.treatments.gumTreatment,
      composite_veneers: clinic.treatments.compositeVeneers,
      porcelain_veneers: clinic.treatments.porcelainVeneers,
      dental_bonding: clinic.treatments.dentalBonding,
      inlays_onlays: clinic.treatments.inlaysOnlays,
      enamel_shaping: clinic.treatments.enamelShaping,
      gingivectomy: clinic.treatments.gingivectomy,
      bone_grafting: clinic.treatments.boneGrafting,
      sinus_lift: clinic.treatments.sinusLift,
      frenectomy: clinic.treatments.frenectomy,
      tmj_treatment: clinic.treatments.tmjTreatment,
      sleep_apnea_appliances: clinic.treatments.sleepApneaAppliances,
      crown_lengthening: clinic.treatments.crownLengthening,
      oral_cancer_screening: clinic.treatments.oralCancerScreening,
      alveoplasty: clinic.treatments.alveoplasty
    }));

    console.log(`Migrating ${transformedClinics.length} clinics...`);

    // Insert all clinics in batches to avoid timeout
    const batchSize = 20;
    for (let i = 0; i < transformedClinics.length; i += batchSize) {
      const batch = transformedClinics.slice(i, i + batchSize);
      
      const { error: insertError } = await supabase
        .from('clinics_data')
        .insert(batch);

      if (insertError) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError);
        throw insertError;
      }

      console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(transformedClinics.length / batchSize)}`);
    }

    console.log('Migration completed successfully!');
    
    // Verify the data
    const { data: verifyData, error: verifyError } = await supabase
      .from('clinics_data')
      .select('count', { count: 'exact' });

    if (verifyError) {
      console.error('Error verifying migration:', verifyError);
    } else {
      console.log(`Total clinics in database: ${verifyData?.length || 0}`);
    }

    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};
