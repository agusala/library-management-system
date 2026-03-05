from fastapi import APIRouter, HTTPException,status
from .database import db_dep
from app.models import Book,BookCreate
from sqlmodel import select

book_router = APIRouter(prefix="/books",tags=["books"])

@book_router.post("/")
def create_book(new_book:BookCreate,db:db_dep):
    book=Book(**new_book.model_dump())
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

@book_router.get("/")
def get_books(db:db_dep):
    books= db.exec(select(Book)).all()
    return books

@book_router.get("/{book_id}")
def get_book(book_id:int, db:db_dep):
    book= db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="libro no encontrado")
    return book

@book_router.delete("/{book_id}")
def delete_book(book_id:int, db:db_dep):
    book= db.get(Book,book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="libro no encontrado")
    db.delete(book)
    db.commit()
    return{"message":"Libro eliminado"}