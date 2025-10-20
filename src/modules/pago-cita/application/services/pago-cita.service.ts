import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DETALLE_CITA_REPOSITORY_TOKEN } from '../../../detalle-cita/infrastructure/detalle-cita.repository.token';
import { DetalleCitaRepository } from '../../../detalle-cita/domain/repositories/detalle-cita.repository';
import { CulqiChargeResponse } from '../../infrastructure/types/culqi-response.type';

@Injectable()
export class PagoCitaService {
  private culqi: any;

  constructor(
    @Inject(DETALLE_CITA_REPOSITORY_TOKEN)
    private readonly detalleCitaRepository: DetalleCitaRepository,
    private readonly configService: ConfigService,
  ) {
    // Inicializar el SDK de Culqi
    const Culqi = require('culqi-node');
    // 🔍 LOGS DE DEBUG
    console.log('🔍 ConfigService disponible:', !!this.configService);
    const privateKey = this.configService.get<string>('CULQI_PRIVATE_KEY');
     console.log('🔍 Private key leída:', privateKey ? `${privateKey.substring(0, 15)}...` : 'undefined');

    if(!privateKey){ throw new Error('CULQI_PRIVATE_KEY no está configurada en el archivo .env')}
    this.culqi = new Culqi({ privateKey});
       console.log('✅ Culqi SDK inicializado');
       console.log('✅ Culqi.charges disponible:', !!this.culqi.charges);
  }

  async calcularMontoTotal(idCita: string): Promise<number> {
    const result = await this.detalleCitaRepository.findByCitaId(idCita);

    if (!result.ok) {
      throw new Error(result.message);
    }

    const detalles = result.value;
    const total = detalles.reduce((sum, detalle) => sum + detalle.getSubtotal(), 0);
    return total;
  }

  async crearCargoTarjeta(
    token: string,
    monto: number,
    email: string,
    idCita: string,
  ): Promise<CulqiChargeResponse> {
    try {
      const montoEnCentavos = Math.round(monto * 100);

      const privateKey = this.configService.get<string>('CULQI_PRIVATE_KEY');

      const chargeData = {
        amount: montoEnCentavos,
        currency_code: 'PEN',
        email: email,
        source_id: token,
        description: `Pago cita ${idCita}`,
      };

      console.log('📡 Enviando cargo a Culqi:', chargeData);

      // const response = await this.culqi.charges.create(chargeData);
       // Llamar a la API de Culqi directamente
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
      throw new Error(`Culqi error: ${responseData.user_message || responseData.merchant_message || 'Error desconocido'}`);
    }

    return responseData as CulqiChargeResponse;
      // return response as CulqiChargeResponse;
    } catch (error) {
      console.error('💥 Error en crearCargoTarjeta:', error);
      throw new Error(`Error al crear cargo en Culqi: ${error.message}`);
    }
  }

  async crearOrderYape(
    monto: number,
    email: string,
    idCita: string,
  ): Promise<CulqiChargeResponse> {
    try {
      const montoEnCentavos = Math.round(monto * 100);
      const privateKey = this.configService.get<string>('CULQI_PRIVATE_KEY');

      // Calcular fecha de expiración (1 hora desde ahora)
      const expiration_date = Math.floor(Date.now() / 1000) + 3600;

      const orderData = {
        amount: montoEnCentavos,
        currency_code: 'PEN',
        email: email,
        description: `Pago cita ${idCita}`,
        order_number: idCita,
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
      throw new Error(`Culqi error: ${responseData.user_message || responseData.merchant_message || 'Error desconocido'}`);
    }

      // return response as CulqiChargeResponse;

      return responseData as CulqiChargeResponse;
    } catch (error) {
      console.error('💥 Error en crearOrderYape:', error);
      throw new Error(`Error al crear orden Yape en Culqi: ${error.message}`);
    }
  }
}
