const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL || "http://localhost:5000/graphql";

export async function graphQLRequest(query, variables = {}) {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }
  return json;
}
