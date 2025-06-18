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
      access_requests: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          payment_amount: number | null
          requester_id: string
          status: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          payment_amount?: number | null
          requester_id: string
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          payment_amount?: number | null
          requester_id?: string
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_requests_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          content: string
          created_at: string | null
          id: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      app_stats: {
        Row: {
          active_countries: number | null
          id: string
          ideas_submitted_today: number | null
          last_updated: string
          total_users: number | null
        }
        Insert: {
          active_countries?: number | null
          id?: string
          ideas_submitted_today?: number | null
          last_updated?: string
          total_users?: number | null
        }
        Update: {
          active_countries?: number | null
          id?: string
          ideas_submitted_today?: number | null
          last_updated?: string
          total_users?: number | null
        }
        Relationships: []
      }
      featured_ideas: {
        Row: {
          created_at: string
          featured_order: number
          id: string
          idea_id: string | null
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          featured_order?: number
          id?: string
          idea_id?: string | null
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          featured_order?: number
          id?: string
          idea_id?: string | null
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_ideas_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          idea_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          idea_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          idea_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_comments_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_interests: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_interests_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_views: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          ip_address: unknown | null
          viewer_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          ip_address?: unknown | null
          viewer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          ip_address?: unknown | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "idea_views_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          attachments: string[] | null
          category: string
          created_at: string
          creator_id: string
          description: string
          equity_percentage: number | null
          id: string
          interests: number | null
          market_size: string | null
          problem_description: string | null
          status: string | null
          tags: string[] | null
          teaser: string
          title: string
          updated_at: string
          validation_methods: string[] | null
          validation_source: string | null
          views: number | null
        }
        Insert: {
          attachments?: string[] | null
          category: string
          created_at?: string
          creator_id: string
          description: string
          equity_percentage?: number | null
          id?: string
          interests?: number | null
          market_size?: string | null
          problem_description?: string | null
          status?: string | null
          tags?: string[] | null
          teaser: string
          title: string
          updated_at?: string
          validation_methods?: string[] | null
          validation_source?: string | null
          views?: number | null
        }
        Update: {
          attachments?: string[] | null
          category?: string
          created_at?: string
          creator_id?: string
          description?: string
          equity_percentage?: number | null
          id?: string
          interests?: number | null
          market_size?: string | null
          problem_description?: string | null
          status?: string | null
          tags?: string[] | null
          teaser?: string
          title?: string
          updated_at?: string
          validation_methods?: string[] | null
          validation_source?: string | null
          views?: number | null
        }
        Relationships: []
      }
      incomplete_submissions: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          email: string
          id: string
          problem_description: string | null
          reminder_sent: boolean
          tags: string | null
          teaser: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          email: string
          id?: string
          problem_description?: string | null
          reminder_sent?: boolean
          tags?: string | null
          teaser?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          problem_description?: string | null
          reminder_sent?: boolean
          tags?: string | null
          teaser?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          idea_id: string | null
          read_at: string | null
          receiver_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          idea_id?: string | null
          read_at?: string | null
          receiver_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          idea_id?: string | null
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read_at: string | null
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_verifications: {
        Row: {
          access_request_id: string
          amount: number
          created_at: string
          id: string
          screenshot_url: string | null
          transaction_id: string | null
          upi_id: string | null
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          access_request_id: string
          amount: number
          created_at?: string
          id?: string
          screenshot_url?: string | null
          transaction_id?: string | null
          upi_id?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          access_request_id?: string
          amount?: number
          created_at?: string
          id?: string
          screenshot_url?: string | null
          transaction_id?: string | null
          upi_id?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_verifications_access_request_id_fkey"
            columns: ["access_request_id"]
            isOneToOne: false
            referencedRelation: "access_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          email_verified: boolean | null
          experience: string | null
          full_name: string | null
          id: string
          interested_tags: string[] | null
          is_verified_poster: boolean | null
          newsletter_email: string | null
          profile_complete: boolean | null
          profile_picture_url: string | null
          updated_at: string | null
          user_goal: string | null
          user_type: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email_verified?: boolean | null
          experience?: string | null
          full_name?: string | null
          id: string
          interested_tags?: string[] | null
          is_verified_poster?: boolean | null
          newsletter_email?: string | null
          profile_complete?: boolean | null
          profile_picture_url?: string | null
          updated_at?: string | null
          user_goal?: string | null
          user_type?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email_verified?: boolean | null
          experience?: string | null
          full_name?: string | null
          id?: string
          interested_tags?: string[] | null
          is_verified_poster?: boolean | null
          newsletter_email?: string | null
          profile_complete?: boolean | null
          profile_picture_url?: string | null
          updated_at?: string | null
          user_goal?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          created_at: string
          description: string
          executor_id: string
          experience: string | null
          id: string
          idea_id: string
          proposed_equity: number
          status: string
          timeline: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          executor_id: string
          experience?: string | null
          id?: string
          idea_id: string
          proposed_equity: number
          status?: string
          timeline?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          executor_id?: string
          experience?: string | null
          id?: string
          idea_id?: string
          proposed_equity?: number
          status?: string
          timeline?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_ideas: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_ideas_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_idea_interests: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_idea_interests_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_decks: {
        Row: {
          id: string
          user_id: string
          idea_id: string | null
          title: string
          problem_statement: string
          solution: string
          business_model: string
          target_market: string
          competitor_summary: string
          traction: string
          team: string
          ask_and_use_of_funds: string
          deck_content: Json
          pdf_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          idea_id?: string | null
          title: string
          problem_statement: string
          solution: string
          business_model: string
          target_market: string
          competitor_summary: string
          traction: string
          team: string
          ask_and_use_of_funds: string
          deck_content?: Json
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          idea_id?: string | null
          title?: string
          problem_statement?: string
          solution?: string
          business_model?: string
          target_market?: string
          competitor_summary?: string
          traction?: string
          team?: string
          ask_and_use_of_funds?: string
          deck_content?: Json
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pitch_decks_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pitch_decks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_deck_usage: {
        Row: {
          id: string
          user_id: string
          month_year: string
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month_year: string
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month_year?: string
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pitch_deck_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          user_uuid: string
          notification_type: string
          notification_title: string
          notification_message: string
          related_uuid?: string
        }
        Returns: string
      }
      increment_idea_views: {
        Args: { idea_uuid: string; viewer_ip?: unknown }
        Returns: undefined
      }
      is_idea_validated: {
        Args: { idea_id: string }
        Returns: boolean
      }
      toggle_idea_interest: {
        Args: { idea_uuid: string }
        Returns: boolean
      }
      toggle_idea_interest_with_notification: {
        Args: { idea_uuid: string }
        Returns: boolean
      }
      update_app_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_or_create_monthly_usage: {
        Args: { user_uuid: string }
        Returns: {
          id: string
          user_id: string
          month_year: string
          usage_count: number
          created_at: string
          updated_at: string
        }
      }
      increment_pitch_deck_usage: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
