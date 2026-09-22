from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.core.security import get_current_user

from app.models.user import User

from app.schemas.ai import (
    AIQuestion,
    AIResponse,
)

from app.services.ai_service import (
    generate_financial_advice,
)

from app.services.financial_context_service import (
    build_financial_context,
)

from app.services.spending_analysis_service import (
    get_highest_spending_category,
    get_highest_category_transactions,
)

from app.services.prompt_builder import (
    build_financial_prompt,
)

from app.services.llm_service import (
    generate_ai_response,
)

from app.services.chat_memory_service import (
    add_message,
)


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.get(
    "/advice",
    response_model=AIResponse,
)
def get_ai_advice(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    context = build_financial_context(
        db,
        current_user.id,
    )

    advice = generate_financial_advice(
        context
    )

    return AIResponse(
        answer=advice
    )


@router.post(
    "/chat",
    response_model=AIResponse,
)
def ai_chat(
    request: AIQuestion,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    # ----------------------------
    # Financial Context
    # ----------------------------

    context = build_financial_context(
        db,
        current_user.id,
    )

    # ----------------------------
    # Spending Analysis
    # ----------------------------

    highest_category, category_percentage = (
        get_highest_spending_category(
            db,
            current_user.id,
        )
    )

    category_transactions = (
        get_highest_category_transactions(
            db,
            current_user.id,
            highest_category,
        )
    )

    # ----------------------------
    # Store User Message
    # ----------------------------

    add_message(
        "user",
        request.question,
    )

    # ----------------------------
    # Build AI Prompt
    # ----------------------------

    prompt = build_financial_prompt(
        request.question,
        context,
        highest_category,
        category_percentage,
        category_transactions,
    )

    # ----------------------------
    # Generate AI Response
    # ----------------------------

    answer = generate_ai_response(
        prompt
    )

    # ----------------------------
    # Store Assistant Message
    # ----------------------------

    add_message(
        "assistant",
        answer,
    )

    return AIResponse(
        answer=answer
    )