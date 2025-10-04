# Import the required module for text 
# to speech conversion
from gtts import gTTS

# This module is imported so that we can 
# play the converted audio
import os

# The text that you want to convert to audio
mytext = 'Welcome to geeksforgeeks Joe!'

# Language in which you want to convert
language = 'en'


def text_to_wav_gtts(response):
    try:
        myobj = gTTS(text=response, lang=language, slow=False)

        # Saving the converted audio in a mp3 file named
        # welcome 
        myobj.save("speech.wav")
        return "speech.wav"
    except Exception as e:
        print("error occurred ", e)
        return None