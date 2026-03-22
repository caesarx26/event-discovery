# 🎟️ Multi-Agent Ticket Discovery + Booking System

A full-stack AI-powered event discovery and booking application featuring a multi-agent system that plans, researches, and executes ticket purchases.

## 🎯 Project Overview

This system demonstrates a sophisticated multi-agent architecture where specialized AI agents work together to:
1. **Plan** - Break down user requests into actionable steps
2. **Research** - Discover and filter relevant events using RAG
3. **Execute** - Handle booking and purchase workflows

### Key Features

✨ **Multi-Agent Workflow** - Planner → Researcher → Executor architecture  
🔍 **RAG (Retrieval Augmented Generation)** - Semantic search using FAISS vector database  
💰 **Smart Pricing** - Pricing logic with demand-based adjustments  
🎯 **Hybrid Data Layer** - Structured DB + Vector DB (optional API integration)  
📊 **Simulated Transactions** - Realistic booking workflow  
🚀 **Full-Stack** - React + TypeScript frontend, Flask + Python backend  

---

## 🏗️ Tech Stack

### Backend
- **Framework**: Flask (Python)
- **AI/Agents**: LangChain (extensible architecture)
- **Vector DB**: FAISS (semantic search)
- **Structured DB**: SQLite
- **API Models**: LLM-ready tool definitions

### Frontend
- **Framework**: React 19 + TypeScript
- **Router**: TanStack Router
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

---

## 📁 Project Structure

```
event-discovery/
├── backend/                    # Python Flask backend
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt        # Python dependencies
│   ├── .env                   # Environment variables
│   │
│   ├── agents/                # Multi-agent system
│   │   ├── planner.py        # Breaks down requests
│   │   ├── researcher.py      # Discovers and filters events
│   │   └── executor.py        # Executes bookings
│   │
│   ├── tools/                 # Agent tool functions
│   │   ├── discovery.py       # Event discovery
│   │   ├── pricing.py         # Pricing logic
│   │   └── purchase.py        # Booking functions
│   │
│   ├── services/              # Service layer
│   │   └── agent_service.py  # Agent orchestration
│   │
│   ├── db/                    # Database layer
│   │   ├── models.py          # SQLAlchemy models
│   │   └── database.db        # SQLite database
│   │
│   ├── rag/                   # Vector database
│   │   └── faiss_index.py    # FAISS integration
│   │
│   └── data/                  # Data files
│       └── mock_events.json   # Sample event data
│
├── frontend/                   # React+TypeScript frontend
│   ├── src/
│   │   ├── routes/            # TanStack Router pages
│   │   │   ├── index.tsx      # Home page
│   │   │   ├── results.tsx    # Results/search page
│   │   │   └── about.tsx      # About page
│   │   │
│   │   ├── components/        # React components
│   │   │   ├── SearchForm.tsx       # Search input
│   │   │   ├── EventCard.tsx        # Event display
│   │   │   ├── ExecutionResult.tsx  # Booking UI
│   │   │   └── WorkflowSteps.tsx    # Agent steps display
│   │   │
│   │   ├── lib/               # Utilities
│   │   │   └── api.ts         # API client
│   │   │
│   │   └── main.tsx           # React entry point
│   │
│   └── package.json
│
├── run_backend.py             # Backend startup script
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Backend**: Python 3.8+, pip
- **Frontend**: Node.js 18+, npm/yarn

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (already provided)
# Update OPENAI_API_KEY if using OpenAI

# Start the server
python app.py
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:3000
```

### 3. Access the Application

Open your browser and visit: **http://localhost:3000**

---

## 🧠 How It Works

### User Flow

1. **Input**: User enters a natural language query
   - Example: "Find me a comedy show under $100 and book it"

2. **Planning Stage**:
   - Planner Agent breaks the request into steps
   - Example steps: "Search events" → "Filter by price" → "Execute booking"

3. **Research Stage**:
   - Researcher Agent executes discovery steps
   - Searches mock events (or API)
   - Applies filters (category, price, date)
   - Returns matching events with pricing

4. **Execution Stage**:
   - Executor Agent selects the best option
   - Prepares price breakdown with fees & taxes
   - Optionally executes booking
   - Returns confirmation details

