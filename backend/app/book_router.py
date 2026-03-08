from fastapi import APIRouter, HTTPException,status,Depends
from .database import db_dep
from .models import Book,BookCreate
from .dependencies import get_current_user
from . import models
from sqlmodel import select

book_router = APIRouter(prefix="/books",tags=["books"])

@book_router.post("/", response_model=Book)
def create_book(new_book:BookCreate,db:db_dep, current_user:get_current_user=Depends(get_current_user)):
    book=Book(**new_book.model_dump(), owner_id=current_user.id)
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

@book_router.get("/",response_model=list[Book])
def get_books(db:db_dep, current_user:models.User=Depends(get_current_user)):
    statement = select(Book).where(Book.owner_id==current_user.id)
    books = db.exec(statement).all()
    return books

@book_router.get("/{book_id}",response_model=Book)
def get_book(book_id:int, db:db_dep, current_user:models.User=Depends(get_current_user)):
    book= db.get(Book, book_id)
    if not book or book.owner_id!=current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="libro no encontrado")
    return book

@book_router.put("/{book_id}",response_model=Book)
def update_book(book_id:int, updated_book:BookCreate,db:db_dep,current_user:models.User=Depends(get_current_user)):
    book=db.get(Book,book_id)
    if not book or book.owne_id!=current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="libro no encontrado")
    book.titulo=updated_book.titulo
    book.autor=updated_book.autor
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

@book_router.delete("/{book_id}")
def delete_book(book_id:int, db:db_dep, current_user:models.User=Depends(get_current_user)):
    book= db.get(Book,book_id)
    if not book or book.owner_id!=current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="libro no encontrado")
    db.delete(book)
    db.commit()
    return{"message":"libro eliminado"}