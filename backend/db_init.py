from flask_sqlalchemy import SQLAlchemy
from app import app
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize SQLAlchemy with the Flask app
db = SQLAlchemy(app)

# Define models
class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, email, password, phone=None):
        self.email = email
        self.set_password(password)
        self.phone = phone

    def set_password(self, password):
        """Set password hash"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check password against hash"""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'phone': self.phone,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class EpisodicMemory(db.Model):
    __tablename__ = 'episodic_memories'

    id = db.Column(db.String(36), primary_key=True)
    timestamp = db.Column(db.Float, nullable=False)
    input = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text)
    emotion = db.Column(db.String(50))
    importance = db.Column(db.Float, default=0.5)
    context = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

class SemanticMemory(db.Model):
    __tablename__ = 'semantic_memories'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(100), nullable=False)
    key = db.Column(db.String(255), nullable=False)
    value = db.Column(db.Text, nullable=False)
    source_id = db.Column(db.String(36))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Composite unique constraint on category and key
    __table_args__ = (db.UniqueConstraint('category', 'key'),)

class SystemMetric(db.Model):
    __tablename__ = 'system_metrics'

    id = db.Column(db.Integer, primary_key=True)
    metric_type = db.Column(db.String(50), nullable=False)
    endpoint = db.Column(db.String(255))
    user_id = db.Column(db.String(100))
    response_time = db.Column(db.Float)
    module_name = db.Column(db.String(100))
    execution_time = db.Column(db.Float)
    error_type = db.Column(db.String(100))
    details = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

def init_db():
    """Initialize the database by creating all tables"""
    with app.app_context():
        # Create all tables
        db.create_all()
        print("Database tables created successfully.")

if __name__ == "__main__":
    init_db()
