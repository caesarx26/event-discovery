"""Researcher Agent - Retrieves and filters relevant events."""

from typing import List, Dict
from tools import (
    discover_events,
    get_event_details,
    search_events_by_category,
    search_events_by_price_range,
    estimate_price
)


class ResearcherAgent:
    """Agent responsible for event discovery and filtering."""
    
    def __init__(self):
        self.name = "Researcher"
    
    def run(self, plan: Dict) -> Dict:
        """
        Execute research based on plan.
        
        Args:
            plan: Plan from planner agent
            
        Returns:
            Research results with discovered events
        """
        query = plan.get("query", "")
        steps = plan.get("steps", [])
        
        # Execute steps to discover and filter events
        events = self._execute_research(query, steps)
        
        # Enrich events with pricing
        for event in events:
            event["estimated_price"] = estimate_price(event)
        
        return {
            "agent": self.name,
            "plan": plan,
            "discovered_events": events,
            "total_results": len(events),
            "success": len(events) > 0
        }
    
    def _execute_research(self, query: str, steps: List[str]) -> List[Dict]:
        """
        Execute research steps to find events.
        """
        events = []
        
        # Initial discovery
        events = discover_events(query)
        
        # Apply filters based on query
        if self._should_filter_by_price(query):
            price_range = self._extract_price_range(query)
            if price_range:
                events = search_events_by_price_range(price_range[0], price_range[1])
        
        # Apply category filters
        category = self._extract_category(query)
        if category:
            category_events = search_events_by_category(category)
            if category_events:
                events = category_events
        
        # Sort by estimated price (ascending)
        if "cheap" in query.lower() or "affordable" in query.lower():
            events = sorted(events, key=lambda e: estimate_price(e))
        
        return events
    
    def _should_filter_by_price(self, query: str) -> bool:
        """Check if price filtering is needed."""
        price_keywords = ["cheap", "affordable", "budget", "under", "$", "expensive", "premium", "price"]
        return any(kw in query.lower() for kw in price_keywords)
    
    def _extract_price_range(self, query: str) -> tuple:
        """Extract price range from query."""
        import re
        
        # Look for patterns like "under $100" or "cheaper than 50"
        numbers = re.findall(r'\d+', query)
        if numbers:
            threshold = float(numbers[0])
            
            if "under" in query.lower() or "cheaper" in query.lower() or "below" in query.lower():
                return (0, threshold)
            elif "over" in query.lower() or "above" in query.lower():
                return (threshold, 1000)
        
        return None
    
    def _extract_category(self, query: str) -> str:
        """Extract event category from query."""
        categories = ["comedy", "music", "theater", "dance", "sports", "film"]
        query_lower = query.lower()
        
        for category in categories:
            if category in query_lower:
                return category
        
        return None


# Global researcher instance
researcher_agent = ResearcherAgent()
