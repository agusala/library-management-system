from fastapi import FastAPI
from .book_router import book_router
from contextlib import asynccontextmanager
from .database import engine,create_table
from . import models


@asynccontextmanager
async def lifespan(app:FastAPI):
    create_table()
    yield

app=FastAPI(title="Sistema Gestion de Libros", lifespan=lifespan)

@app.get("/")
def read_root():
    return{"message":"funciona??"}


app.include_router(book_router)
