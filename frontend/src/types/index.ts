export interface User {
    id: number;
    nombre:string;
    email: string
}
export interface Book{
    id:number;
    titulo:string;
    autor:string;
    owner_id:number
}
export interface LoginCredentials{
    email:string;
    password:string
}
export interface RegisterData{
    nombre:string;
    email:string;
    password:string
}
export interface AuthResponse{
    access_token:string;
    token_type:string
}