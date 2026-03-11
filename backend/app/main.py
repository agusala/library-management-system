from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .book_router import book_router
from contextlib import asynccontextmanager
from .database import engine,create_table
from . import models
from .auth_router import auth_router

@asynccontextmanager
async def lifespan(app:FastAPI):
    create_table()
    yield

@asynccontextmanager
async def lifespan(app:FastAPI):
    create_table()
    yield

app=FastAPI(title="Sistema Gestion de Libros", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)


app.include_router(book_router)
app.include_router(auth_router)

@app.get("/")
def read_root():
    return{"message":"funciona??"}


