import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { CrearUsuarioPacienteUseCase } from "../../usuario/application/uses-cases/crearUsuarioPaciente.use-case";
import { CrearUsuarioPacienteDTO } from "../../usuario/infrastructure/dto/crearUsuarioPaciente.dto";
import { LoginDto } from "../domain/dto/login.dto";
import { LoginUseCase } from "../application/uses-cases/login.use-case";
import { CrearUsuarioColaboradorDto } from "../../usuario/infrastructure/dto/crearUsuarioColaborador.dto";
import { CrearUsuarioColaboradorUseCase } from "../../usuario/application/uses-cases/crear-usuario-colaborador";
import { AuthGuard } from "@nestjs/passport";
import { UsuarioActual } from "./decorators/usuario-actual.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly crearUsuarioPacienteUseCase: CrearUsuarioPacienteUseCase,
    private readonly crearUsuarioColaboradorUseCase: CrearUsuarioColaboradorUseCase,
    private readonly loginUseCase: LoginUseCase,

  ) {}

  @Post("register")
  async register(@Body() dto: CrearUsuarioPacienteDTO) {
    await this.crearUsuarioPacienteUseCase.ejecutar(dto);

    // opcional: auto-login -> generar token aquí y devolverlo
    return {
      mensaje: "Usuario paciente registrado correctamente",
    };
  }
  @Post("register/colaborador")
  async registerColaborador(@Body() dto: CrearUsuarioColaboradorDto){
    await this.crearUsuarioColaboradorUseCase.ejecutar(dto)

    return {
      mensaje: "Usuario colaborador registrado correctamente"
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() dto: LoginDto) {
    return await this.loginUseCase.ejecutar(dto)
  }


  


}
