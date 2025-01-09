export type Message = {
  id: string;
  content: string;
  type: string;
  sender?: string;
  receiver?: string;
  created_at: Date;
  updated_at: Date;
};
