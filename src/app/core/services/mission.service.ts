import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';
import { PlayerService } from './player.service';
import { Observable, of } from 'rxjs';

export interface Mission {
  id?: string;
  title: string;
  description: string;
  requiredRole: string;
  xpReward: number;
  type: string;
}

@Injectable({ providedIn: 'root' })
export class MissionService {
  private firestore = inject(Firestore);
  private playerService = inject(PlayerService);

  getAvailableMissions(): Observable<Mission[]> {
    const player = this.playerService.player(); // Usando el signal del perfil
    if (!player) return of([]);

    const missionsRef = collection(this.firestore, 'missions');
    // Filtramos misiones por el rol del jugador
    const q = query(
      missionsRef, 
      where('requiredRole', '==', player.role),
      where('minLevel', '<=', player.accessLevel)
    );
    
    return collectionData(q, { idField: 'id' }) as Observable<Mission[]>;
  }
}
