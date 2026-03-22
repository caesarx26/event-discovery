"""Pricing and cost estimation tools."""

from typing import Dict, List


def estimate_price(event: Dict) -> float:
    """
    Estimate price for an event (average of min and max).
    
    Args:
        event: Event dictionary with price_min and price_max
        
    Returns:
        Estimated price
    """
    return (event["price_min"] + event["price_max"]) / 2


def adjust_price_for_demand(base_price: float, available: int, total_capacity: int = 200) -> float:
    """
    Adjust price based on availability (scarcity pricing).
    
    Args:
        base_price: Original price
        available: Number of tickets available
        total_capacity: Total venue capacity
        
    Returns:
        Adjusted price
    """
    occupancy_rate = (total_capacity - available) / total_capacity
    
    if occupancy_rate > 0.8:  # 80%+ sold = high demand
        return base_price * 1.25
    elif occupancy_rate > 0.5:  # 50%+ sold
        return base_price * 1.10
    elif available > 100:  # Plenty available
        return base_price * 0.95
    
    return base_price


def calculate_fees(base_price: float) -> Dict[str, float]:
    """
    Calculate service fees and taxes.
    
    Args:
        base_price: Base ticket price
        
    Returns:
        Dictionary with price breakdown
    """
    service_fee = base_price * 0.10  # 10% service fee
    tax = (base_price + service_fee) * 0.08  # 8% tax
    total = base_price + service_fee + tax
    
    return {
        "base_price": round(base_price, 2),
        "service_fee": round(service_fee, 2),
        "tax": round(tax, 2),
        "total": round(total, 2)
    }


def format_price_display(price: float) -> str:
    """Format price for display."""
    return f"${price:.2f}"
