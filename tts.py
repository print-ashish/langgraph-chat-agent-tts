


import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

def text_to_wav(text, output_path="speech.wav", model="playai-tts", voice="Cheyenne-PlayAI"):
    """
    Converts input text to speech and saves it as a WAV file.

    Args:
        text (str): The text you want to convert to speech.
        output_path (str): Path to save the WAV file.
        model (str): TTS model name.
        voice (str): Voice preset to use.

    Returns:
        str: Path to the saved WAV file.
    """
    try:
        client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        
        response = client.audio.speech.create(
            model=model,
            voice=voice,
            input=text,
            response_format="wav"
        )

        # Save the audio file
        response.write_to_file(output_path)
        return output_path
    except Exception as e:
        print("error occured ", e)
        return None

# # # Example usage
# if __name__ == "__main__":
#     file_path = text_to_wav("Hi how are you Ashish", "speech.wav")
#     print(f"Speech saved at: {file_path}")
