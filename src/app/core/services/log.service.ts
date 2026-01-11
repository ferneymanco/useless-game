import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, orderBy, limit, collectionData } from '@angular/fire/firestore';
import { PlayerService } from './player.service';
import { Observable, switchMap, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LogService {
  private firestore = inject(Firestore);
  private playerService = inject(PlayerService);

  getRecentLogs(): Observable<any[]> {
    return this.playerService.user$.pipe(
      switchMap(user => {
        if (!user) return of([]);
        
        const logsRef = collection(this.firestore, `players/${user.uid}/logs`);
        const q = query(logsRef, orderBy('timestamp', 'desc'), limit(8));
        
        return collectionData(q);
      })
    );
  }
}
