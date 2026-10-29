export const REQUEST_THANKS = "Thanks, we'll be in touch.";
export const REQUEST_ERROR = "We could not send that. Email hi@neonorma.si.";

export function requestContext() {
  const params = new URLSearchParams(window.location.search);
  const source = params.get("source") || window.location.pathname || "/";
  return {
    source: source.slice(0, 200),
    as: (params.get("as") || "").slice(0, 40),
  };
}

export async function postRequest(body: {
  name: string;
  email: string;
  organization: string;
  role: string;
  message: string;
  source: string;
  as: string;
  nn_leave_blank: string;
}) {
  try {
    const response = await fetch("/api/request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) return false;
    const data = (await response.json()) as { ok?: boolean };
    return data.ok === true;
  } catch {
    return false;
  }
}
