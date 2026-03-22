# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Terminal 1: Backend

```bash
cd backend

# Create virtual environment (first time only)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Run the server
python app.py
```

The backend will start at `http://localhost:5000`

### Terminal 2: Frontend

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Run development server
npm run dev
```

The frontend will start at `http://localhost:3000`

### 3. Open Your Browser

Visit: **http://localhost:3000**

---

## 💡 Try These Queries

1. **"Show me comedy shows"** - Basic discovery
2. **"Find cheap music events under $50"** - Price filtering
3. **"Find a theater show and book it"** - Category + booking
4. **"Show me the most affordable comedy event"** - Smart selection

---

## 🛠️ Troubleshooting

**Backend won't start?**
- Make sure you're in the `backend/` directory
- Activate the virtual environment
- Port 5000 already in use? Change port in `app.py`

**Frontend won't load?**
- Backend must be running first
- Check that you're in the `frontend/` directory
- Port 3000 already in use? `npm run dev -- --port 3001`

**API calls failing?**
- Check that backend is running
- Verify CORS is enabled in `backend/app.py`
- Check browser console for error details

---

## 📚 Next Steps

1. Explore the code structure in `backend/agents/` and `frontend/src/`
2. Modify mock events in `backend/data/mock_events.json`
3. Add more search filters or booking options
4. Deploy with your favorite platform!

---

**Happy booking! 🎉**
