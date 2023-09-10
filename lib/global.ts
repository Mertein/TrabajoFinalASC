let ultimaActualizacion: Date = new Date();

export function actualizarUltimaActualizacion() {
  ultimaActualizacion = new Date();
}

export function obtenerUltimaActualizacion() {
  return ultimaActualizacion;
}