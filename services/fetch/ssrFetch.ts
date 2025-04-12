/* eslint-disable @typescript-eslint/no-explicit-any */
export type fetchTypePublic = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  cache?: RequestCache;
  payload?: any;
  server?: string;
  revalidate?: number;
};

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

const fetchPublic = async (props: fetchTypePublic) => {
  try {
    const res = await fetch(`${props.server ?? apiUrl}${props.path}`, {
      next: { revalidate: props.revalidate ?? 0 },
      method: props.method ?? "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      ...(props.payload && { body: JSON.stringify(props.payload) }),
    });
    const data = res.json();
    return data;
  } catch {
    return [];
  }
};

export { fetchPublic };
