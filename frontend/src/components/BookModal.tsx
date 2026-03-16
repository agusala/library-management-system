import React, { useEffect } from "react";
import { Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button } from "@mui/material";
import {useForm, Controller} from "react-hook-form"

interface BookModalProps{
    open:boolean
    onClose:()=>void
    onSave:(data:{titulo:string,autor:string,fecha_publicacion:string})=>void
    book?:{titulo:string,autor:string,fecha_publicacion:string}|null
}
interface FormData{
    titulo:string
    autor:string
    fecha_publicacion:string
}

export const BookModal : React.FC<BookModalProps> =({open, onClose,onSave,book})=>{
    const {control,handleSubmit,reset}=useForm<FormData>({
        defaultValues:{
            titulo:"",
            autor:"",
            fecha_publicacion:"",
        }
    })
    useEffect(()=>{
        if(book){
            reset({titulo:book.titulo,autor:book.autor,fecha_publicacion:book.fecha_publicacion})
        }else{
            reset({titulo:"",autor:"",fecha_publicacion:""})
        }
    },[book,reset])
    const onSubmit =(data:FormData )=>{onSave(data)}

    return(
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{book? "editar libro":"agregar libro"}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
            <Controller name="titulo" control={control} rules={{required:"el titulo es requerido"}} render={({field,fieldState})=>(
                <TextField {...field} autoFocus margin="dense" label="titulo" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message}/>
            )}/>
            <Controller name="autor" control={control} rules={{required:"el autor es requerido"}} render={({field,fieldState})=>(
                <TextField {...field} autoFocus margin="dense" label="autor" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message}/>
            )}/>
            <Controller name="fecha_publicacion" control={control}rules={{required:"la fecha es obligatoria"}}render={({field,fieldState})=>(
                <TextField {...field} margin="dense" label="Fecha de publicacion" type="date" fullWidth InputLabelProps={{shrink:true}} error={!!fieldState.error} helperText={fieldState.error?.message} />
            )}/>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained">{book? "Guardar": "Agregar"}</Button>
        </DialogActions>
        </form>
    </Dialog>
)
}
