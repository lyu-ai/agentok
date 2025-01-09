export interface Message {
  id?: number;
  type: 'user' | 'assistant' | 'summary';
  content: string;
  metadata?: any;
  sender?: string;
  receiver?: string;
  created_at?: string;
}
