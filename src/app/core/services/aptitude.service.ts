import { Injectable, inject } from '@angular/core';
// CORRECT: All imports must come from @angular/fire/firestore
import { 
  Firestore, 
  collection, 
  collectionData, 
  query, 
  orderBy 
} from '@angular/fire/firestore'; 
import { Observable } from 'rxjs';
import { AptitudeQuestion } from '../models/aptitude.model';

@Injectable({
  providedIn: 'root'
})
export class AptitudeService {
  private firestore = inject(Firestore);

  getQuestions(): Observable<AptitudeQuestion[]> {
    const questionsRef = collection(this.firestore, 'aptitude_test_questions');
    const q = query(questionsRef, orderBy('order', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<AptitudeQuestion[]>;
  }
}
