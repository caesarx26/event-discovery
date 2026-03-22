"""Agent service orchestration - orchestrates multi-agent workflow."""

from typing import Dict
from agents import planner_agent, researcher_agent, executor_agent


class AgentService:
    """Orchestrates multi-agent workflow."""
    
    def run_agent_pipeline(self, query: str, should_book: bool = False) -> Dict:
        """
        Run the full agent pipeline: Planner → Researcher → Executor.
        
        Args:
            query: User's natural language query
            should_book: Whether to execute booking
            
        Returns:
            Final response with all steps and results
        """
        
        # Step 1: Planner breaks down the query
        plan = planner_agent.run(query)
        
        # Step 2: Researcher discovers and filters events
        research = researcher_agent.run(plan)
        
        # Step 3: Executor prepares or executes booking
        execution = executor_agent.run(research, should_book=should_book)
        
        # Compile final response
        response = {
            "query": query,
            "planning": plan,
            "research": research,
            "execution": execution,
            "workflow_stages": ["planning", "research", "execution"],
            "success": research.get("success", False) and execution.get("message") is not None
        }
        
        return response
    
    def get_event_summary(self, events: list[Dict]) -> str:
        """Generate a text summary of events."""
        if not events:
            return "No events found."
        
        summary = f"Found {len(events)} events:\n\n"
        for i, event in enumerate(events[:3], 1):  # Show top 3
            estimated_price = f"${(event['price_min'] + event['price_max']) / 2:.2f}"
            summary += f"{i}. **{event['title']}** ({event['category'].upper()})\n"
            summary += f"   Date: {event['date']} | Price: {estimated_price}\n"
            summary += f"   {event['description'][:80]}...\n\n"
        
        return summary


# Global service instance
agent_service = AgentService()
