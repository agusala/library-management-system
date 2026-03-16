from fastapi import APIRouter,HTTPException,status,Depends
from .database import db_dep
from .schemas import LoginRequest,UserCreate,Token,LoginResponse
from .crud import autenticate_user,create_user,get_user_by_email
from .jwt_handler import create_access_token
from .dependencies import get_current_user
from . import models
from sqlalchemy.exc import IntegrityError

auth_router = APIRouter(prefix="/auth",tags=["auth"])

@auth_router.get("/me", response_model=LoginResponse)
def read_users_me(current_user:models.User = Depends(get_current_user)):
    return current_user

@auth_router.post("/register", response_model=LoginResponse)
def register(user_data:UserCreate,db:db_dep):
    existing=get_user_by_email(db,user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,detail="email ya registrado"
        )
    print(f"Password recibida: {user_data.password}")
    try: user=create_user(db,user_data.nombre,user_data.email,user_data.password)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="email ya registrado")
    return{
        "id":user.id,
        "nombre":user.nombre,
        "email":user.email,
        "role":user.role
    }
    


@auth_router.post("/login", response_model=Token)
def login(data:LoginRequest,db:db_dep):
    user = autenticate_user(db,data.email,data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="datos incorrectos",
            headers={"WWW-Authenticate":"Bearer"},
        )
    access_token=create_access_token(data={"sub":str(user.id)})
    return{"access_token":access_token,"token_type":"Bearer"}


