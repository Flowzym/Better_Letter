export interface KIModelSettings {
  id: string;
  model: string;
  endpoint: string;
  api_key: string;
  temperature: number;
  top_p: number;
  max_tokens: number;
  active: boolean;
}