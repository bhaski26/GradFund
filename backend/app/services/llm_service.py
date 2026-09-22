from google import genai

from app.core.config import GEMINI_API_KEY

client = genai.Client(
    api_key=GEMINI_API_KEY
)


def generate_ai_response(
    prompt: str,
) -> str:

    if not prompt.strip():
        return (
            "No prompt was provided."
        )

    try:

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
        )

        return response.text

    except Exception as e:

        return (
            f"Gemini Error: {str(e)}"
        )