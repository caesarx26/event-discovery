"""Planner Agent - Breaks down user requests into executable steps."""

from typing import List, Dict


class PlannerAgent:
    """Agent responsible for planning and task breakdown."""
    
    def __init__(self):
        self.name = "Planner"
    
    def run(self, query: str) -> Dict:
        """
        Break down user query into executable steps.
        
        Args:
            query: User's natural language request
            
        Returns:
            Plan with steps and metadata
        """
        steps = self._create_plan(query)
        
        return {
            "agent": self.name,
            "query": query,
            "steps": steps,
            "total_steps": len(steps)
        }
    
    def _create_plan(self, query: str) -> List[str]:
        """
        Generate plan steps from query.
        
        Examples:
            "Find a cheap comedy show and book it" →
            ["Search events", "Filter by category", "Filter by price", "Select best", "Book ticket"]
        """
        
        # Simple keyword-based planning
        keyword_steps = {
            "find": "Search for events",
            "search": "Search for events",
            "cheap": "Filter by price",
            "expensive": "Filter by price",
            "comedy": "Filter by category (comedy)",
            "music": "Filter by category (music)",
            "theater": "Filter by category (theater)",
            "book": "Execute booking",
            "purchase": "Execute booking",
            "recommend": "Analyze recommendations",
        }
        
        query_lower = query.lower()
        steps = []
        
        # Add initial search step
        if any(word in query_lower for word in ["find", "search", "look", "discover"]):
            steps.append("Discover events from database")
        
        # Add category filtering
        for keyword, step in keyword_steps.items():
            if keyword in query_lower and "category" in step:
                steps.append(step)
                break
        
        # Add price filtering
        if any(word in query_lower for word in ["cheap", "affordable", "budget", "under", "expensive", "premium"]):
            steps.append("Filter by price range")
        
        # Add recommendation step if not already there
        if "recommend" not in [s.lower() for s in steps]:
            steps.append("Analyze recommendations")
        
        # Add booking step
        if any(word in query_lower for word in ["book", "purchase", "buy", "reserve"]):
            steps.append("Execute booking")
        
        # Add confirmation step if booking
        if any(word in query_lower for word in ["book", "purchase", "buy", "reserve"]):
            steps.append("Send confirmation")
        
        # Ensure we have at least a basic flow
        if not steps:
            steps = [
                "Discover events from database",
                "Analyze recommendations",
                "Prepare response"
            ]
        
        return steps


# Global planner instance
planner_agent = PlannerAgent()
