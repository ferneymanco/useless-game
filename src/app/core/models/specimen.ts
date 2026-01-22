import { SpecimenLocation } from "./specimen_location";

export interface Specimen {
    id: string;
    status: string;
    signal: string;
    location: SpecimenLocation;
}