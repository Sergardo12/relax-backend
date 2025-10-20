import { Injectable } from '@nestjs/common';

@Injectable()
export class ColaboradorService {
  /**
   * Valida que el DNI tenga exactamente 8 dígitos numéricos
   */
  validarDni(dni: string): boolean {
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
  }

  /**
   * Valida que el teléfono tenga exactamente 9 dígitos numéricos
   */
  validarTelefono(telefono: string): boolean {
    const telefonoRegex = /^\d{9}$/;
    return telefonoRegex.test(telefono);
  }

  /**
   * Valida que la persona sea mayor de 18 años
   */
  validarEdadMinima(fechaNacimiento: Date): boolean {
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    const dia = hoy.getDate() - fechaNacimiento.getDate();

    // Ajustar si aún no ha cumplido años este año
    if (mes < 0 || (mes === 0 && dia < 0)) {
      return edad - 1 >= 18;
    }

    return edad >= 18;
  }
}
