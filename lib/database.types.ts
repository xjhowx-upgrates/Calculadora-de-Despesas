export type Json = | string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      budgets: {
        Row: {
          amount: number;
          category_id: string | null;
          created_at: string | null;
          id: string;
          month: number;
          updated_at: string | null;
          user_id: string;
          year: number;
        };
        Insert: {
          amount: number;
          category_id?: string | null;
          created_at?: string | null;
          id?: string;
          month: number;
          updated_at?: string | null;
          user_id: string;
          year: number;
        };
        Update: {
          amount?: number;
          category_id?: string | null;
          created_at?: string | null;
          id?: string;
          month?: number;
          updated_at?: string | null;
          user_id?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "budgets_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          color: string;
          created_at: string | null;
          icon: string;
          id: string;
          name: string;
        };
        Insert: {
          color?: string;
          created_at?: string | null;
          icon?: string;
          id?: string;
          name: string;
        };
        Update: {
          color?: string;
          created_at?: string | null;
          icon?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      expenses: {
        Row: {
          amount: number;
          category_id: string | null;
          created_at: string | null;
          date: string;
          description: string;
          id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          category_id?: string | null;
          created_at?: string | null;
          date?: string;
          description: string;
          id?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          category_id?: string | null;
          created_at?: string | null;
          date?: string;
          description?: string;
          id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expenses_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string;
          full_name: string;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email: string;
          full_name: string;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      handle_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
Ok to proceed? (y) 
