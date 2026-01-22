import { Specimen } from "../models/specimen";

export const SPECIMENS: Record<string, Specimen> = {
    '0':{
        id: '0',
        location: {
            id: '0',
            name: 'Medellín, Colombia',
            latitude: 6.247,
            longitude: -75.567,
            radius: 10
        },
        status: 'ACTIVE',
        signal: '98%'
       },
    '1':{
        id: '1',
        location:{
            id: '1',
            name: 'Bogotá, Colombia',
            latitude: 4.711,
            longitude: -74.072,
            radius: 10
        },
        status: 'ACTIVE',
        signal: '98%'
    },
    '2':{
        id: '2',
        location:{
            id: '2',
            name: 'Cali, Colombia',
            latitude: 3.437,
            longitude: -76.522,
            radius: 10
        },
        status: 'ACTIVE',
        signal: '98%'
    }
}