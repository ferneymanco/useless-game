// src/app/core/constants/lore.constants.ts
export const LORE_MESSAGES: Record<string, { sender: string, text: string[] }> = {
  'neural_link': {
    sender: 'THE_ARCHITECT',
    text: [
      "Interfase biológica detectada...",
      "¿Sientes ese zumbido en la base del cráneo, Operativo?",
      "No es solo hardware. Es el primer paso para ver la red como realmente es.",
      "No parpadees."
    ]
  },
  'security_bypass': {
    sender: 'SYSTEM_DAEMON',
    text: [
      "Protocolo de intrusión sintetizado.",
      "Las puertas de Aethelgard son pesadas, pero sus cerrojos son lógicos.",
      "Úsalo con discreción. El rastro digital nunca desaparece del todo."
    ]
  },
  'architect_code': {
    sender: 'ORIGIN_SOURCE',
    text: [
      "ERROR: Fragmento de Kernel detectado.",
      "Has encontrado una parte de mi arquitectura original.",
      "Ten cuidado con lo que intentas reconstruir...",
      "Hay verdades que fueron borradas por una razón."
    ]
  },
  'unstable_failure': {
    sender: 'SYSTEM_MONITOR',
    text: [
      "ADVERTENCIA: Colapso de integridad molecular.",
      "La receta era correcta, pero tu entorno de red es demasiado inestable.",
      "Has generado basura digital... o quizás algo peor.",
      "No lo toques con las manos desprotegidas."
  ]
}
};
