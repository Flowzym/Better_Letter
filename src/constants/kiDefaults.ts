import { KIModelSettings } from "../types/KIModelSettings";

export const defaultKIModels: KIModelSettings[] = [
  {
    id: "mistral",
    name: "Mistral 7B",
    apiKey: "",
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    model: "mistral-7b-instruct",
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 1024,
    active: true,
  },
  {
    id: "mixtral",
    name: "Mixtral 8x7B",
    apiKey: "",
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    model: "mixtral-8x7b-instruct",
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 2048,
    active: false,
  }
];
