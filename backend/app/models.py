from sqlmodel import SQLModel,Relationship,Field
from typing import Optional, List

#usuario

class UserBase(SQLModel):
    nombre:str
    email:str

class UserCreate(UserBase):
    password:str

class User(UserBase, table=True):
    id:Optional[int]=Field(default=None,primary_key=True)
    password_hash:str
    books:List["Book"]=Relationship(back_populates="owner")

#libros
class BookBase(SQLModel):
    titulo:str
    autor:str

class BookCreate(BookBase):
    pass

class Book(BookBase,table=True):
    id:int | None = Field(default=None,primary_key=True)
    owner_id: int = Field(foreign_key="user.id")
    owner: Optional["User"]=Relationship(back_populates="books")

