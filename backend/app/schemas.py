#from pydantic import BaseModel, EmailStr
#from typing import List,Optional
#
#
#
##esquema para libros 
#class BookBase(BaseModel):
#    nombre:str
#    descripcion:str
#class BookCreate(BookBase):
#    pass
#class Book(BookBase):
#    id:int
#    owner_id:int
#    class Config:
#        from_attributes=True
##esquema usuarios 
#class UserBase(BaseModel):
#    nombre:str
#    email:EmailStr
#class UserCreate(UserBase):
#    password:str
#class User(UserBase):
#    id:int
#    books: List[Book]=[]
#    class Config:
#        from_attributes=True
##esquema login
#class Token(BaseModel):
#    access_token:str
#    token_type:str
#class UserLogin(BaseModel):
#    email:EmailStr
#    password:str