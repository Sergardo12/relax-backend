import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Result } from 'src/common/types/result';

@Injectable()
export class PagoSuscripcionService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Procesa un pago con tarjeta usando Culqi (API directa)
   */
  async procesarPagoConTarjeta(
    token: string,
    monto: number,
    email: string,
    descripcion: string,
  ): Promise<Result<any>> {
    try {
      console.log('💳 Procesando pago con Culqi...');
      console.log('Token:', token);
      console.log('Monto:', monto);
      console.log('Email:', email);

      // Convertir monto a centavos (Culqi trabaja en centavos)
      const montoEnCentavos = Math.round(monto * 100);

      const privateKey = this.configService.get<string>('CULQI_PRIVATE_KEY');

      if (!privateKey) {
        return Result.failure('CULQI_PRIVATE_KEY no está configurada');
      }

      const chargeData = {
        amount: montoEnCentavos,
        currency_code: 'PEN',
        email: email,
        source_id: token,
        description: descripcion,
      };

      console.log('📡 Enviando cargo a Culqi:', chargeData);

      // Usar API directa (como en PagoCitaService)
      const response = await fetch('https://api.culqi.com/v2/charges', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${privateKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chargeData),
      });

      const responseData = await response.json();

      console.log('📡 Respuesta de Culqi:', responseData);

      if (!response.ok) {
        const errorMessage = responseData.user_message 
          || responseData.merchant_message 
          || 'Error desconocido al procesar el pago';
        
        return Result.failure(errorMessage, responseData);
      }

      console.log('✅ Pago exitoso:', responseData);
      return Result.success(responseData);
    } catch (error) {
      console.error('❌ Error en Culqi:', error);
      return Result.failure(`Error al procesar el pago: ${error.message}`, error);
    }
  }

  /**
   * Procesa un pago con Yape usando Culqi (API directa)
   */
  async procesarPagoConYape(
    monto: number,
    email: string,
    descripcion: string,
    orderNumber: string,
  ): Promise<Result<any>> {
    try {
      console.log('📱 Procesando pago con Yape...');

      const montoEnCentavos = Math.round(monto * 100);
      const privateKey = this.configService.get<string>('CULQI_PRIVATE_KEY');

      if (!privateKey) {
        return Result.failure('CULQI_PRIVATE_KEY no está configurada');
      }

      // Fecha de expiración (1 hora)
      const expiration_date = Math.floor(Date.now() / 1000) + 3600;

      const orderData = {
        amount: montoEnCentavos,
        currency_code: 'PEN',
        email: email,
        description: descripcion,
        order_number: orderNumber,
        expiration_date: expiration_date,
        confirm: false,
      };

      console.log('📡 Enviando order a Culqi:', orderData);

      const response = await fetch('https://api.culqi.com/v2/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${privateKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();

      console.log('📡 Respuesta de Culqi:', responseData);

      if (!response.ok) {
        const errorMessage = responseData.user_message 
          || responseData.merchant_message 
          || 'Error desconocido al crear orden Yape';
        
        return Result.failure(errorMessage, responseData);
      }

      return Result.success(responseData);
    } catch (error) {
      console.error('❌ Error en Yape:', error);
      return Result.failure(`Error al crear orden Yape: ${error.message}`, error);
    }
  }

  /**
   * Valida el monto del pago
   */
  validarMonto(monto: number): Result<boolean> {
    if (monto <= 0) {
      return Result.failure('El monto debe ser mayor a 0');
    }

    if (monto > 100000) {
      return Result.failure('El monto excede el límite permitido');
    }

    return Result.success(true);
  }
}