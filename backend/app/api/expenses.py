from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.dependencies import get_db
from app.core.security import get_current_user

from app.models.user import User
from app.models.expense import Expense

from app.schemas.expense import (
    ExpenseCreate,
    ExpenseResponse,
    ExpenseUpdate,
)
from app.constants.expense_categories import ExpenseCategory


router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"],
)


def apply_date_filter(
    query,
    month: int | None,
    year: int | None,
):
    """
    Apply optional month/year filtering to an expense query.

    If neither month nor year is provided:
        Return all expenses.

    If both are provided:
        Return expenses belonging to that month/year.

    If only one is provided:
        Raise a 400 error.
    """

    if (month is None) != (year is None):
        raise HTTPException(
            status_code=400,
            detail="Month and year must be provided together",
        )

    if month is None and year is None:
        return query

    if month < 1 or month > 12:
        raise HTTPException(
            status_code=400,
            detail="Month must be between 1 and 12",
        )

    if year < 2000 or year > 2100:
        raise HTTPException(
            status_code=400,
            detail="Invalid year",
        )

    start_date = date(year, month, 1)

    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    return query.filter(
        Expense.expense_date >= start_date,
        Expense.expense_date < end_date,
    )


# ---------------------------------------------------------
# CREATE EXPENSE
# ---------------------------------------------------------

@router.post(
    "/",
    response_model=ExpenseResponse,
)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_expense = Expense(
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
        expense_date=expense.expense_date,
        user_id=current_user.id,
    )

    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)

    return db_expense


# ---------------------------------------------------------
# GET EXPENSES
# ---------------------------------------------------------

@router.get(
    "/",
    response_model=list[ExpenseResponse],
)
def get_expenses(
    month: int | None = Query(default=None),
    year: int | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Expense)
        .filter(
            Expense.user_id == current_user.id
        )
        .order_by(
            Expense.expense_date.desc(),
            Expense.id.desc(),
        )
    )

    query = apply_date_filter(
        query,
        month,
        year,
    )

    return query.all()


# ---------------------------------------------------------
# EXPENSE SUMMARY
# ---------------------------------------------------------

@router.get("/summary")
def get_expense_summary(
    month: int | None = Query(default=None),
    year: int | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Expense)
        .filter(
            Expense.user_id == current_user.id
        )
    )

    query = apply_date_filter(
        query,
        month,
        year,
    )

    total_expenses = query.with_entities(
        func.sum(Expense.amount)
    ).scalar()

    expense_count = query.with_entities(
        func.count(Expense.id)
    ).scalar()

    return {
        "total_expenses": total_expenses or 0,
        "expense_count": expense_count or 0,
    }


# ---------------------------------------------------------
# CATEGORY SUMMARY
# ---------------------------------------------------------

@router.get("/category-summary")
def get_category_summary(
    month: int | None = Query(default=None),
    year: int | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(
            Expense.category,
            func.sum(Expense.amount).label("total"),
        )
        .filter(
            Expense.user_id == current_user.id
        )
    )

    query = apply_date_filter(
        query,
        month,
        year,
    )

    results = (
        query
        .group_by(Expense.category)
        .all()
    )

    return [
        {
            "category": category,
            "total": total,
        }
        for category, total in results
    ]


# ---------------------------------------------------------
# UPDATE EXPENSE
# ---------------------------------------------------------

@router.put(
    "/{expense_id}",
    response_model=ExpenseResponse,
)
def update_expense(
    expense_id: int,
    expense: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == current_user.id,
        )
        .first()
    )

    if not db_expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    db_expense.title = expense.title
    db_expense.amount = expense.amount
    db_expense.category = expense.category
    db_expense.expense_date = expense.expense_date

    db.commit()
    db.refresh(db_expense)

    return db_expense


# ---------------------------------------------------------
# DELETE EXPENSE
# ---------------------------------------------------------

@router.delete(
    "/{expense_id}"
)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == current_user.id,
        )
        .first()
    )

    if not db_expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    db.delete(db_expense)
    db.commit()

    return {
        "message": "Expense deleted successfully"
    }