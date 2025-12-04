export interface Database {
  public: {
    Tables: {
      scans: {
        Row: {
          id: string;
          ip_address: string;
          qr_id: string;
          scanned_at: string;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          ip_address: string;
          qr_id: string;
          scanned_at?: string;
          user_agent?: string | null;
        };
        Update: {
          id?: string;
          ip_address?: string;
          qr_id?: string;
          scanned_at?: string;
          user_agent?: string | null;
        };
      };
    };
  };
}
