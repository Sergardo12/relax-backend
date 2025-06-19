import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from "@nestjs/common";
import { CrearColaboradorUseCase } from "../application/use-cases/crear-colaborador.use-case";
import { COLABORADOR_REPOSITORY } from "../colaborador.repository.token";
import { CrearColaboradorDto } from "./dto/crear-colaborador.dto";
import { Colaborador } from "../domain/entities/colaborador.entity";
import { ColaboradorRepository } from "../domain/repositories/colaborador.repository";


@Controller('colaborador')
export class ColaboradorController {
    constructor(
        private crearColaboradorUseCase: CrearColaboradorUseCase,
        @Inject(COLABORADOR_REPOSITORY)
        private readonly colaboradorRepo: ColaboradorRepository // usa la interfaz, no la implementación
    ){}

    @Post()
    async crearColaborador(@Body() dto: CrearColaboradorDto): Promise<Colaborador>{
        return await this.crearColaboradorUseCase.ejecutar(dto)
    }

    @Get()
    async listarColaboradores(): Promise<Colaborador[]>{
        return await this.colaboradorRepo.listarTodos();
    }

    @Get(':id')
    async buscarColaboradorPorId(@Param('id') id: number): Promise<Colaborador | null>{
        return await this.colaboradorRepo.buscarPorId(id)
    }

    @Put(':id')
    async actualizarColaborador(
        @Param('id') id: number,
        @Body() dto: CrearColaboradorDto,
    ) : Promise <Colaborador>{
        const colaborador = await this.colaboradorRepo.buscarPorId(id);
        if(!colaborador) throw new Error('Colaborador no encontrado');

        const actualizado = new Colaborador(
            id,
            colaborador.usuario, //conservamos el mismo usuario
            dto.nombres,
            dto.apellidos,
            dto.dni,
            dto.telefono,
            dto.fecha_contratacion,
            colaborador.estadoColaborador
        );
        return await this.colaboradorRepo.actualizar(actualizado)
    }

    @Delete(':id')
    async eliminarColaborador(@Param('id') id: number): Promise<void>{
        await this.colaboradorRepo.eliminar(id)
    }

}