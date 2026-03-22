# System Architecture

## 🗂️ Complete Project Structure

```
event-discovery/
├── backend/                          # Python Flask Backend
│   ├── app.py                       # Main Flask application with routes
│   ├── requirements.txt              # Python dependencies
│   ├── .env                         # Environment configuration
│   ├── .gitignore
│   │
│   ├── agents/                      # Multi-Agent System
│   │   ├── __init__.py
│   │   ├── planner.py              # ✨ Planner Agent - Break down requests
│   │   ├── researcher.py           # 🔍 Researcher Agent - Search & filter
│   │   └── executor.py             # ⚡ Executor Agent - Execute bookings
│   │
│   ├── tools/                       # Agent Tool Functions
│   │   ├── __init__.py
│   │   ├── discovery.py            # Event discovery functions
│   │   ├── pricing.py              # Pricing & cost estimations
│   │   └── purchase.py             # Booking & transaction tools
│   │
│   ├── services/                    # Service Layer
│   │   ├── __init__.py
│   │   └── agent_service.py        # Multi-agent orchestration
│   │
│   ├── db/                          # Database Layer
│   │   ├── __init__.py
│   │   ├── models.py               # SQLAlchemy ORM models
│   │   └── database.db             # SQLite database (generated)
│   │
│   ├── rag/                         # Vector Database (RAG)
│   │   ├── __init__.py
│   │   ├── faiss_index.py          # FAISS vector store implementation
│   │   ├── faiss_index.bin         # Vector index (generated)
│   │   └── faiss_index_metadata.json
│   │
│   └── data/                        # Data Files
│       └── mock_events.json        # Sample event catalog
│
├── frontend/                        # React + TypeScript Frontend
│   ├── src/
│   │   ├── routes/                 # TanStack Router Pages
│   │   │   ├── __root.tsx          # Root layout wrapper
│   │   │   ├── index.tsx           # 🏠 Home page - Hero & search
│   │   │   ├── results.tsx         # 📊 Results page - Search results
│   │   │   └── about.tsx           # ℹ️ About page
│   │   │
│   │   ├── components/             # Reusable Components
│   │   │   ├── Header.tsx          # Navigation header
│   │   │   ├── Footer.tsx          # Footer
│   │   │   ├── ThemeToggle.tsx     # Dark mode toggle
│   │   │   ├── SearchForm.tsx      # 🔎 Search input form
│   │   │   ├── EventCard.tsx       # 🎫 Event display card
│   │   │   ├── ExecutionResult.tsx # ✅ Booking confirmation
│   │   │   └── WorkflowSteps.tsx   # 📋 Agent workflow visualization
│   │   │
│   │   ├── lib/                    # Utilities & Helpers
│   │   │   └── api.ts              # 🌐 API client (backend communication)
│   │   │
│   │   ├── main.tsx                # React entry point
│   │   ├── router.tsx              # TanStack Router setup
│   │   └── styles.css              # Global styles
│   │
│   ├── public/                      # Static assets
│   ├── index.html
│   ├── vite.config.ts              # Vite configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── package.json                # Node dependencies
│   └── README.md
│
├── run_backend.py                  # Convenience backend startup script
├── ARCHITECTURE.md                 # This file
├── QUICKSTART.md                   # Quick start guide
├── README.md                       # Main documentation
└── .gitignore                      # Git ignore rules
```

---

