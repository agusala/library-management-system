from fastapi import APIRouter, HTTPException,status,Depends,Query
from .database import db_dep
from .models import Book,BookCreate
from .dependencies import get_current_user
from . import models
from sqlmodel import select
from sqlalchemy import func
from .schemas import UserBookListResponse
from datetime import date

book_router = APIRouter(prefix="/books",tags=["books"], redirect_slashes=False)

@book_router.post("/", response_model=Book)
def create_book(new_book:BookCreate,db:db_dep, current_user:models.User=Depends(get_current_user)):
    if new_book.fecha_publicacion > date.today(): 
        raise HTTPException(status_code=400,detail="La fecha no puede ser futura")
    book=Book(**new_book.model_dump(), owner_id=current_user.id)
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

@book_router.get("/",response_model=UserBookListResponse)
def get_books(db:db_dep, current_user:models.User=Depends(get_current_user), limit: int=Query(10,ge=1,le=100),offset:int=Query(0,ge=0)):
    statement = select(Book).where(Book.owner_id==current_user.id).offset(offset).limit(limit)
    books = db.exec(statement).all()
    total_statement=select(func.count()).where(Book.owner_id==current_user.id)
    total=db.exec(total_statement).one()
    return {"items":books,"total":total}

@book_router.get("/{book_id}",response_model=Book)
def get_book(book_id:int, db:db_dep, current_user:models.User=Depends(get_current_user)):
    book= db.get(Book, book_id)
    if not book or book.owner_id!=current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="libro no encontrado")
    return book

@book_router.put("/{book_id}", response_model=Book)
def update_book(
    book_id: int,
    updated_book: BookCreate,
    db: db_dep,
    current_user: models.User = Depends(get_current_user)
):
    book = db.get(Book, book_id)
    if not book or book.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Libro no encontrado")
    if updated_book.fecha_publicacion > date.today():
        raise HTTPException(status_code=400, detail="La fecha de publicación no puede ser futura")
    book.titulo = updated_book.titulo
    book.autor = updated_book.autor
    book.fecha_publicacion = updated_book.fecha_publicacion
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