"""Executor Agent - Executes booking and final actions."""

from typing import Dict
from tools import purchase_ticket, calculate_fees


class ExecutorAgent:
    """Agent responsible for executing final actions (bookings, etc)."""
    
    def __init__(self):
        self.name = "Executor"
    
    def run(self, research_results: Dict, should_book: bool = False) -> Dict:
        """
        Execute final actions based on research results.
        
        Args:
            research_results: Results from researcher agent
            should_book: Whether to execute booking
            
        Returns:
            Execution results
        """
        events = research_results.get("discovered_events", [])
        
        if not events:
            return {
                "agent": self.name,
                "success": False,
                "message": "No events found to book"
            }
        
        # Select best event (first in filtered list)
        selected_event = events[0]
        
        result = {
            "agent": self.name,
            "selected_event": selected_event,
            "payment_breakdown": calculate_fees(selected_event["estimated_price"])
        }
        
        if should_book:
            # Execute booking
            booking = purchase_ticket(selected_event["id"], quantity=1, buyer_name="Guest")
            result["booking"] = booking
            result["message"] = f"✅ Successfully booked {selected_event['title']}"
        else:
            result["message"] = f"📋 Ready to book {selected_event['title']}"
        
        return result
    
    def execute_booking(self, event_id: int, quantity: int = 1, buyer_name: str = "Guest") -> Dict:
        """
        Execute a booking for specified event.
        
        Args:
            event_id: Event to book
            quantity: Number of tickets
            buyer_name: Name of buyer
            
        Returns:
            Booking confirmation
        """
        return purchase_ticket(event_id, quantity, buyer_name)


# Global executor instance
executor_agent = ExecutorAgent()
