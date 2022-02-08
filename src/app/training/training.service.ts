import {Exercise} from "./exercise.module";
import {Subscription} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Injectable} from "@angular/core";
import {UIService} from "../shared/ui.service";

import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import {Store} from "@ngrx/store";

import {take} from 'rxjs/operators';

@Injectable()
export class TrainingService {
  fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService,
              private store: Store<fromTraining.State>) {
  }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
      return docArray.map(doc => {
        const data = doc.payload.doc.data() as Exercise;
        return {
          id: doc.payload.doc.id,
          name: data.name,
          calories: data.calories,
          duration: data.duration };
      });
    })
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetAvailableTraining(exercises));
    }, error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetiching exercises failed, please try again later!', null, 3000);
      }));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1))
      .subscribe(exercise => {
        this.addDatatoDatabase({
          ...exercise,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1))
      .subscribe(exercise => {
        this.addDatatoDatabase({
          ...exercise,
          duration: exercise.duration * (progress / 100),
          calories: exercise.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  fetchPasExercises() {
    this.fbSubs.push(this.db.collection('finishedExercises')
      .valueChanges()
      // @ts-ignore
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new Training.SetFinishedTraining(exercises));
      }));
  }

  cancelSubs() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDatatoDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
