import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PlayerService } from '../services/player.service';

export const levelGuard = (minLevel: number): CanActivateFn => {
  return () => {
    const playerService = inject(PlayerService);
    const router = inject(Router);
    const level = playerService.player()?.accessLevel ?? 1;

    if (level >= minLevel) {
      return true;
    }

    router.navigate(['/dashboard']);
    return false;
  };
};