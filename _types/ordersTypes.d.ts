import { Product, ToolsResponse } from "./product";

export type OrderResponse = {
  orders: [
    {
      id: number;
      documentId: string;
      email: string;
      username: string;
      expireDate?: string;
      amount: number;
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
      publishedAt: string; // ISO date string
      category: string;
      month: number;
      TxnID: string | null;
      isPaid: boolean | null;
      products: Product[]; // Replace with specific type if known
      tools: ToolsResponse[]; // Replace with specific type if known
    }
  ];
};


export type CartItem = {
  documentId: string;
  title: string;
  price: number;
  category: string;
  month: number;
  banner?: {
    url: string;
  };
};

export interface GrantedToolDetails {
  documentId: string;
  totalOrder: number;
  // Add other fields as needed
}