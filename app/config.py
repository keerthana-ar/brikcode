import os
from dotenv import load_dotenv

load_dotenv()

ATD_API_KEY = os.getenv("ATD_API_KEY")
ATD_SUBMISSIONS_URL = os.getenv("ATD_SUBMISSIONS_URL")
ATD_APIHUB_HOST = os.getenv("ATD_APIHUB_HOST")
ATD_APIHUB_ENDPOINT = os.getenv("ATD_APIHUB_ENDPOINT")
