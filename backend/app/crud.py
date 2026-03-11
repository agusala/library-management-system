from sqlmodel import Session,select
from .models import User
from .security import hash_password,verify_password


def create_user(db:Session, nombre:str,email:str,password:str):
    hashed=hash_password(password)
    user = User(
        nombre=nombre,
        email=email,
        password_hash=hashed
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return(user)
def get_user_by_email(db:Session,email:str):
    statement=select(User).where(User.email==email)
    return db.exec(statement).first()
def autenticate_user(db:Session,email:str,password:str):
    user=get_user_by_email(db,email)
    if not user:
        return None
    if not verify_password(password,user.password_hash):
        return None
    return user