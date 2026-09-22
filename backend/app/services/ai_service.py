from app.schemas.ai import FinancialContext
from app.schemas.ai import Intent

from app.services.insights_service import (
    generate_spending_summary,
    generate_savings_recommendation,
)


def detect_intent(
    question: str
) -> Intent:

    question = question.lower()

    if any(
        word in question
        for word in [
            "health",
            "healthy",
            "score",
        ]
    ):
        return Intent.HEALTH

    if any(
        word in question
        for word in [
            "save",
            "saving",
            "savings",
        ]
    ):
        return Intent.SAVINGS

    if any(
        word in question
        for word in [
            "budget",
            "limit",
            "overspend",
        ]
    ):
        return Intent.BUDGET

    if any(
        word in question
        for word in [
            "expense",
            "expenses",
            "spend",
            "spending",
            "spent",
            "category",
            "food",
        ]
    ):
        return Intent.SPENDING

    return Intent.GENERAL


def generate_financial_advice(
    context: FinancialContext,
) -> str:

    if context.budget_status == "Over Budget":
        return (
            f"Your financial health score is "
            f"{context.health_score}/100. "
            f"You have used "
            f"{context.budget_usage:.2f}% "
            "of your monthly budget. "
            "Review your highest spending categories "
            "and reduce discretionary expenses."
        )

    if context.health_score >= 90:
        return (
            f"Your financial health score is "
            f"{context.health_score}/100. "
            f"You have used "
            f"{context.budget_usage:.2f}% "
            "of your monthly budget and are "
            "maintaining a strong savings rate."
        )

    if context.health_score >= 75:
        return (
            f"Your financial health score is "
            f"{context.health_score}/100. "
            f"You have used "
            f"{context.budget_usage:.2f}% "
            "of your monthly budget. "
            "Your financial position is generally healthy."
        )

    if context.health_score >= 50:
        return (
            f"Your financial health score is "
            f"{context.health_score}/100. "
            f"You have used "
            f"{context.budget_usage:.2f}% "
            "of your monthly budget. "
            "Monitor your spending and look for "
            "opportunities to improve your savings rate."
        )

    return (
        f"Your financial health score is "
        f"{context.health_score}/100. "
        "Your financial position needs attention. "
        "Focus on reducing expenses and improving "
        "your monthly savings."
    )


def answer_question(
    question: str,
    context: FinancialContext,
    highest_category=None,
    category_percentage=0,
):

    intent = detect_intent(question)

    # ----------------------------
    # Health
    # ----------------------------

    if intent == Intent.HEALTH:

        if context.health_score >= 90:
            return (
                f"Your financial health score is "
                f"{context.health_score}/100. "
                f"You are currently using "
                f"{context.budget_usage:.2f}% "
                "of your monthly budget and "
                f"saving {context.savings_rate:.2f}% "
                "of your income."
            )

        elif context.health_score >= 75:
            return (
                f"Your financial health score is "
                f"{context.health_score}/100. "
                f"You are currently using "
                f"{context.budget_usage:.2f}% "
                "of your monthly budget. "
                "Your financial position is generally healthy."
            )

        else:
            return (
                f"Your financial health score is "
                f"{context.health_score}/100. "
                f"Your budget usage is "
                f"{context.budget_usage:.2f}%. "
                "There is room for improvement."
            )

    # ----------------------------
    # Savings
    # ----------------------------

    elif intent == Intent.SAVINGS:

        return (
            f"You have saved "
            f"{context.savings_rate:.2f}% "
            f"of your income "
            f"({context.total_savings:.2f}) "
            "this month."
        )

    # ----------------------------
    # Budget
    # ----------------------------

    elif intent == Intent.BUDGET:

        if context.monthly_limit <= 0:
            return (
                "You do not currently have "
                "a monthly budget set."
            )

        return (
            f"Your current budget status is "
            f"{context.budget_status}. "
            f"You have used "
            f"{context.budget_usage:.2f}% "
            f"of your ₹{context.monthly_limit:.2f} "
            "monthly budget."
        )

    # ----------------------------
    # Spending
    # ----------------------------

    elif intent == Intent.SPENDING:

        summary = generate_spending_summary(
            highest_category,
            category_percentage,
        )

        recommendation = generate_savings_recommendation(
            highest_category
        )

        return (
            summary
            + " "
            + recommendation
        )

    # ----------------------------
    # General
    # ----------------------------

    return generate_financial_advice(
        context
    )