import { Artefact } from "../models/artefact";

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

export const ARTIFACT_CATALOG: Record<string, Artefact> = {
 
  "0": {
    id: '0',
    title: '01: THE OBSERVER',
    status: 'ACTIVE',
    sensors: 'RF / STATIC',
    classified: false,
    img: 'observer_image.png'
    },
    "1": {
      id: '1',
      title: '02: THE PARASITE',
      status: 'ACTIVE',
      sensors: 'RF / STATIC',
      classified: true,
      img: 'parasite_image.png'
    },
    "2": {
      id: '2',
      title: '03: THE RESONATOR',
      status: 'ACTIVE',
      sensors: 'RF / STATIC',
      classified: true,
      img: 'espectrum_image.png'
    }
  }
