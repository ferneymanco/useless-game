import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  private functions = inject(Functions);

  async syncNode(nodeId: string, discoveryCode: string) {
    const syncFunc = httpsCallable(this.functions, 'syncFieldNode');
    try {
      const result = await syncFunc({ nodeId, discoveryCode });
      console.log('Sync Result:', result.data);
      return result.data;
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }
}
