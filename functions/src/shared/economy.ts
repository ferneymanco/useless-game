import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase/firestore';

export async function checkEnergy(player: any, cost: number) {

        const now = Timestamp.now();
        const elapsed = now.seconds - player?.lastEnergyUpdate.seconds;
        const regenerated = Math.floor(elapsed / player?.regenRate);
        const currentEnergy = Math.min(player?.maxEnergy, player?.energy + regenerated);

        if (currentEnergy < cost) {
            return false;
        }

        return true;
}

export async function decrementItems(transaction:any, userRef:any, itemId:any, quantity:number) {
        const ingRef = userRef.collection('inventory').doc(itemId);
        return transaction.update(ingRef, { 
            quantity: admin.firestore.FieldValue.increment(-quantity)
        });
}

export async function wasteEnergy(transaction:any, userRef:any, quantity:number) {
        return transaction.update(userRef, { 
            energy: admin.firestore.FieldValue.increment(-quantity),
            lastEnergyUpdate: admin.firestore.Timestamp.now()
        });
}