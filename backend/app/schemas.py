from pydantic import BaseModel,EmailStr,Field, field_validator
from datetime import date
from .models import Book

class LoginRequest(BaseModel):
    email:EmailStr
    password:str
class LoginResponse(BaseModel):
    id: int
    nombre: str
    email:EmailStr 
    role:str
class UserCreate(BaseModel):
    nombre:str=Field(min_length=2, max_length=20)
    email:EmailStr
    password:str =Field(min_length=8)
    @field_validator("password")
    def validate_password(cls,v):
        if v is None:
            raise ValueError("la contraseña no puede ser nula")
        if not any(char.isdigit()for char in v):
            raise ValueError("la contraseña debe tener al menos un numero")
        if not any(char.isupper()for char in v):
            raise ValueError("La contraseña debe tener al menos una mayuscula")
        return v

class UserResponse(BaseModel):
    id: int
    nombre: str
    email: str
    role: str
class Token(BaseModel):
    access_token:str
    token_type:str
class BookBase(BaseModel):
    titulo:str=Field(min_length=1)
    autor:str=Field(min_length=1)
    fecha_publicacion:date
    @field_validator("fecha_publicacion")
    def validate_fecha(cls, v):
        if v > date.today():
            raise ValueError("La fecha no puede ser futura")
        return v
class BookCreate(BookBase):
    pass
class BookResponse(BookBase):
    id:int
    owner_id:int
class BookListResponse(BaseModel):
    id:list[Book]
    total:int
class BookWithOwnerResponse(BaseModel):
    id: int
    titulo: str
    autor: str
    fecha_publicacion: date
    owner_id: int
    owner_nombre: str
class UserListResponse(BaseModel):
    items: list[UserResponse]
    total:int
#class BookListResponse(BaseModel):
 #   items:list[Book]
 #   total:int
class UserBookListResponse(BaseModel):
    items:list[BookResponse]
    total:int
class AdminBookListResponse(BaseModel):
    items:list[BookWithOwnerResponse]
    total:int