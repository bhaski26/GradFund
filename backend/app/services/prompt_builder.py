from app.schemas.ai import FinancialContext
from app.services.chat_memory_service import (
    get_history,
)


def build_financial_prompt(
    question,
    context: FinancialContext,
    highest_category,
    category_percentage,
    category_transactions=None,
):

    history = get_history()

    conversation = ""

    for message in history:

        conversation += (
            f"{message['role'].title()}: "
            f"{message['content']}\n"
        )

    if category_transactions is None:
        category_transactions = []

    # ----------------------------
    # Transaction Details
    # ----------------------------

    transaction_details = ""

    for transaction in category_transactions:

        transaction_details += (
            f"- {transaction.title}: "
            f"₹{transaction.amount:.2f} "
            f"on {transaction.expense_date}\n"
        )

    if not transaction_details:
        transaction_details = (
            "No transaction details available."
        )

    # ----------------------------
    # System Instructions
    # ----------------------------

    system_prompt = """
    You are GradFund AI,
    an experienced personal financial coach.

    Your responsibility is to help users
    understand their finances.

    Do not simply list financial numbers.

    Instead:

    • Explain what the numbers mean.
    • Mention strengths.
    • Mention weaknesses.
    • Suggest realistic improvements.
    • Be conversational.
    • Be concise.
    • Use the financial insights provided.
    • Never invent financial information.
    • If information is unavailable,
      say so honestly.

    IMPORTANT:

    The financial metrics provided by the
    GradFund backend are authoritative.

    Do not recalculate financial metrics.

    Do not substitute one metric for another.

    Budget Usage means:
    expenses as a percentage of the monthly budget.

    Savings Rate means:
    savings as a percentage of income.

    Health Score means:
    the backend-calculated financial health
    score out of 100.

    When analyzing spending categories,
    inspect the individual transactions provided.

    Do not automatically assume that the
    highest spending category is unnecessary
    or discretionary.

    For example, rent, tuition, insurance,
    loan payments, and other fixed expenses
    may legitimately dominate a category.

    Distinguish between:
    • Fixed / essential expenses
    • Potentially discretionary expenses

    Do not recommend reducing an expense
    unless the transaction information
    reasonably supports that recommendation.
    """

    # ----------------------------
    # Financial Context
    # ----------------------------

    financial_context = f"""
    User Financial Summary

    Income:
    ₹{context.total_income:.2f}

    Expenses:
    ₹{context.total_expenses:.2f}

    Savings:
    ₹{context.total_savings:.2f}

    Savings Rate:
    {context.savings_rate:.2f}%

    Monthly Budget:
    ₹{context.monthly_limit:.2f}

    Budget Usage:
    {context.budget_usage:.2f}%

    Health Score:
    {context.health_score}/100

    Budget Status:
    {context.budget_status}
    """

    # ----------------------------
    # Spending Insights
    # ----------------------------

    highest_category_name = (
        highest_category.category.title()
        if highest_category
        else "None"
    )

    highest_category_total = (
        highest_category.total
        if highest_category
        else 0
    )

    insights = f"""
    Financial Insights

    Highest Spending Category:
    {highest_category_name}

    Highest Category Total:
    ₹{highest_category_total:.2f}

    Highest Spending Percentage:
    {category_percentage:.2f}%

    Transactions in Highest Spending Category:

    {transaction_details}

    IMPORTANT:

    The category percentage only describes
    how the user's spending is distributed.

    It does NOT automatically mean the category
    represents excessive spending.

    Analyze the individual transactions before
    making recommendations.
    """

    # ----------------------------
    # User Question
    # ----------------------------

    user_prompt = f"""
    Conversation History

    {conversation}

    Current Question:

    {question}
    """

    # ----------------------------
    # Final Prompt
    # ----------------------------

    prompt = (
        system_prompt
        + "\n"
        + financial_context
        + "\n"
        + insights
        + "\n"
        + user_prompt
    )

    return prompt