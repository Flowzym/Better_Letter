import { KIModelSettings } from "../types/KIModelSettings";

export const defaultKIModels: KIModelSettings[] = [
  {
    id: "mistral",
    model: "mistral-7b-instruct",
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    api_key: "",
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 1024,
    active: true,
  },
  {
    id: "mixtral",
    model: "mixtral-8x7b-instruct",
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    api_key: "",
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 2048,
    active: false,
  }
];