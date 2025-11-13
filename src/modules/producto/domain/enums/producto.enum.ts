export enum EstadoProducto {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

export enum CategoriaProducto {
  //  Categorías de Spa/Masaje
  MASAJE = 'masaje',
  AROMATERAPIA = 'aromaterapia',
  ACEITES = 'aceites',
  
  //  Categorías de Belleza
  BELLEZA = 'belleza',
  FACIAL = 'facial',
  CORPORAL = 'corporal',
  UÑAS = 'uñas',
  
  //  Categorías de Farmacia/Salud
  FARMACIA = 'farmacia',
  MEDICAMENTOS = 'medicamentos',
  SUPLEMENTOS = 'suplementos',
  
  // Otros
  OTROS = 'otros',
}

export enum TipoAjuste {
  AJUSTE_MANUAL = 'ajuste_manual',
  MERMA = 'merma',
  CORRECCION = 'correccion',
  PRODUCTO_DAÑADO = 'producto_dañado',
}

export enum OperacionStock {
  AUMENTAR = 'aumentar',
  DISMINUIR = 'disminuir',
}