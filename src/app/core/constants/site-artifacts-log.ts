// src/app/core/constants/lore.constants.ts
export const ARTIFACT_LOG: Record<string, {text: string[] }> = {
  '0': {
    text: [
      "Unit #01 detected audio peak in sector 4..",
      "Ambient light in laboratory descended to 13 lux..",
      "Unit #02 detected audio peak in sector 10..",
      "Radio frequency detected in sector 10..",
      "Unit #03 detected audio peak in sector 5..",
      "Ambient light in laboratory descended to 3 lux..",
      "Unit #07 detected audio peak in sector 4..",
      "Ambient light in laboratory descended to 9 lux.."
    ]
  }
};

export const ARTIFACT_CATALOG: Record<string, {title: string, visuals: string, status: string, sensors: string, classified: boolean}> = {
  "0": {
      title: '01: THE OBSERVER',
      visuals: '🪳',
      status: 'ACTIVE',
      sensors: 'RF / STATIC',
      classified: false
    },
    "1": {
      title: '02: THE PARASITE',
      visuals: '🪳',
      status: 'ACTIVE',
      sensors: 'RF / STATIC',
      classified: false
    },
    "2": {
      title: '03: THE RESONATOR',
      visuals: '🪳',
      status: 'ACTIVE',
      sensors: 'RF / STATIC',
      classified: true
    }
  }
