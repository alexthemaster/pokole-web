export interface Link {
  shortURL: string;
  longURL: string;
  stats: number;
  created_on: Date;
}

export interface ApiResponse {
  error?: string;
  success?: string;
  token?: string;
  expiresIn?: string;
  URL?: string;
  data?: unknown;
}
