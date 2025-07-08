export interface KIModelSettings {
  id: string;
  name: string;
  api_key: string;
  endpoint: string;
  model: string;
  temperature: number;
  top_p: number;
  max_tokens: number;
  active: boolean;
}
