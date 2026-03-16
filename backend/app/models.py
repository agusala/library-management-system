from sqlmodel import SQLModel,Relationship,Field
from typing import Optional, List
from datetime import date
from enum import Enum


#usuario

class UserRole(str,Enum):
    USER="user"
    ADMIN="admin"
class UserBase(SQLModel):
    nombre:str
    email:str

class UserCreate(UserBase):
    password:str

class User(UserBase, table=True):
    id:Optional[int]=Field(default=None,primary_key=True)
    email:str=Field(unique=True,index=True)
    password_hash:str
    role:str=Field(default=UserRole.USER.value,description="Rol del usuario: user o admin")
    books:List["Book"]=Relationship(back_populates="owner")

#libros
class BookBase(SQLModel):
    titulo:str=Field(min_length=1,description="Titulo de Libro")
    autor:str=Field(min_length=1,description="Autor del Libro")
    fecha_publicacion:date=Field(description="Fecha de Publicacion")
class BookCreate(BookBase):
    pass

class Book(BookBase,table=True):
    id:int | None = Field(default=None,primary_key=True)
    owner_id: int = Field(foreign_key="user.id")
    owner: Optional["User"]=Relationship(back_populates="books")

