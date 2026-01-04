export type Database = {
  public: {
    Tables: {
      suppliers: {
        Row: {
          id: string;
          company_name: string;
          registry_number: string;
          phone: string;
          address: string;
          email: string;
          is_verified: boolean;
          average_rating: number;
          total_reviews: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          company_name: string;
          registry_number: string;
          phone: string;
          address: string;
          email: string;
          is_verified?: boolean;
          average_rating?: number;
          total_reviews?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          registry_number?: string;
          phone?: string;
          address?: string;
          email?: string;
          is_verified?: boolean;
          average_rating?: number;
          total_reviews?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      pharmacies: {
        Row: {
          id: string;
          pharmacy_name: string;
          license_number: string;
          phone: string;
          address: string;
          email: string;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          pharmacy_name: string;
          license_number: string;
          phone: string;
          address: string;
          email: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pharmacy_name?: string;
          license_number?: string;
          phone?: string;
          address?: string;
          email?: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          supplier_id: string;
          name: string;
          category: string;
          price: number;
          unit: string;
          min_order: number;
          available: boolean;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          name: string;
          category: string;
          price: number;
          unit: string;
          min_order?: number;
          available?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          name?: string;
          category?: string;
          price?: number;
          unit?: string;
          min_order?: number;
          available?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      commercial_agents: {
        Row: {
          id: string;
          supplier_id: string;
          name: string;
          phone: string;
          email: string | null;
          region: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          name: string;
          phone: string;
          email?: string | null;
          region: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          region?: string;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          supplier_id: string;
          pharmacy_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          pharmacy_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          pharmacy_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          document_type: string;
          file_name: string;
          file_url: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_type: string;
          file_name: string;
          file_url?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          document_type?: string;
          file_name?: string;
          file_url?: string | null;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
};

export type Supplier = Database['public']['Tables']['suppliers']['Row'];
export type Pharmacy = Database['public']['Tables']['pharmacies']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type CommercialAgent = Database['public']['Tables']['commercial_agents']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Document = Database['public']['Tables']['documents']['Row'];

export type ProductWithSupplier = Product & {
  supplier: Supplier;
};

export type ReviewWithPharmacy = Review & {
  pharmacy: Pharmacy;
};
