// _types/Product.ts
export interface Product {
  id: string;
  documentId: string;
  title: string;
  getAccessData: string;
  targetUrl: string;
  isOffer: boolean;
  isCreditOffer: boolean;
  offerAmount: number;
  description: Array<{
    type: string;
    children: Array<{ type: string; text: string }>;
  }>;
  price: number;
  month: number;
  instantDelivery: boolean | null;
  whatsIncluded: Array<{
    type: string;
    children: Array<{ type: string; text: string }>;
  }>;
  category: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  banner: {
    id: string;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      thumbnail: { url: string; width: number; height: number };
      large: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      small: { url: string; width: number; height: number };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  files: Record<string, unknown> | null;
  orders: Array<{
    id: string;
    documentId: string;
    email: string;
    username: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    user: string;
    date: string;
  }>;
}

export interface ToolsResponse {
  id:number,
  targetUrl: string;
  category: string;
  month: number;
  toolData: string[];
  createdAt: string;
  documentId?: string;
  totalOrder?: number;
  createOrderDate?: string;
  expireDate?: string;
  isActive?: boolean;
}
