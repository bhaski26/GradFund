from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.expense import Expense


def get_current_month_range():
    """
    Return the start and exclusive end date
    for the current month.
    """

    today = date.today()

    current_year = today.year
    current_month = today.month

    month_start = date(
        current_year,
        current_month,
        1,
    )

    if current_month == 12:
        next_month = date(
            current_year + 1,
            1,
            1,
        )
    else:
        next_month = date(
            current_year,
            current_month + 1,
            1,
        )

    return month_start, next_month


def get_highest_spending_category(
    db: Session,
    user_id: int,
):
    """
    Return the highest spending category
    and its percentage of total monthly expenses.
    """

    month_start, next_month = (
        get_current_month_range()
    )

    category_summary = (
        db.query(
            Expense.category,
            func.sum(
                Expense.amount
            ).label("total"),
        )
        .filter(
            Expense.user_id == user_id,
            Expense.expense_date >= month_start,
            Expense.expense_date < next_month,
        )
        .group_by(
            Expense.category
        )
        .all()
    )

    if not category_summary:
        return None, 0

    highest_category = max(
        category_summary,
        key=lambda item: item.total,
    )

    total_expenses = sum(
        item.total
        for item in category_summary
    )

    if total_expenses <= 0:
        return highest_category, 0

    category_percentage = (
        highest_category.total
        / total_expenses
    ) * 100

    return (
        highest_category,
        round(category_percentage, 2),
    )


def get_highest_category_transactions(
    db: Session,
    user_id: int,
    highest_category,
):
    """
    Return all current-month transactions
    belonging to the highest spending category.
    """

    if highest_category is None:
        return []

    month_start, next_month = (
        get_current_month_range()
    )

    transactions = (
        db.query(Expense)
        .filter(
            Expense.user_id == user_id,
            Expense.category == highest_category.category,
            Expense.expense_date >= month_start,
            Expense.expense_date < next_month,
        )
        .order_by(
            Expense.amount.desc()
        )
        .all()
    )

    return transactions