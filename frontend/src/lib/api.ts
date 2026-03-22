/**
 * API client for backend communication
 */

const API_BASE = "http://localhost:5000/api";

export interface Event {
  id: number;
  title: string;
  category: string;
  description: string;
  price_min: number;
  price_max: number;
  available: number;
  date: string;
  link: string;
  estimated_price?: number;
}

export interface AgentResponse {
  query: string;
  planning: {
    agent: string;
    steps: string[];
  };
  research: {
    agent: string;
    discovered_events: Event[];
    success: boolean;
  };
  execution: {
    agent: string;
    selected_event: Event;
    booking?: {
      success: boolean;
      booking_id: string;
      confirmation_number: string;
    };
    message: string;
  };
  success: boolean;
}

/**
 * Run agent pipeline with a user query
 */
export async function runAgentPipeline(query: string, book = false): Promise<AgentResponse> {
  const response = await fetch(`${API_BASE}/agent/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, book }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all events or filtered events
 */
export async function getEvents(
  category?: string,
  maxPrice?: number
): Promise<Event[]> {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (maxPrice) params.append("max_price", maxPrice.toString());

  const response = await fetch(`${API_BASE}/events?${params}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.events;
}

/**
 * Get details for a specific event
 */
export async function getEventDetails(eventId: number): Promise<Event> {
  const response = await fetch(`${API_BASE}/events/${eventId}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Book a ticket
 */
export async function bookTicket(
  eventId: number,
  quantity: number = 1,
  buyerName: string = "Guest"
): Promise<any> {
  const response = await fetch(`${API_BASE}/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_id: eventId,
      quantity,
      buyer_name: buyerName,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
