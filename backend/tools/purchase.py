"""Ticket purchase and booking tools."""

import uuid
from typing import Dict
from datetime import datetime


def purchase_ticket(event_id: int, quantity: int = 1, buyer_name: str = "Guest") -> Dict:
    """
    Simulate ticket purchase/booking.
    
    Args:
        event_id: Event to book
        quantity: Number of tickets
        buyer_name: Name of buyer
        
    Returns:
        Booking confirmation
    """
    booking_id = str(uuid.uuid4())[:8]
    
    return {
        "success": True,
        "booking_id": booking_id,
        "event_id": event_id,
        "quantity": quantity,
        "buyer_name": buyer_name,
        "timestamp": datetime.now().isoformat(),
        "status": "confirmed",
        "confirmation_number": f"CONF-{booking_id.upper()}",
        "message": f"Successfully booked {quantity} ticket(s) for event {event_id}"
    }


def cancel_booking(booking_id: str) -> Dict:
    """
    Simulate booking cancellation.
    
    Args:
        booking_id: Booking ID to cancel
        
    Returns:
        Cancellation confirmation
    """
    return {
        "success": True,
        "booking_id": booking_id,
        "status": "cancelled",
        "refund_amount": None,  # Would calculate in production
        "message": f"Booking {booking_id} has been cancelled"
    }


def get_booking_status(booking_id: str) -> Dict:
    """
    Get status of a booking.
    
    Args:
        booking_id: Booking ID
        
    Returns:
        Booking status
    """
    return {
        "booking_id": booking_id,
        "status": "confirmed",
        "quantity": 1,
        "booking_date": datetime.now().isoformat(),
        "message": f"Booking {booking_id} is confirmed"
    }
