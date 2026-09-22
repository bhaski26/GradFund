from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.dependencies import get_db
from app.core.security import get_current_user

from app.models.user import User
from app.models.budget import Budget
from app.models.expense import Expense
from app.models.income import Income

from app.schemas.dashboard import DashboardResponse

from app.services.financial_metrics_service import (
    calculate_savings_rate,
    calculate_budget_usage,
    calculate_health_score,
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/",
    response_model=DashboardResponse,
)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    today = date.today()

    current_month = today.strftime("%B")
    current_year = today.year

    # ----------------------------
    # Current Month Budget
    # ----------------------------

    db_budget = (
        db.query(Budget)
        .filter(
            Budget.user_id == current_user.id,
            Budget.month == current_month,
            Budget.year == current_year,
        )
        .first()
    )

    if not db_budget:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Budget not found for "
                f"{current_month} {current_year}"
            ),
        )

    # ----------------------------
    # Current Month Expenses
    # ----------------------------

    total_expenses = (
        db.query(
            func.sum(Expense.amount)
        )
        .filter(
            Expense.user_id == current_user.id,
            func.extract(
                "month",
                Expense.expense_date,
            ) == today.month,
            func.extract(
                "year",
                Expense.expense_date,
            ) == current_year,
        )
        .scalar()
    )

    if total_expenses is None:
        total_expenses = 0

    # ----------------------------
    # Current Month Income
    # ----------------------------

    total_income = (
        db.query(
            func.sum(Income.amount)
        )
        .filter(
            Income.user_id == current_user.id,
            Income.month == current_month,
            Income.year == current_year,
        )
        .scalar()
    )

    if total_income is None:
        total_income = 0

    # ----------------------------
    # Financial Metrics
    # ----------------------------

    remaining_budget = (
        db_budget.monthly_limit
        - total_expenses
    )

    net_savings = (
        total_income
        - total_expenses
    )

    savings_rate = calculate_savings_rate(
        total_income,
        total_expenses,
    )

    usage_percentage = calculate_budget_usage(
        db_budget.monthly_limit,
        total_expenses,
    )

    # ----------------------------
    # Financial Health Score
    # ----------------------------

    health_score = calculate_health_score(
        usage_percentage,
        savings_rate,
    )

    # ----------------------------
    # Financial Status
    # ----------------------------

    if health_score >= 90:
        financial_status = "Excellent"

    elif health_score >= 75:
        financial_status = "Good"

    elif health_score >= 50:
        financial_status = "Warning"

    else:
        financial_status = "Critical"

    # ----------------------------
    # Budget Status
    # ----------------------------

    if usage_percentage < 80:

        budget_status = "Within Budget"

        message = (
            f"{financial_status} financial health. "
            f"You have used only "
            f"{usage_percentage:.2f}% "
            "of your monthly budget and saved "
            f"{savings_rate:.2f}% "
            "of your income this month."
        )

    elif usage_percentage <= 100:

        budget_status = "Near Budget Limit"

        message = (
            f"{financial_status} financial health. "
            f"You have already used "
            f"{usage_percentage:.2f}% "
            "of your monthly budget."
        )

    else:

        budget_status = "Over Budget"

        message = (
            f"{financial_status} financial health. "
            "You have exceeded your monthly budget by "
            f"₹{abs(remaining_budget):.2f}."
        )

    # ----------------------------
    # Response
    # ----------------------------

    return DashboardResponse(
        monthly_limit=db_budget.monthly_limit,
        total_income=total_income,
        total_expenses=total_expenses,
        remaining_budget=remaining_budget,
        net_savings=net_savings,
        savings_rate=savings_rate,
        usage_percentage=usage_percentage,
        health_score=health_score,
        financial_status=financial_status,
        budget_status=budget_status,
        message=message,
    )