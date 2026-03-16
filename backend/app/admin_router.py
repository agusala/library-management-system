from fastapi import APIRouter,Depends,HTTPException,Query,status
from sqlmodel import select
from sqlalchemy import func
from .database import db_dep
from .models import User,Book
from .dependencies import get_admin_user
from .schemas import BookCreate,AdminBookListResponse, UserResponse,BookWithOwnerResponse,UserListResponse,BookListResponse

admin_router = APIRouter(prefix="/admin",tags=["admin"])

@admin_router.get("/users",response_model=UserListResponse)
def get_all_users(
    db:db_dep,
    admin:User=Depends(get_admin_user),
    limit:int=Query(10,ge=1,le=100),
    offset:int=Query(0,ge=0),
):
    user=db.exec(select(User).offset(offset).limit(limit)).all()
    total=db.exec(select(func.count()).select_from(User)).one()
    return {"items":user,"total":total}

@admin_router.get("/books", response_model=AdminBookListResponse)
def get_all_books(
    db:db_dep,
    admin:User=Depends(get_admin_user),
    limit:int=Query(10,ge=1,le=100),
    offset:int=Query(0,ge=0),
):
    books = db.exec(select(Book).offset(offset).limit(limit)).all()
    total=db.exec(select(func.count()).select_from(Book)).one()
    result=[]
    for book in books:
        owner_nombre=book.owner.nombre if book.owner else "Desconosido"
        result.append({
            "id":book.id,
            "titulo":book.titulo,
            "autor":book.autor,
            "fecha_publicacion":book.fecha_publicacion,
            "owner_id":book.owner_id,
            "owner_nombre":owner_nombre
        })
    return {"items":result, "total":total}

@admin_router.get("/users/{user_id}/books", response_model=list[Book])
def get_user_books(
    user_id: int,
    db: db_dep,
    admin: User = Depends(get_admin_user),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    books = db.exec(
        select(Book)
        .where(Book.owner_id == user_id)
        .offset(offset)
        .limit(limit)
    ).all()
    return books

@admin_router.post("/users/{user_id}/books", response_model=Book)
def create_book_for_user(
    user_id: int,
    book_data: BookCreate,
    db: db_dep,
    admin: User = Depends(get_admin_user),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    book = Book(**book_data.model_dump(), owner_id=user_id)
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

@admin_router.put("/books/{book_id}", response_model=Book)
def update_any_book(
    book_id: int,
    book_data: BookCreate,
    db: db_dep,
    admin: User = Depends(get_admin_user),
):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    # Actualizar campos
    for key, value in book_data.model_dump().items():
        setattr(book, key, value)
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

@admin_router.delete("/books/{book_id}")
def delete_any_book(
    book_id: int,
    db: db_dep,
    admin: User = Depends(get_admin_user),
):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    db.delete(book)
    db.commit()
    return {"message": "Libro eliminado correctamente"}
