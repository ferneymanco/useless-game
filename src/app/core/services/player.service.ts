import { Injectable, inject, signal } from '@angular/core';
import { Firestore, doc, setDoc, docData, updateDoc } from '@angular/fire/firestore';
import { Auth, user, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';
import { PlayerProfile, PlayerRole } from '../models/player.model';
import { Observable, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  
  // Signal for the profile (UI Reactivity)
  player = signal<PlayerProfile | null>(null);
  
  // Observable of the authenticated user
  user$ = user(this.auth);

  constructor() {
    // Listen for authentication changes and load profile from Firestore
    this.user$.pipe(
      switchMap(u => {
        if (u) {
          const userDoc = doc(this.firestore, `players/${u.uid}`);
          return docData(userDoc) as Observable<PlayerProfile>;
        }
        return of(null);
      })
    ).subscribe(profile => {
      this.player.set(profile);
    });
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(this.auth, provider);
  }

  async createProfileAfterTest(role: PlayerRole) {
    const u = this.auth.currentUser;
    if (!u) return;

    const newProfile: PlayerProfile = {
      uid: u.uid,
      labelId: `#${Math.floor(1000 + Math.random() * 9000)}-X`,
      role: role,
      accessLevel: 1,
      experience: 10,
      isDonor: false,
      isElite: false,
      foundNodes: [],
      unlockedFeatures: [],
      donorLevel: 'none',
      // --- ESTA ES LA LÍNEA QUE FALTA ---
      completedMissions: [] 
    };

    const userDoc = doc(this.firestore, `players/${u.uid}`);
    await setDoc(userDoc, newProfile);
  }

  async upgradeToDonor(orderId: string) {
  const p = this.player();
  if (p) {
    const userDoc = doc(this.firestore, `players/${p.uid}`);
    await updateDoc(userDoc, {
      isDonor: true,
      accessLevel: 2,
      paymentId: orderId,
      donorLevel: 'recruit'
    });
  }
}

  logout() {
    signOut(this.auth);
  }
}
