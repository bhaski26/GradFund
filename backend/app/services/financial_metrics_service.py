def calculate_total_savings(
    total_income: float,
    total_expenses: float,
) -> float:
    return total_income - total_expenses


def calculate_savings_rate(
    total_income: float,
    total_expenses: float,
) -> float:
    if total_income <= 0:
        return 0

    total_savings = total_income - total_expenses

    return round(
        (total_savings / total_income) * 100,
        2,
    )


def calculate_budget_usage(
    monthly_limit: float,
    total_expenses: float,
) -> float:
    if monthly_limit <= 0:
        return 0

    return round(
        (total_expenses / monthly_limit) * 100,
        2,
    )


def calculate_savings_score(
    savings_rate: float,
) -> float:
    """
    Calculate savings health on a 0-100 scale.

    Higher savings are rewarded with diminishing returns.
    """

    if savings_rate <= 0:
        return 0.0

    if savings_rate >= 50:
        return round(
            min(
                100,
                95 + (savings_rate - 50) * 0.1,
            ),
            2,
        )

    return round(
        min(
            95,
            savings_rate * 1.9,
        ),
        2,
    )


def calculate_budget_score(
    budget_usage: float,
) -> float:
    """
    Calculate budget discipline on a 0-100 scale.

    The score decreases progressively as budget usage rises.
    """

    if budget_usage < 0:
        budget_usage = 0

    if budget_usage <= 50:
        score = 100 - (budget_usage * 0.20)

    elif budget_usage <= 80:
        score = 90 - ((budget_usage - 50) * 0.50)

    elif budget_usage <= 100:
        score = 75 - ((budget_usage - 80) * 1.50)

    else:
        score = 45 - ((budget_usage - 100) * 1.50)

    return round(
        max(0, min(100, score)),
        2,
    )


def calculate_margin_score(
    savings_rate: float,
) -> float:
    """
    Calculate financial margin on a 0-100 scale.

    The score reflects how much income remains after expenses.
    """

    if savings_rate <= 0:
        return 0.0

    if savings_rate <= 30:
        return round(
            (savings_rate / 30) * 80,
            2,
        )

    return round(
        min(
            100,
            80 + ((savings_rate - 30) / 40) * 20,
        ),
        2,
    )


def calculate_health_score(
    budget_usage: float,
    savings_rate: float,
) -> int:
    """
    Calculate the overall GradFund Financial Health Score.

    Components:

        Savings Health     40%
        Budget Discipline  35%
        Financial Margin   25%

    Returns a score between 0 and 100.
    """

    savings_score = calculate_savings_score(
        savings_rate
    )

    budget_score = calculate_budget_score(
        budget_usage
    )

    margin_score = calculate_margin_score(
        savings_rate
    )

    health_score = (
        savings_score * 0.40
        + budget_score * 0.35
        + margin_score * 0.25
    )

    return round(
        max(
            0,
            min(
                100,
                health_score,
            ),
        )
    )


def get_health_status(
    score: int,
) -> str:
    """
    Convert a numerical health score into
    a human-readable financial status.
    """

    if score >= 90:
        return "Excellent"

    if score >= 80:
        return "Strong"

    if score >= 70:
        return "Healthy"

    if score >= 60:
        return "Needs Attention"

    if score >= 40:
        return "At Risk"

    return "Critical"