## 🔄 Request Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│  Home Page (Search Form) → Results Page (Display & Booking)    │
└────────────┬──────────────────────────────────────────────────────┘
             │
             │ HTTP POST /api/agent/run
             │ { query: "Find comedy show under $100", book: false }
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FLASK API SERVER                             │
│  app.py → agent_service.run_agent_pipeline()                   │
└────────────┬──────────────────────────────────────────────────────┘
             │
             ├─────────────────────────────────────────────────────┐
             │                                                     │
             ▼                                                     ▼
    ┌──────────────────┐                              ┌──────────────────┐
    │ PLANNER AGENT    │                              │ RESEARCH AGENT   │
    │                  │                              │                  │
    │ Steps:           │        (Parallel)           │ Actions:         │
    │ • Search events  │◄─────────────────────────►  │ • Search events  │
    │ • Filter price   │      (Sequential)            │ • Filter results │
    │ • Book ticket    │                              │ • Estimate price │
    └──────────────────┘                              └────────┬─────────┘
             │                                                │
             │ Returns: {steps, plan}                       │ Returns: {events, success}
             │                                                │
             └────────────────────────┬────────────────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │ EXECUTOR AGENT          │
                        │                         │
                        │ • Select best event     │
                        │ • Calculate fees        │
                        │ • Execute booking       │
                        │ • Return confirmation   │
                        └──────────┬──────────────┘
                                   │
                                   │ Returns: {booking, message}
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RESPONSE BACK TO FRONTEND                     │
│  {                                                              │
│    query: "Find comedy show...",                               │
│    planning: {...},                                            │
│    research: {...},                                            │
│    execution: {...},                                           │
│    success: true                                               │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Multi-Agent System Design

### 1️⃣ Planner Agent
```
Input: Natural Language Query
  "Find a comedy show under $100 and book it"

Process:
  • Parse keywords (find, cheap, comedy, book)
  • Generate execution steps
  • Plan agent responsibilities

Output: Structured Plan
  {
    steps: [
      "Discover events from database",
      "Filter by category (comedy)",
      "Filter by price range",
      "Analyze recommendations",
      "Execute booking",
      "Send confirmation"
    ]
  }
```

### 2️⃣ Researcher Agent
```
Input: Plan from Planner
  
Process:
  • Execute discovery.discover_events(query)
  • Apply category filter if specified
  • Apply price filter if specified
  • Sort results (price, rating, etc.)
  • Enrich with estimated pricing
  • Calculate occupancy rates

Output: Events with Context
  {
    discovered_events: [
      {
        id: 3,
        title: "Stand-up Comedy Hour",
        estimated_price: 42.50,
        available: 67,
        ...
      },
      ...
    ],
    success: true
  }
```

### 3️⃣ Executor Agent
```
Input: Research Results + User Decision
  
Process:
  • Select best event (first in filtered list)
  • Calculate_fees() - breakdown costs
  • purchase_ticket() - simulate booking (if requested)
  • Generate confirmation
  • Return success/failure

Output: Booking Confirmation
  {
    selected_event: {...},
    payment_breakdown: {
      base_price: 42.50,
      service_fee: 4.25,
      tax: 3.74,
      total: 50.49
    },
    booking: {
      success: true,
      booking_id: "ABC123",
      confirmation_number: "CONF-ABC123"
    }
  }
```

---

## 🛠️ Tool Functions

### Discovery Tools
```python
# tools/discovery.py
discover_events(query: str) → List[Event]
search_events_by_category(category: str) → List[Event]
search_events_by_price_range(min: float, max: float) → List[Event]
get_event_details(event_id: int) → Event
```

### Pricing Tools
```python
# tools/pricing.py
estimate_price(event: Event) → float
adjust_price_for_demand(price: float, available: int) → float
calculate_fees(base_price: float) → Dict[str, float]
format_price_display(price: float) → str
```

### Purchase Tools
```python
# tools/purchase.py
purchase_ticket(event_id: int, quantity: int, buyer_name: str) → Dict
cancel_booking(booking_id: str) → Dict
get_booking_status(booking_id: str) → Dict
```

---

## 📊 Data Layer Architecture

### Structured Data (SQLite)
```
Database: database.db
├── events table
│   ├── id (INTEGER PRIMARY KEY)
│   ├── title (TEXT)
│   ├── category (TEXT)
│   ├── description (TEXT)
│   ├── price_min (REAL)
│   ├── price_max (REAL)
│   ├── available (INTEGER)
│   ├── date (TEXT)
│   └── link (TEXT)
│
└── tickets table
    ├── id (INTEGER PRIMARY KEY)
    ├── event_id (INTEGER)
    ├── buyer_name (TEXT)
    ├── email (TEXT)
    ├── quantity (INTEGER)
    ├── price_paid (REAL)
    ├── booking_date (DATETIME)
    └── status (TEXT)
```

### Vector Database (FAISS)
```
FAISS Index: faiss_index.bin
├── Dimension: 1536 (OpenAI embeddings)
├── Vector Per Event: Description + Category + Title
│   Example: "Comedy Magic Show - A hilarious magic show... comedy"
│
└── Vector Store Metadata
    └── faiss_index_metadata.json (event references)
```

### Data in Transit

**Event Model**:
```typescript
interface Event {
  id: number;
  title: string;
  category: string;
  description: string;
  price_min: number;
  price_max: number;
  available: number;
  date: string;
  link: string;
  estimated_price?: number;  // Calculated field
}
```

**Agent Response Model**:
```typescript
interface AgentResponse {
  query: string;
  planning: { agent: string; steps: string[] };
  research: { agent: string; discovered_events: Event[]; success: boolean };
  execution: { agent: string; selected_event: Event; booking?: Booking; message: string };
  success: boolean;
}
```

---

## 🌐 API Contract

### Main Agent Endpoint

**Request**:
```http
POST /api/agent/run
Content-Type: application/json

{
  "query": "Find comedy shows under $100",
  "book": false
}
```

**Response** (200 OK):
```json
{
  "query": "Find comedy shows under $100",
  "planning": {
    "agent": "Planner",
    "steps": [
      "Discover events from database",
      "Filter by category (comedy)",
      "Filter by price range",
      "Analyze recommendations"
    ],
    "total_steps": 4
  },
  "research": {
    "agent": "Researcher",
    "discovered_events": [
      {
        "id": 3,
        "title": "Stand-up Comedy Hour",
        "category": "comedy",
        "price_min": 25,
        "price_max": 60,
        "estimated_price": 42.5,
        "available": 67,
        "date": "2026-04-18"
      }
    ],
    "total_results": 2,
    "success": true
  },
  "execution": {
    "agent": "Executor",
    "selected_event": { /* same as above */ },
    "payment_breakdown": {
      "base_price": 42.5,
      "service_fee": 4.25,
      "tax": 3.74,
      "total": 50.49
    },
    "message": "Ready to book Stand-up Comedy Hour"
  },
  "workflow_stages": ["planning", "research", "execution"],
  "success": true
}
```

### Health Check
```http
GET /api/health

Response: { "status": "ok", "message": "Backend is running" }
```

### List Events
```http
GET /api/events?category=comedy&max_price=100

Response:
{
  "events": [/* array of Event objects */],
  "total": 3
}
```

### Direct Booking
```http
POST /api/book
Content-Type: application/json

{
  "event_id": 3,
  "quantity": 1,
  "buyer_name": "John Doe"
}

Response:
{
  "success": true,
  "booking_id": "abc123",
  "event_id": 3,
  "quantity": 1,
  "confirmation_number": "CONF-ABC123",
  "status": "confirmed",
  "message": "Successfully booked 1 ticket(s)"
}
```

---

## ⚙️ Technology Choices

### Backend: Python + Flask
- **Why Flask?** Lightweight, perfect for API demos, extensible with LangChain
- **Why Python?** Rich AI/ML ecosystem (LangChain, FAISS, NumPy)

### Frontend: React + TypeScript
- **Why TypeScript?** Type safety, better IDE support, catches errors early
- **Why TanStack Router?** Modern file-based routing, fully typed
- **Why Tailwind?** Rapid UI development, consistency, utility-first approach

### Database Choices
- **SQLite**: Zero-configuration, no server needed, perfect for demos
- **FAISS**: Lightweight vector DB, no server, great for local RAG
- **JSON**: Human-readable data files, easy to modify

### AI Architecture
- **Multi-Agent Pattern**: Clear separation of concerns, modularity, reusability
- **Tool-Based Approach**: Agents call functions, easy to extend with real APIs

---

## 🚀 Deployment Considerations

### Backend Deployment
```
Production Options:
• Heroku + Python venv
• AWS Lambda + Python runtime
• Docker (containerized Flask app)
• Railway, Render, PythonAnywhere
```

### Frontend Deployment
```
Production Options:
• Vercel (optimized for React)
• Netlify (simple deployment)
• AWS S3 + CloudFront
• GitHub Pages
• Docker (nginx + static files)
```

### Database Migration
```
For Production:
• SQLite → PostgreSQL (structured data)
• FAISS → Pinecone/Weaviate (managed vector DB)
• JSON → API/Database (dynamic event sources)
```

---

## 🔐 Security Considerations

Current Implementation (Development):
- ❌ No authentication
- ❌ No rate limiting
- ❌ CORS allows all origins
- ❌ No input validation

For Production, Add:
- ✅ JWT authentication
- ✅ Rate limiting (Flask-Limiter)
- ✅ Request validation (Pydantic)
- ✅ CORS restrictions
- ✅ HTTPS/TLS
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Input sanitization

---

## 📈 Performance Metrics

### Expected Response Times
- **Planning**: ~10-50ms (logic-only)
- **Research**: ~50-200ms (search + filter)
- **Execution**: ~10-50ms (booking simulation)
- **Total**: ~100-300ms

### Scalability Considerations
- FAISS supports millions of vectors
- SQLite: ~100k records before needing migration
- Flask: ~100 req/s single instance
- For scale: Add caching (Redis), load balancer, database cluster

---

## 🧪 Testing Strategy

### Backend Testing
```python
# Unit tests for agents
test_planner_agent.py
test_researcher_agent.py
test_executor_agent.py

# Integration tests
test_agent_service.py
test_api_endpoints.py
```

### Frontend Testing
```typescript
// Component tests
SearchForm.test.tsx
EventCard.test.tsx

// Integration tests
results.route.test.tsx

// E2E tests
search-flow.e2e.ts
booking-flow.e2e.ts
```

---

## 📚 Extensions & Enhancements

### Phase 1: MVP ✅
- Multi-agent system
- Mock event data
- Simulated booking

### Phase 2: Enhanced
- Real API integration (Ticketmaster)
- User authentication
- Booking history
- Email confirmations

### Phase 3: Advanced
- LLM-driven agents (OpenAI API)
- Advanced RAG with embeddings
- Streaming responses
- Payment integration
- Mobile app

---

## 🎯 Key Design Patterns

1. **Service Layer Pattern** - Encapsulates business logic
2. **Tool/Function Pattern** - Agents call tools
3. **MVC Pattern** - Clear separation in frontend
4. **Repository Pattern** - Abstracted data access (models.py)
5. **Factory Pattern** - Agent instantiation

---

**For more details, see [README.md](./README.md)** 📖
