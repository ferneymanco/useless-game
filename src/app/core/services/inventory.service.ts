//services/inventory.service.ts
import { inject, Injectable, computed } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { GlobalItem,UserItemRecord, InventorySlot } from '../models/inventory.model';
import { AuthService } from './auth.service';
import { Auth, user } from '@angular/fire/auth';


@Injectable({ providedIn: 'root' })
export class InventoryService {
  private firestore = inject(Firestore);
  private auth = inject(AuthService);

  // 1. SIGNAL DEL CATÁLOGO GLOBAL (Solo lectura)
  // Traemos todos los items de la colección 'items'
  private globalItems$ = collectionData(
    collection(this.firestore, 'items'), 
    { idField: 'id' }
  ) as Observable<GlobalItem[]>;
  
  globalCatalog = toSignal(this.globalItems$, { initialValue: [] });

  // 2. SIGNAL DEL INVENTARIO DEL USUARIO
  // Escuchamos la sub-colección específica del jugador
  private userItems$ = user(inject(Auth)).pipe(
    switchMap(user => {
      if (user) {
        // Solo si el usuario existe, creamos el listener de su inventario
        return collectionData(
          collection(this.firestore, `players/${user.uid}/inventory`),
          { idField: 'id' }
        );
      } else {
        // Si no hay usuario, devolvemos un array vacío
        return of([]);
      }
    })
  );

  userInventoryRecords = toSignal(this.userItems$, { initialValue: [] });

  // 3. EL "CEREBRO": SIGNAL COMPUTADO
  // Combina ambos signals automáticamente cada vez que uno cambie
  fullInventory = computed(() => {
    const catalog = this.globalCatalog();
    const records = this.userInventoryRecords();
    // Mapeamos los registros del usuario y les inyectamos la info del catálogo
    return records.map(record => {
      const itemInfo = catalog.find(item => item.id === record.id);
      return {
        ...itemInfo,      // Nombre, icono, rareza...
        id: record.id,
        quantity: record['quantity']
      } as InventorySlot;
    }).filter(slot => slot.name); // Filtramos por si el catálogo aún no carga
  });


async seedGlobalCatalog() {
  const items = [
    /* // COMMON (Gris/Básico)
    { id: 'signal_fragment', name: 'Fragmento de Señal', description: 'Datos ruidosos recuperados de la red. Útiles para reconstruir mensajes.', icon: 'settings_input_antenna', rarity: 'COMMON', category: 'INTEL', isUsable: true },
    { id: 'damaged_ram', name: 'Módulo RAM Dañado', description: 'Hardware básico que aún conserva trazas de memoria volátil.', icon: 'memory', rarity: 'COMMON', category: 'HARDWARE', isUsable: false },
    { id: 'encrypted_log', name: 'Registro Cifrado', description: 'Un archivo .log protegido. Parece contener bitácoras de un técnico.', icon: 'description', rarity: 'COMMON', category: 'INTEL', isUsable: true },

    // UNCOMMON (Verde/Utilidad)
    { id: 'security_bypass', name: 'Bypass de Seguridad', description: 'Script básico que permite saltar protocolos de nivel bajo.', icon: 'terminal', rarity: 'UNCOMMON', category: 'SOFTWARE', isUsable: true },
    { id: 'cooling_fan', name: 'Ventilador Térmico', description: 'Aumenta la estabilidad del núcleo durante la desencriptación.', icon: 'エアコン', rarity: 'UNCOMMON', category: 'HARDWARE', isUsable: true },

    // RARE (Azul/Poder)
    { id: 'neural_link', name: 'Enlace Neuronal', description: 'Interfaz bio-digital que mejora la velocidad de respuesta del operador.', icon: 'psychology', rarity: 'RARE', category: 'HARDWARE', isUsable: false },
    { id: 'black_market_intel', name: 'Intel de Mercado Negro', description: 'Información sobre rutas de datos no rastreadas.', icon: 'hub', rarity: 'RARE', category: 'INTEL', isUsable: true },
    { id: 'decoy_protocol', name: 'Protocolo Decoy', description: 'Genera una señal falsa para despistar a los firewalls enemigos.', icon: 'security', rarity: 'RARE', category: 'SOFTWARE', isUsable: true },

    // LEGENDARY (Oro/Aethelgard Amber)
    { id: 'master_keycard', name: 'Tarjeta Maestra Aethelgard', description: 'Acceso físico a los servidores centrales del bastión.', icon: 'vibration', rarity: 'LEGENDARY', category: 'HARDWARE', isUsable: false },
    { id: 'architect_code', name: 'Código del Arquitecto', description: 'Un fragmento del kernel original de la red. Poder absoluto.', icon: 'auto_awesome', rarity: 'LEGENDARY', category: 'SOFTWARE', isUsable: true } */
     { id: 'unstable_scrap', name: 'Residuo de Datos Inestable', description: 'Resultado de una síntesis fallida. Emite una radiación digital errática. Quizás alguien en el mercado negro sepa qué hacer con esto.', icon: 'running_with_errors', rarity: 'COMMON', category: 'HARDWARE', isUsable: true }
  ];

  for (const item of items) {
    await setDoc(doc(this.firestore, 'items', item.id), item);
  }
  console.log('CATÁLOGO GLOBAL POBLADO');
}
  
}

