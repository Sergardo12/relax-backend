import { IsDateString, IsInt, IsNotEmpty, IsString,  } from "class-validator";

export class CrearPagoCitaDto{
    @IsInt()
    @IsNotEmpty()
    monto: number
    
    @IsInt()
    @IsNotEmpty()
    cita: number;

    @IsDateString()
    @IsNotEmpty()
    fechaPago: Date;

    @IsString()
    @IsNotEmpty()
    metodoPago: string
    


}