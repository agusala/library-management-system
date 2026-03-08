from pydantic import BaseModel,EmailStr

class LoginRequest(BaseModel):
    email:EmailStr
    password:str
class LoginResponse(BaseModel):
    id: int
    nombre: str
    email:EmailStr 
class UserCreate(BaseModel):
    nombre:str
    email:EmailStr
    password:str
class Token(BaseModel):
    access_token:str
    token_type:str
class BookBase(BaseModel):
    titulo:str
    autor:str
class BookCreate(BookBase):
    pass
class BookResponse(BookBase):
    id:int
    owner_id:int