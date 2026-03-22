"""Event discovery tools."""

import json
from typing import List, Dict

# Load mock events
with open("data/mock_events.json", "r") as f:
    MOCK_EVENTS = json.load(f)


def discover_events(query: str) -> List[Dict]:
    """
    Fetch events from mock dataset based on query.
    
    Args:
        query: Search query string
        
    Returns:
        List of matching events
    """
    query_lower = query.lower()
    results = []
    
    for event in MOCK_EVENTS:
        title_match = query_lower in event["title"].lower()
        desc_match = query_lower in event["description"].lower()
        category_match = query_lower in event["category"].lower()
        
        if title_match or desc_match or category_match:
            results.append(event)
    
    return results if results else MOCK_EVENTS[:3]  # Return top 3 if no match


def get_event_details(event_id: int) -> Dict:
    """
    Get detailed information about a specific event.
    
    Args:
        event_id: Event ID
        
    Returns:
        Event details dictionary
    """
    for event in MOCK_EVENTS:
        if event["id"] == event_id:
            return event
    
    return {"error": f"Event {event_id} not found"}


def search_events_by_category(category: str) -> List[Dict]:
    """
    Search events by category.
    
    Args:
        category: Event category
        
    Returns:
        List of events in that category
    """
    return [e for e in MOCK_EVENTS if e["category"].lower() == category.lower()]


def search_events_by_price_range(min_price: float, max_price: float) -> List[Dict]:
    """
    Search events within price range.
    
    Args:
        min_price: Minimum price
        max_price: Maximum price
        
    Returns:
        List of events in price range
    """
    return [
        e for e in MOCK_EVENTS 
        if e["price_max"] <= max_price and e["price_min"] >= min_price
    ]
