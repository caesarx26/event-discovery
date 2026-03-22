"""Database models for events and tickets."""

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

DATABASE_URL = "sqlite:///./database.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Event(Base):
    """Event model for database."""
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String)
    description = Column(Text)
    price_min = Column(Float)
    price_max = Column(Float)
    available = Column(Integer)
    date = Column(String)
    link = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Ticket(Base):
    """Ticket model for purchase records."""
    __tablename__ = "tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, index=True)
    buyer_name = Column(String)
    email = Column(String)
    quantity = Column(Integer)
    price_paid = Column(Float)
    booking_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="confirmed")


def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
