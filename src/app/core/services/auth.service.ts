// auth.service.ts
import { Injectable, inject, computed } from '@angular/core';
import { Auth, user, User } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  
  // Convertimos el observable de usuario en un Signal
  // Esto devolverá undefined al inicio, luego el objeto User, o null si no hay sesión.
  user = toSignal(user(this.auth));
  
  // Helper para obtener el UID rápidamente
  uid = computed(() => this.user()?.uid);
}
