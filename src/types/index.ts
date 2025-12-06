export interface Link {
  shortURL: string;
  longURL: string;
  stats: object[];
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
