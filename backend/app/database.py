from sqlalchemy import create_engine
from sqlmodel import SQLModel,create_engine,Session
from fastapi import Depends
from typing import Annotated



DATABASE_URL = "postgresql://postgres:12345@localhost:5432/sistem_book"

engine= create_engine(DATABASE_URL)

def create_table():
    SQLModel.metadata.create_all(engine)

def get_db():
    with Session(engine)as session:
        yield session

db_dep = Annotated[Session,Depends(get_db)]




