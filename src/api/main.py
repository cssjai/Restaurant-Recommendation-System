from fastapi import FastAPI,  Request
from logic import getSuggestionsByPrefference
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/suggestions")
async def get_body(request: Request):
    prefs =  await request.json()
    prefs["age"] = int(prefs["age"])
    prefs["smoker"] = int(prefs["smoker"])
    print(prefs)
    return getSuggestionsByPrefference(**prefs)