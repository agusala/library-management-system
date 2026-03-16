from fastapi import Depends,HTTPException,status
from fastapi.security import OAuth2PasswordBearer
from .jwt_handler import verify_token
from .database import db_dep
from .models import User,UserRole




oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(db:db_dep,token:str=Depends(oauth2_scheme)):
    credential_exception=HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="token no validado",
        headers={"www-Authenticate":"Bearer"}
    )
    user_id= verify_token(token,credential_exception)
    user=db.get(User,user_id)
    if user is None:
        raise credential_exception
    return user
def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos de administrador"
        )
    return current_user