### Agent Architecture

```
User Query
    ↓
┌─────────────────────┐
│  Planner Agent      │ → Generates execution plan
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Researcher Agent    │ → Discovers & filters events
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Executor Agent      │ → Executes booking
└─────────────────────┘
    ↓
Response to User
```

---

## 🛠️ API Endpoints

### Main Endpoint
```http
POST /api/agent/run
```
**Request**:
```json
{
  "query": "Find a comedy show under $100 and book it",
  "book": false
}
```

**Response**:
```json
{
  "query": "...",
  "planning": {
    "agent": "Planner",
    "steps": ["Search events", "Filter by price", "Execute booking"]
  },
  "research": {
    "agent": "Researcher",
    "discovered_events": [...],
    "success": true
  },
  "execution": {
    "agent": "Executor",
    "selected_event": {...},
    "booking": null,
    "message": "Ready to book..."
  },
  "success": true
}
```

### Additional Endpoints

```http
GET  /api/health              # Health check
GET  /api/events              # List all events
GET  /api/events/:id          # Get event details
POST /api/book                # Direct booking
```

---

## 📊 Data Structure

### Event Model
```python
{
  "id": 1,
  "title": "Comedy Magic Show",
  "category": "comedy",
  "description": "A hilarious magic show...",
  "price_min": 35.00,
  "price_max": 85.00,
  "available": 45,
  "date": "2026-04-15",
  "link": "https://tickets.example.com/1"
}
```

### Pricing Logic
```python
# Base price (average of min/max)
estimated_price = (price_min + price_max) / 2

# Dynamic pricing based on scarcity
if occupancy > 80%:
    adjusted_price = estimated_price * 1.25
elif occupancy > 50%:
    adjusted_price = estimated_price * 1.10

# Final cost with fees
service_fee = base_price * 0.10
tax = (base_price + service_fee) * 0.08
total = base_price + service_fee + tax
```

---

## 🎛️ Configuration

### Environment Variables

**Backend (.env)**:
```
FLASK_ENV=development
FLASK_DEBUG=True
OPENAI_API_KEY=your-key-here  # Optional
DATABASE_URL=sqlite:///./database.db
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## 🔄 Agent System Breakdown

### 1. Planner Agent
**Responsibility**: Break down user intent into steps

**Example**:
```
Input: "Find a cheap comedy show and book it"
Output:
  - Discover events from database
  - Filter by category (comedy)
  - Filter by price range
  - Analyze recommendations
  - Execute booking
  - Send confirmation
```

### 2. Researcher Agent
**Responsibility**: Discover and filter events using tools

**Tools Used**:
- `discover_events(query)` - Initial search
- `search_events_by_category(category)` - Category filtering
- `search_events_by_price_range(min, max)` - Price filtering
- `estimate_price(event)` - Pricing calculations

**RAG Implementation**: 
- Events stored in FAISS vector store
- Semantic search on descriptions
- Hybrid: Exact match + semantic similarity

### 3. Executor Agent
**Responsibility**: Execute bookings and prepare responses

**Tools Used**:
- `purchase_ticket(event_id, quantity, buyer_name)` - Simulated booking
- `calculate_fees(price)` - Fee breakdown
- `get_booking_status(booking_id)` - Status checks

---

## 💡 Key Implementation Details

### Multi-Agent Orchestration
```python
# agent_service.py
def run_agent_pipeline(query: str):
    # Step 1: Planning
    plan = planner_agent.run(query)
    
    # Step 2: Research
    research = researcher_agent.run(plan)
    
    # Step 3: Execution
    execution = executor_agent.run(research)
    
    return {plan, research, execution}
