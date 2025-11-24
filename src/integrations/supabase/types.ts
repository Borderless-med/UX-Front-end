export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointment_bookings: {
        Row: {
          booking_ref: string | null
          clinic_location: string
          consent_given: boolean
          created_at: string
          cancelled_at?: string | null
          cancellation_reason?: string | null
          email: string
          id: string
          patient_name: string
          preferred_date: string
          status: string
          time_slot: string
          treatment_type: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          booking_ref?: string | null
          clinic_location: string
          consent_given?: boolean
          created_at?: string
          cancelled_at?: string | null
          cancellation_reason?: string | null
          email: string
          id?: string
          patient_name: string
          preferred_date: string
          status?: string
          time_slot: string
          treatment_type: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          booking_ref?: string | null
          clinic_location?: string
          consent_given?: boolean
          created_at?: string
          cancelled_at?: string | null
          cancellation_reason?: string | null
          email?: string
          id?: string
          patient_name?: string
          preferred_date?: string
          status?: string
          time_slot?: string
          treatment_type?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      booking_ref_counter: {
        Row: {
          counter: number
          year: number
        }
        Insert: {
          counter?: number
          year: number
        }
        Update: {
          counter?: number
          year?: number
        }
        Relationships: []
      }
      "Clinic  Detail": {
        Row: {
          City: string | null
          "Clinic Addrress": string | null
          "Clinic Name": string | null
          created_at: string
          "Dentist Name": string | null
          Email: string | null
          id: number
          "MDC Registration": string | null
          "Phone number": number | null
          "Reasons to Join Us": string | null
          "Services offered": string | null
          "Years of Experience": string | null
        }
        Insert: {
          City?: string | null
          "Clinic Addrress"?: string | null
          "Clinic Name"?: string | null
          created_at?: string
          "Dentist Name"?: string | null
          Email?: string | null
          id?: number
          "MDC Registration"?: string | null
          "Phone number"?: number | null
          "Reasons to Join Us"?: string | null
          "Services offered"?: string | null
          "Years of Experience"?: string | null
        }
        Update: {
          City?: string | null
          "Clinic Addrress"?: string | null
          "Clinic Name"?: string | null
          created_at?: string
          "Dentist Name"?: string | null
          Email?: string | null
          id?: number
          "MDC Registration"?: string | null
          "Phone number"?: number | null
          "Reasons to Join Us"?: string | null
          "Services offered"?: string | null
          "Years of Experience"?: string | null
        }
        Relationships: []
      }
      clinic_claims: {
        Row: {
          additional_credentials: string | null
          clinic_id: number | null
          clinic_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string
          dentist_name: string | null
          id: string
          operating_hours: string | null
          status: string
          updated_at: string
          verification_notes: string | null
          website_url: string | null
        }
        Insert: {
          additional_credentials?: string | null
          clinic_id?: number | null
          clinic_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          dentist_name?: string | null
          id?: string
          operating_hours?: string | null
          status?: string
          updated_at?: string
          verification_notes?: string | null
          website_url?: string | null
        }
        Update: {
          additional_credentials?: string | null
          clinic_id?: number | null
          clinic_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          dentist_name?: string | null
          id?: string
          operating_hours?: string | null
          status?: string
          updated_at?: string
          verification_notes?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinic_claims_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics_data"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics_data: {
        Row: {
          address: string | null
          alveoplasty: boolean | null
          bone_grafting: boolean | null
          braces: boolean | null
          composite_veneers: boolean | null
          created_at: string | null
          credentials: string | null
          crown_lengthening: boolean | null
          dental_bonding: boolean | null
          dental_crown: boolean | null
          dental_implant: boolean | null
          dentist: string | null
          distance: number | null
          embedding: string | null
          embedding_arr: number[] | null
          enamel_shaping: boolean | null
          frenectomy: boolean | null
          general_dentistry: boolean | null
          gingivectomy: boolean | null
          google_review_url: string | null
          gum_treatment: boolean | null
          id: number
          inlays_onlays: boolean | null
          is_metro_jb: boolean | null
          mda_license: string | null
          name: string
          operating_hours: string | null
          oral_cancer_screening: boolean | null
          place_id: string | null
          porcelain_veneers: boolean | null
          rating: number | null
          reviews: number | null
          root_canal: boolean | null
          sentiment: number | null
          sentiment_ambiance_cleanliness: number | null
          sentiment_convenience: number | null
          sentiment_cost_value: number | null
          sentiment_dentist_skill: number | null
          sentiment_overall: number | null
          sentiment_pain_management: number | null
          sentiment_staff_service: number | null
          sinus_lift: boolean | null
          sleep_apnea_appliances: boolean | null
          teeth_whitening: boolean | null
          tmj_treatment: boolean | null
          tooth_filling: boolean | null
          township: string | null
          updated_at: string | null
          website_url: string | null
            wisdom_tooth: boolean | null
            owner_user_id: string | null
        }
        Insert: {
          address?: string | null
          alveoplasty?: boolean | null
          bone_grafting?: boolean | null
          braces?: boolean | null
          composite_veneers?: boolean | null
          created_at?: string | null
          credentials?: string | null
          crown_lengthening?: boolean | null
          dental_bonding?: boolean | null
          dental_crown?: boolean | null
          dental_implant?: boolean | null
          dentist?: string | null
          distance?: number | null
          embedding?: string | null
          embedding_arr?: number[] | null
          enamel_shaping?: boolean | null
          frenectomy?: boolean | null
          general_dentistry?: boolean | null
          gingivectomy?: boolean | null
          google_review_url?: string | null
          gum_treatment?: boolean | null
          id?: number
          inlays_onlays?: boolean | null
          is_metro_jb?: boolean | null
          mda_license?: string | null
          name: string
          operating_hours?: string | null
          oral_cancer_screening?: boolean | null
          place_id?: string | null
          porcelain_veneers?: boolean | null
          rating?: number | null
          reviews?: number | null
          root_canal?: boolean | null
          sentiment?: number | null
          sentiment_ambiance_cleanliness?: number | null
          sentiment_convenience?: number | null
          sentiment_cost_value?: number | null
          sentiment_dentist_skill?: number | null
          sentiment_overall?: number | null
          sentiment_pain_management?: number | null
          sentiment_staff_service?: number | null
          sinus_lift?: boolean | null
          sleep_apnea_appliances?: boolean | null
          teeth_whitening?: boolean | null
          tmj_treatment?: boolean | null
          tooth_filling?: boolean | null
          township?: string | null
          updated_at?: string | null
          website_url?: string | null
            wisdom_tooth?: boolean | null
            owner_user_id?: string | null
        }
        Update: {
          address?: string | null
          alveoplasty?: boolean | null
          bone_grafting?: boolean | null
          braces?: boolean | null
          composite_veneers?: boolean | null
          created_at?: string | null
          credentials?: string | null
          crown_lengthening?: boolean | null
          dental_bonding?: boolean | null
          dental_crown?: boolean | null
          dental_implant?: boolean | null
          dentist?: string | null
          distance?: number | null
          embedding?: string | null
          embedding_arr?: number[] | null
          enamel_shaping?: boolean | null
          frenectomy?: boolean | null
          general_dentistry?: boolean | null
          gingivectomy?: boolean | null
          google_review_url?: string | null
          gum_treatment?: boolean | null
          id?: number
          inlays_onlays?: boolean | null
          is_metro_jb?: boolean | null
          mda_license?: string | null
          name?: string
          operating_hours?: string | null
          oral_cancer_screening?: boolean | null
          place_id?: string | null
          porcelain_veneers?: boolean | null
          rating?: number | null
          reviews?: number | null
          root_canal?: boolean | null
          sentiment?: number | null
          sentiment_ambiance_cleanliness?: number | null
          sentiment_convenience?: number | null
          sentiment_cost_value?: number | null
          sentiment_dentist_skill?: number | null
          sentiment_overall?: number | null
          sentiment_pain_management?: number | null
          sentiment_staff_service?: number | null
          sinus_lift?: boolean | null
          sleep_apnea_appliances?: boolean | null
          teeth_whitening?: boolean | null
          tmj_treatment?: boolean | null
          tooth_filling?: boolean | null
          township?: string | null
          updated_at?: string | null
          website_url?: string | null
            wisdom_tooth?: boolean | null
            owner_user_id?: string | null
        }
        Relationships: []
      }
        sg_clinics: {
          Row: {
            address: string | null;
            alveoplasty: boolean | null;
            bone_grafting: boolean | null;
            braces: boolean | null;
            composite_veneers: boolean | null;
            created_at: string | null;
            credentials: string | null;
            crown_lengthening: boolean | null;
            dental_bonding: boolean | null;
            dental_crown: boolean | null;
            dental_implant: boolean | null;
            dentist: string | null;
            distance: number | null;
            embedding: string | null;
            embedding_arr: number[] | null;
            enamel_shaping: boolean | null;
            frenectomy: boolean | null;
            general_dentistry: boolean | null;
            gingivectomy: boolean | null;
            google_review_url: string | null;
            gum_treatment: boolean | null;
            id: number;
            inlays_onlays: boolean | null;
            is_metro_jb: boolean | null;
            mda_license: string | null;
            name: string;
            operating_hours: string | null;
            oral_cancer_screening: boolean | null;
            place_id: string | null;
            porcelain_veneers: boolean | null;
            rating: number | null;
            reviews: number | null;
            root_canal: boolean | null;
            sentiment: number | null;
            sentiment_ambiance_cleanliness: number | null;
            sentiment_convenience: number | null;
            sentiment_cost_value: number | null;
            sentiment_dentist_skill: number | null;
            sentiment_overall: number | null;
            sentiment_pain_management: number | null;
            sentiment_staff_service: number | null;
            sinus_lift: boolean | null;
            sleep_apnea_appliances: boolean | null;
            teeth_whitening: boolean | null;
            tmj_treatment: boolean | null;
            tooth_filling: boolean | null;
            township: string | null;
            updated_at: string | null;
            website_url: string | null;
            wisdom_tooth: boolean | null;
            owner_user_id: string | null;
          }
          Insert: {
            address?: string | null;
            alveoplasty?: boolean | null;
            bone_grafting?: boolean | null;
            braces?: boolean | null;
            composite_veneers?: boolean | null;
            created_at?: string | null;
            credentials?: string | null;
            crown_lengthening?: boolean | null;
            dental_bonding?: boolean | null;
            dental_crown?: boolean | null;
            dental_implant?: boolean | null;
            dentist?: string | null;
            distance?: number | null;
            embedding?: string | null;
            embedding_arr?: number[] | null;
            enamel_shaping?: boolean | null;
            frenectomy?: boolean | null;
            general_dentistry?: boolean | null;
            gingivectomy?: boolean | null;
            google_review_url?: string | null;
            gum_treatment?: boolean | null;
            id?: number;
            inlays_onlays?: boolean | null;
            is_metro_jb?: boolean | null;
            mda_license?: string | null;
            name: string;
            operating_hours?: string | null;
            oral_cancer_screening?: boolean | null;
            place_id?: string | null;
            porcelain_veneers?: boolean | null;
            rating?: number | null;
            reviews?: number | null;
            root_canal?: boolean | null;
            sentiment?: number | null;
            sentiment_ambiance_cleanliness?: number | null;
            sentiment_convenience?: number | null;
            sentiment_cost_value?: number | null;
            sentiment_dentist_skill?: number | null;
            sentiment_overall?: number | null;
            sentiment_pain_management?: number | null;
            sentiment_staff_service?: number | null;
            sinus_lift?: boolean | null;
            sleep_apnea_appliances?: boolean | null;
            teeth_whitening?: boolean | null;
            tmj_treatment?: boolean | null;
            tooth_filling?: boolean | null;
            township?: string | null;
            updated_at?: string | null;
            website_url?: string | null;
            wisdom_tooth?: boolean | null;
            owner_user_id?: string | null;
          }
          Update: {
            address?: string | null;
            alveoplasty?: boolean | null;
            bone_grafting?: boolean | null;
            braces?: boolean | null;
            composite_veneers?: boolean | null;
            created_at?: string | null;
            credentials?: string | null;
            crown_lengthening?: boolean | null;
            dental_bonding?: boolean | null;
            dental_crown?: boolean | null;
            dental_implant?: boolean | null;
            dentist?: string | null;
            distance?: number | null;
            embedding?: string | null;
            embedding_arr?: number[] | null;
            enamel_shaping?: boolean | null;
            frenectomy?: boolean | null;
            general_dentistry?: boolean | null;
            gingivectomy?: boolean | null;
            google_review_url?: string | null;
            gum_treatment?: boolean | null;
            id?: number;
            inlays_onlays?: boolean | null;
            is_metro_jb?: boolean | null;
            mda_license?: string | null;
            name?: string;
            operating_hours?: string | null;
            oral_cancer_screening?: boolean | null;
            place_id?: string | null;
            porcelain_veneers?: boolean | null;
            rating?: number | null;
            reviews?: number | null;
            root_canal?: boolean | null;
            sentiment?: number | null;
            sentiment_ambiance_cleanliness?: number | null;
            sentiment_convenience?: number | null;
            sentiment_cost_value?: number | null;
            sentiment_dentist_skill?: number | null;
            sentiment_overall?: number | null;
            sentiment_pain_management?: number | null;
            sentiment_staff_service?: number | null;
            sinus_lift?: boolean | null;
            sleep_apnea_appliances?: boolean | null;
            teeth_whitening?: boolean | null;
            tmj_treatment?: boolean | null;
            tooth_filling?: boolean | null;
            township?: string | null;
            updated_at?: string | null;
            website_url?: string | null;
            wisdom_tooth?: boolean | null;
            owner_user_id?: string | null;
          }
          Relationships: []
        }
      consent_logs: {
        Row: {
          consent_details: Json | null
          consent_status: boolean
          consent_timestamp: string | null
          consent_type: string
          created_at: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          consent_details?: Json | null
          consent_status: boolean
          consent_timestamp?: string | null
          consent_type: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          consent_details?: Json | null
          consent_status?: boolean
          consent_timestamp?: string | null
          consent_type?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          message: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      data_access_audit: {
        Row: {
          access_timestamp: string | null
          accessed_data_type: string
          clinic_id: string | null
          id: string
          ip_address: string | null
          practitioner_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_timestamp?: string | null
          accessed_data_type: string
          clinic_id?: string | null
          id?: string
          ip_address?: string | null
          practitioner_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_timestamp?: string | null
          accessed_data_type?: string
          clinic_id?: string | null
          id?: string
          ip_address?: string | null
          practitioner_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      embeddings: {
        Row: {
          chunk_text: string
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          chunk_text: string
          embedding?: string | null
          id: string
          metadata?: Json | null
        }
        Update: {
          chunk_text?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      opt_out_reports: {
        Row: {
          admin_notes: string | null
          clinic_id: string | null
          clinic_name: string | null
          created_at: string
          description: string
          email: string
          id: string
          name: string
          phone: string | null
          request_type: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          clinic_id?: string | null
          clinic_name?: string | null
          created_at?: string
          description: string
          email: string
          id?: string
          name: string
          phone?: string | null
          request_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          clinic_id?: string | null
          clinic_name?: string | null
          created_at?: string
          description?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          request_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      opt_out_requests: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          processed_by: string | null
          processed_date: string | null
          reason: string | null
          request_date: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          processed_by?: string | null
          processed_date?: string | null
          reason?: string | null
          request_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          processed_by?: string | null
          processed_date?: string | null
          reason?: string | null
          request_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      partner_applications: {
        Row: {
          address: string | null
          ai_chatbot_interest: boolean | null
          city: string | null
          clinic_name: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          experience: string | null
          id: string
          phone: string | null
          registration_number: string | null
          sentiment_analysis_interest: boolean | null
          services: string | null
          updated_at: string | null
          why_join: string | null
        }
        Insert: {
          address?: string | null
          ai_chatbot_interest?: boolean | null
          city?: string | null
          clinic_name?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          experience?: string | null
          id?: string
          phone?: string | null
          registration_number?: string | null
          sentiment_analysis_interest?: boolean | null
          services?: string | null
          updated_at?: string | null
          why_join?: string | null
        }
        Update: {
          address?: string | null
          ai_chatbot_interest?: boolean | null
          city?: string | null
          clinic_name?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          experience?: string | null
          id?: string
          phone?: string | null
          registration_number?: string | null
          sentiment_analysis_interest?: boolean | null
          services?: string | null
          updated_at?: string | null
          why_join?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email_domain: string | null
          full_name: string
          id: string
          is_verified: boolean | null
          organization: string | null
          purpose_of_use: string
          updated_at: string | null
          user_category: Database["public"]["Enums"]["user_category"]
          verification_date: string | null
          verification_method: string | null
        }
        Insert: {
          created_at?: string | null
          email_domain?: string | null
          full_name: string
          id: string
          is_verified?: boolean | null
          organization?: string | null
          purpose_of_use: string
          updated_at?: string | null
          user_category?: Database["public"]["Enums"]["user_category"]
          verification_date?: string | null
          verification_method?: string | null
        }
        Update: {
          created_at?: string | null
          email_domain?: string | null
          full_name?: string
          id?: string
          is_verified?: boolean | null
          organization?: string | null
          purpose_of_use?: string
          updated_at?: string | null
          user_category?: Database["public"]["Enums"]["user_category"]
          verification_date?: string | null
          verification_method?: string | null
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          ai_chatbot_interest: boolean | null
          clinic_analytics_interest: boolean | null
          confirmation_sent_at: string | null
          confirmation_token: string | null
          consent_timestamp: string | null
          created_at: string
          double_optin_confirmed: boolean
          email: string
          id: string
          mobile: string | null
          name: string
          whatsapp_consent: boolean
        }
        Insert: {
          ai_chatbot_interest?: boolean | null
          clinic_analytics_interest?: boolean | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          consent_timestamp?: string | null
          created_at?: string
          double_optin_confirmed?: boolean
          email: string
          id?: string
          mobile?: string | null
          name: string
          whatsapp_consent?: boolean
        }
        Update: {
          ai_chatbot_interest?: boolean | null
          clinic_analytics_interest?: boolean | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          consent_timestamp?: string | null
          created_at?: string
          double_optin_confirmed?: boolean
          email?: string
          id?: string
          mobile?: string | null
          name?: string
          whatsapp_consent?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      audit_data_access: {
        Args: {
          p_clinic_id?: string
          p_data_type: string
          p_ip_address?: string
          p_practitioner_name?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      generate_booking_ref: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_table_columns: {
        Args: { p_table_name: string }
        Returns: {
          column_name: string
          data_type: string
        }[]
      }
      get_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
        }[]
      }
      has_valid_consent: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      log_consent: {
        Args: {
          p_consent_details?: Json
          p_consent_status: boolean
          p_consent_type: string
          p_ip_address?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      match_clinics: {
        Args: {
          match_count: number
          p_township: string
          query_embedding: string
        }
        Returns: {
          address: string
          alveoplasty: boolean
          bone_grafting: boolean
          braces: boolean
          composite_veneers: boolean
          crown_lengthening: boolean
          dental_bonding: boolean
          dental_crown: boolean
          dental_implant: boolean
          enamel_shaping: boolean
          frenectomy: boolean
          gingivectomy: boolean
          gum_treatment: boolean
          id: number
          inlays_onlays: boolean
          name: string
          oral_cancer_screening: boolean
          porcelain_veneers: boolean
          rating: number
          reviews: number
          root_canal: boolean
          similarity: number
          sinus_lift: boolean
          sleep_apnea_appliances: boolean
          teeth_whitening: boolean
          tmj_treatment: boolean
          tooth_filling: boolean
          township: string
          wisdom_tooth: boolean
        }[]
      }
      match_clinics_hybrid: {
        Args: {
          filter_township?: string
          match_count: number
          match_threshold: number
          min_rating?: number
          query_embedding: string
          service_filter?: string
        }
        Returns: {
          address: string
          id: number
          name: string
          rating: number
          reviews: number
          similarity: number
          township: string
        }[]
      }
      match_clinics_simple: {
        Args:
          | { match_count: number; query_embedding: string }
          | { match_count: number; query_embedding_text: string }
        Returns: {
          address: string | null
          alveoplasty: boolean | null
          bone_grafting: boolean | null
          braces: boolean | null
          composite_veneers: boolean | null
          created_at: string | null
          credentials: string | null
          crown_lengthening: boolean | null
          dental_bonding: boolean | null
          dental_crown: boolean | null
          dental_implant: boolean | null
          dentist: string | null
          distance: number | null
          embedding: string | null
          embedding_arr: number[] | null
          enamel_shaping: boolean | null
          frenectomy: boolean | null
          general_dentistry: boolean | null
          gingivectomy: boolean | null
          google_review_url: string | null
          gum_treatment: boolean | null
          id: number
          inlays_onlays: boolean | null
          is_metro_jb: boolean | null
          mda_license: string | null
          name: string
          operating_hours: string | null
          oral_cancer_screening: boolean | null
          place_id: string | null
          porcelain_veneers: boolean | null
          rating: number | null
          reviews: number | null
          root_canal: boolean | null
          sentiment: number | null
          sentiment_ambiance_cleanliness: number | null
          sentiment_convenience: number | null
          sentiment_cost_value: number | null
          sentiment_dentist_skill: number | null
          sentiment_overall: number | null
          sentiment_pain_management: number | null
          sentiment_staff_service: number | null
          sinus_lift: boolean | null
          sleep_apnea_appliances: boolean | null
          teeth_whitening: boolean | null
          tmj_treatment: boolean | null
          tooth_filling: boolean | null
          township: string | null
          updated_at: string | null
          website_url: string | null
          wisdom_tooth: boolean | null
        }[]
      }
      match_documents: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          id: number
          metadata: Json
          similarity: number
          text_content: string
        }[]
      }
      update_sentiments: {
        Args: {
          clinic_id_to_update: number
          s_ambiance: number
          s_convenience: number
          s_cost: number
          s_overall: number
          s_pain: number
          s_skill: number
          s_staff: number
        }
        Returns: undefined
      }
    }
    Enums: {
      user_category:
        | "patient"
        | "healthcare_professional"
        | "clinic_admin"
        | "approved_partner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_category: [
        "patient",
        "healthcare_professional",
        "clinic_admin",
        "approved_partner",
      ],
    },
  },
} as const
