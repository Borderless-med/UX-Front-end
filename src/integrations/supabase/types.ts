export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          enamel_shaping: boolean | null
          frenectomy: boolean | null
          gingivectomy: boolean | null
          gum_treatment: boolean | null
          id: number
          inlays_onlays: boolean | null
          mda_license: string | null
          name: string
          oral_cancer_screening: boolean | null
          porcelain_veneers: boolean | null
          rating: number | null
          reviews: number | null
          root_canal: boolean | null
          sentiment: number | null
          sinus_lift: boolean | null
          sleep_apnea_appliances: boolean | null
          teeth_whitening: boolean | null
          tmj_treatment: boolean | null
          tooth_filling: boolean | null
          township: string | null
          updated_at: string | null
          website_url: string | null
          wisdom_tooth: boolean | null
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
          enamel_shaping?: boolean | null
          frenectomy?: boolean | null
          gingivectomy?: boolean | null
          gum_treatment?: boolean | null
          id?: number
          inlays_onlays?: boolean | null
          mda_license?: string | null
          name: string
          oral_cancer_screening?: boolean | null
          porcelain_veneers?: boolean | null
          rating?: number | null
          reviews?: number | null
          root_canal?: boolean | null
          sentiment?: number | null
          sinus_lift?: boolean | null
          sleep_apnea_appliances?: boolean | null
          teeth_whitening?: boolean | null
          tmj_treatment?: boolean | null
          tooth_filling?: boolean | null
          township?: string | null
          updated_at?: string | null
          website_url?: string | null
          wisdom_tooth?: boolean | null
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
          enamel_shaping?: boolean | null
          frenectomy?: boolean | null
          gingivectomy?: boolean | null
          gum_treatment?: boolean | null
          id?: number
          inlays_onlays?: boolean | null
          mda_license?: string | null
          name?: string
          oral_cancer_screening?: boolean | null
          porcelain_veneers?: boolean | null
          rating?: number | null
          reviews?: number | null
          root_canal?: boolean | null
          sentiment?: number | null
          sinus_lift?: boolean | null
          sleep_apnea_appliances?: boolean | null
          teeth_whitening?: boolean | null
          tmj_treatment?: boolean | null
          tooth_filling?: boolean | null
          township?: string | null
          updated_at?: string | null
          website_url?: string | null
          wisdom_tooth?: boolean | null
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
          city: string | null
          clinic_name: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          experience: string | null
          id: string
          phone: string | null
          registration_number: string | null
          services: string | null
          updated_at: string | null
          why_join: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          clinic_name?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          experience?: string | null
          id?: string
          phone?: string | null
          registration_number?: string | null
          services?: string | null
          updated_at?: string | null
          why_join?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          clinic_name?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          experience?: string | null
          id?: string
          phone?: string | null
          registration_number?: string | null
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
          p_user_id: string
          p_data_type: string
          p_clinic_id?: string
          p_practitioner_name?: string
          p_ip_address?: string
          p_user_agent?: string
        }
        Returns: string
      }
      has_valid_consent: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      log_consent: {
        Args: {
          p_user_id: string
          p_consent_type: string
          p_consent_status: boolean
          p_ip_address?: string
          p_user_agent?: string
          p_consent_details?: Json
        }
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
