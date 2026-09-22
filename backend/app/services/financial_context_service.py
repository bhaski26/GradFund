from datetime import date

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.income import Income
from app.models.expense import Expense
from app.models.budget import Budget

from app.schemas.ai import FinancialContext

from app.services.financial_metrics_service import (
    calculate_total_savings,
    calculate_savings_rate,
    calculate_budget_usage,
    calculate_health_score,
)


def build_financial_context(
    db: Session,
    user_id: int,
) -> FinancialContext:

    today = date.today()

    current_month = today.strftime("%B")
    current_year = today.year

    # ----------------------------
    # Income — Current Month
    # ----------------------------

    total_income = (
        db.query(
            func.sum(Income.amount)
        )
        .filter(
            Income.user_id == user_id,
            Income.month == current_month,
            Income.year == current_year,
        )
        .scalar()
    ) or 0

    # ----------------------------
    # Expense — Current Month
    # ----------------------------

    month_start = date(
        current_year,
        today.month,
        1,
    )

    if today.month == 12:
        next_month = date(
            current_year + 1,
            1,
            1,
        )
    else:
        next_month = date(
            current_year,
            today.month + 1,
            1,
        )

    total_expenses = (
        db.query(
            func.sum(Expense.amount)
        )
        .filter(
            Expense.user_id == user_id,
            Expense.expense_date >= month_start,
            Expense.expense_date < next_month,
        )
        .scalar()
    ) or 0

    # ----------------------------
    # Budget — Current Month
    # ----------------------------

    budget = (
        db.query(Budget)
        .filter(
            Budget.user_id == user_id,
            Budget.month == current_month,
            Budget.year == current_year,
        )
        .first()
    )

    # ----------------------------
    # Financial Metrics
    # ----------------------------

    total_savings = calculate_total_savings(
        total_income,
        total_expenses,
    )

    savings_rate = calculate_savings_rate(
        total_income,
        total_expenses,
    )

    # ----------------------------
    # Budget Metrics
    # ----------------------------

    if budget:
        monthly_limit = budget.monthly_limit

        budget_usage = calculate_budget_usage(
            monthly_limit,
            total_expenses,
        )

    else:
        monthly_limit = 0
        budget_usage = 0

    # ----------------------------
    # Financial Health Score
    # ----------------------------

    health_score = calculate_health_score(
        budget_usage,
        savings_rate,
    )

    # ----------------------------
    # Budget Status
    # ----------------------------

    if not budget:
        budget_status = "No Budget Set"

    elif budget_usage < 80:
        budget_status = "Within Budget"

    elif budget_usage <= 100:
        budget_status = "Near Budget Limit"

    else:
        budget_status = "Over Budget"

    # ----------------------------
    # Financial Context
    # ----------------------------

    return FinancialContext(
        total_income=total_income,
        total_expenses=total_expenses,
        total_savings=total_savings,
        savings_rate=savings_rate,
        monthly_limit=monthly_limit,
        budget_usage=budget_usage,
        health_score=health_score,
        budget_status=budget_status,
    )