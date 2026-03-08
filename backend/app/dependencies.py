from fastapi import Depends,HTTPException,status
from fastapi.security import OAuth2PasswordBearer
from .jwt_handler import verify_token
from .database import db_dep
from . import models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(db:db_dep,token:str=Depends(oauth2_scheme)):
    credential_exception=HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="token no validado",
        headers={"www-Authenticate":"Bearer"}
    )
    user_id= verify_token(token,credential_exception)
    user=db.get(models.User,user_id)
    if user is None:
        raise credential_exception
    return user