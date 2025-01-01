export type Message = {
  id: string;
  content: string;
  role: string;
  sender?: string;
  receiver?: string;
  created_at: Date;
  updated_at: Date;
};