```

### Tool Integration
Agents access tools via simple Python functions. In production, this would be extended to:
- LangChain tool definitions
- Proper error handling
- Async execution
- Tool parameter validation

### RAG Setup
```python
# FAISS vector store
faiss_store = FAISSIndex(dimension=1536)
faiss_store.add_events(events)
results = faiss_store.search(query, top_k=5)
```

---

## 🎨 Frontend Features

### Pages

**Home Page** (`/`)
- Hero section with project description
- Search form with example queries
- Multi-agent architecture explanation
- Feature highlights

**Results Page** (`/results`)
- Real-time search results
- Event cards with details
- Workflow visualization
- Price breakdown
- Booking interface
- Confirmation messaging

### UI Components

- **SearchForm**: Query input with loading state
- **EventCard**: Event display with pricing and availability
- **ExecutionResult**: Booking confirmation and payment details
- **WorkflowSteps**: Visual representation of agent pipeline

---

## 🧪 Testing the System

### Example Queries

1. **Basic Discovery**:
   - "Show me comedy events"
   - "What music events are available?"

2. **Price-Based Search**:
   - "Find cheap events under $50"
   - "Show me expensive premium experiences"

3. **Complete Workflow**:
   - "Find a comedy show under $100 and book it"
   - "Search for theater events and complete purchase"

4. **Category + Price**:
   - "Find affordable music events"
   - "Book the cheapest comedy show"

### Expected Output

```
Query: "Find a comedy show under $100 and book it"

Planning:
  ✓ Search events
  ✓ Filter by category (comedy)
  ✓ Filter by price range
  ✓ Analyze recommendations
  ✓ Execute booking

Research:
  ✓ Found 3 matching events
  ✓ "Stand-up Comedy Hour" - $42.50 (preferred)
  ✓ "Comedy Magic Show" - $60.00
  ✓ "Late Night Comedy" - $35.00

Execution:
  ✓ Selected: "Stand-up Comedy Hour"
  ✓ Price: $42.50
  ✓ Fees: $4.25
  ✓ Tax: $3.74
  ✓ Total: $50.49
  ✓ Booking confirmed!
```

---

## 🚀 Optional Enhancements

- **Streaming Responses**: WebSocket-based streaming for real-time agent updates
- **Reasoning Trace**: Detailed explanation of agent decision-making
- **Redis Caching**: Cache event data and search results
- **Real API Integration**: Connect to Ticketmaster or similar APIs
- **User Accounts**: Saved preferences, booking history
- **Email Notifications**: Confirmation emails with booking details
- **Payment Integration**: Real payment processing (Stripe, PayPal)
- **Advanced RAG**: Use OpenAI embeddings for better semantic search

---

## 📝 Project Highlights for Interviews

### Technical Achievements
- ✅ Multi-agent AI system with clear separation of concerns
- ✅ RAG implementation for semantic event search
- ✅ Full-stack application with modern tech stack
- ✅ Simulated but realistic booking workflow
- ✅ Hybrid data layer (Structured + Vector DB)
- ✅ Clean architecture with service layer pattern

### Architecture Decisions
- **Why Multi-Agent?** Modularity, reusability, and clear responsibility boundaries
- **Why FAISS?** Lightweight, efficient semantic search without LLM overhead
- **Why SQLite + JSON?** Simplicity for demo, easily replaceable with production DBs
- **Why Flask?** Lightweight, perfect for API demo, extensible with LangChain

### Talking Points
> "I built a multi-agent system using a planner, researcher, and executor architecture. The system combines RAG for semantic event discovery with structured data for pricing and availability. Agents use Python functions as tools to execute multi-step workflows like finding and booking tickets, simulating a real ticket commerce system."

---

## 🛠️ Troubleshooting

### Backend Issues

**Port Already in Use**:
```bash
# Change port in app.py or:
export FLASK_PORT=5001
```

**Import Errors**:
```bash
# Ensure you're in the backend directory and venv is activated
cd backend
source venv/bin/activate
python app.py
```

### Frontend Issues

**API Connection Failed**:
- Ensure backend is running on http://localhost:5000
- Check CORS settings in `backend/app.py`
- Verify API endpoint in `frontend/src/lib/api.ts`

**Tailwind Not Applied**:
```bash
# Rebuild Tailwind
npm run build
```

---

## 📚 Further Reading

- [TanStack Router Documentation](https://tanstack.com/router)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [LangChain Documentation](https://python.langchain.com/)
- [FAISS Documentation](https://github.com/facebookresearch/faiss)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

## 📄 License

This project is provided as-is for educational and portfolio purposes.

---

## 👨‍💻 Author

Built as a demonstration of modern AI-powered full-stack development.

---

**Ready to book some events? Start by running `npm run dev` in the frontend directory! 🎉**
