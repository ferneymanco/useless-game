import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc } from '@angular/fire/firestore';
import { PlayerService } from './player.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private firestore = inject(Firestore);
  private playerService = inject(PlayerService);

  // Inyectar misiones de prueba
  async seedSampleMissions() {
    const missionsRef = collection(this.firestore, 'missions');
    const samples = [
      {
        title: 'Deep Packet Inspection',
        description: 'Intercept the encrypted traffic from Node-Alpha.',
        requiredRole: 'hacker',
        minLevel: 1,
        xpReward: 150,
        objectiveCode: 'HACK_01',
        type: 'digital_breach'
      },
      {
        title: 'Hardware Calibration',
        description: 'Align the antenna of the physical ESP32 in sector 7.',
        requiredRole: 'engineer',
        minLevel: 1,
        xpReward: 200,
        objectiveCode: 'ENG_01',
        type: 'field_op'
      }
    ];

    for (const m of samples) {
      await addDoc(missionsRef, m);
    }
    alert('Sample missions injected!');
  }

  // Cambiar tu rol rápidamente para probar
  async debug_setMyRole(newRole: string) {
    const p = this.playerService.player();
    if (p) {
      const userRef = doc(this.firestore, `players/${p.uid}`);
      await updateDoc(userRef, { role: newRole });
      //location.reload(); // Recargamos para que los signals se actualicen
    }
  }
}
