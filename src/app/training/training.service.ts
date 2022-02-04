import {Exercise} from "./exercise.module";
import {Subject, Subscription} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Injectable} from "@angular/core";
import {UIService} from "../shared/ui.service";

import * as UI from '../shared/ui.actions';
import * as fromRoot from '../app.reducer';
import {Store} from "@ngrx/store";

@Injectable()
export class TrainingService {
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;

  exerciseChange = new Subject<Exercise>();
  exercisesChange = new Subject<Exercise[] | null>();
  pastExercisesChanged = new Subject<Exercise[]>();

  fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService,
              private store: Store<fromRoot.State>) {
  }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
        //throw(new Error());
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
        this.availableExercises = exercises;
        this.exercisesChange.next([...this.availableExercises]);
    }, error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetiching exercises failed, please try again later!', null, 3000);
        this.exercisesChange.next(null);
      }));
  }

  startExercise(selectedId: string) {
    /*this.db.doc('availableExercises/' + selectedId)
      .update({lastSelected: new Date});*/
    // @ts-ignore
    this.runningExercise = this.availableExercises.find(ex => ex.id == selectedId);
    this.exerciseChange.next({...this.runningExercise});
    //console.log(selectedId);
  }

  completeExercise() {
    this.addDatatoDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = {} as Exercise;
    this.exerciseChange.next({} as Exercise);
  }

  cancelExercise(progress: number) {
    this.addDatatoDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = {} as Exercise;
    this.exerciseChange.next({} as Exercise);
  }

  getRunningExercise() {
    return {...this.runningExercise}
  }

  fetchPasExercises() {
    this.fbSubs.push(this.db.collection('finishedExercises')
      .valueChanges()
      // @ts-ignore
      .subscribe((exercises: Exercise[]) => {
        this.pastExercisesChanged.next(exercises);
      }));
  }

  cancelSubs() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDatatoDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
