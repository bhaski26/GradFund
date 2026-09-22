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


def calculate_budget_score(
    budget_usage: float,
) -> int:
    """
    Calculate the budget discipline component
    of the financial health score.
    """

    if budget_usage <= 50:
        return 100

    elif budget_usage <= 60:
        return 90

    elif budget_usage <= 70:
        return 80

    elif budget_usage <= 80:
        return 70

    elif budget_usage <= 90:
        return 55

    elif budget_usage <= 100:
        return 40

    else:
        return 20


def calculate_savings_score(
    savings_rate: float,
) -> int:
    """
    Calculate the savings discipline component
    of the financial health score.
    """

    if savings_rate >= 50:
        return 100

    elif savings_rate >= 40:
        return 90

    elif savings_rate >= 30:
        return 80

    elif savings_rate >= 20:
        return 70

    elif savings_rate >= 10:
        return 55

    elif savings_rate >= 0:
        return 40

    else:
        return 20


def calculate_health_score(
    budget_usage: float,
    savings_rate: float,
) -> int:
    """
    Calculate the overall financial health score.

    Budget discipline contributes 60%.
    Savings discipline contributes 40%.
    """

    budget_score = calculate_budget_score(
        budget_usage
    )

    savings_score = calculate_savings_score(
        savings_rate
    )

    health_score = (
        budget_score * 0.60
        + savings_score * 0.40
    )

    return round(health_score)