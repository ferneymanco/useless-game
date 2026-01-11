// src/app/core/services/mission.service.ts
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';
import { PlayerService } from './player.service';
import { Observable, switchMap, of, map } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop'; // <--- Importante
import { Mission } from '../models/mission.model';

@Injectable({ providedIn: 'root' })
export class MissionService {
  private firestore = inject(Firestore);
  private playerService = inject(PlayerService);

  getAvailableMissions(): Observable<Mission[]> {
    return toObservable(this.playerService.player).pipe(
      switchMap(player => {
        if (!player) return of([]);

        const missionsRef = collection(this.firestore, 'missions');
        const q = query(
          missionsRef, 
          where('requiredRole', '==', player.role),
          where('minLevel', '<=', player.accessLevel || 1)
        );
        
        return (collectionData(q, { idField: 'id' }) as Observable<Mission[]>).pipe(
          map(missions => missions.map(m => ({
            ...m,
            // Comparamos el ID de la misión con el array del jugador
            isCompleted: player.completedMissions?.includes(m.id) || false
          })))
        );
      })
    );
  }
}