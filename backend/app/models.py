
from sqlmodel import SQLModel,Field


class BookBase(SQLModel):
    titulo:str
    autor:str

class BookCreate(BookBase):
    pass

class Book(BookBase,table=True):
    id:int | None = Field(default=None,primary_key=True)



