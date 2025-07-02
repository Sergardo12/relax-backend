import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString,  } from "class-validator";

export class CrearPagoCitaDto{
 
    @IsDateString()
    @IsOptional()
    
    fechaPago: Date;
    @IsString()
    @IsOptional()
    metodoPago: string

  
    


}