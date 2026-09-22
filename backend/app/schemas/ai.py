from pydantic import BaseModel
from enum import Enum


class AIQuestion(BaseModel):
    question: str


class AIResponse(BaseModel):
    answer: str


class FinancialContext(BaseModel):
    total_income: float
    total_expenses: float
    total_savings: float
    savings_rate: float
    monthly_limit: float
    budget_usage: float
    health_score: int
    budget_status: str


class Intent(str, Enum):
    HEALTH = "HEALTH"
    SAVINGS = "SAVINGS"
    BUDGET = "BUDGET"
    SPENDING = "SPENDING"
    GENERAL = "GENERAL"