"""Flask API application."""

from flask import Flask, request, jsonify
from flask_cors import CORS
from services.agent_service import agent_service
from db.models import init_db
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize database
init_db()


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "Backend is running"}), 200


@app.route("/api/agent/run", methods=["POST"])
def run_agent():
    """
    Main agent endpoint - processes user query through multi-agent system.
    
    Request body:
    {
        "query": "Find a comedy show under $100 and book it",
        "book": false
    }
    
    Response:
    {
        "query": "...",
        "planning": {...},
        "research": {...},
        "execution": {...},
        "success": true
    }
    """
    try:
        data = request.get_json() or {}
        query = data.get("query", "")
        should_book = data.get("book", False)
        
        if not query:
            return jsonify({"error": "Query is required"}), 400
        
        # Run the agent pipeline
        result = agent_service.run_agent_pipeline(query, should_book=should_book)
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/events", methods=["GET"])
def get_events():
    """
    Get all events (debug endpoint).
    Optional query parameters:
    - category: Filter by category
    - max_price: Filter by max price
    """
    import json
    
    try:
        with open("data/mock_events.json", "r") as f:
            events = json.load(f)
        
        # Apply filters
        category = request.args.get("category")
        max_price = request.args.get("max_price", type=float)
        
        if category:
            events = [e for e in events if e["category"].lower() == category.lower()]
        
        if max_price:
            events = [e for e in events if e["price_min"] <= max_price]
        
        return jsonify({"events": events, "total": len(events)}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    """Get details for a specific event."""
    import json
    
    try:
        with open("data/mock_events.json", "r") as f:
            events = json.load(f)
        
        event = next((e for e in events if e["id"] == event_id), None)
        
        if not event:
            return jsonify({"error": "Event not found"}), 404
        
        return jsonify(event), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/book", methods=["POST"])
def book_event():
    """
    Direct booking endpoint.
    
    Request body:
    {
        "event_id": 1,
        "quantity": 1,
        "buyer_name": "John Doe"
    }
    """
    try:
        from tools import purchase_ticket
        
        data = request.get_json() or {}
        event_id = data.get("event_id")
        quantity = data.get("quantity", 1)
        buyer_name = data.get("buyer_name", "Guest")
        
        if not event_id:
            return jsonify({"error": "event_id is required"}), 400
        
        booking = purchase_ticket(event_id, quantity, buyer_name)
        
        return jsonify(booking), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
