import {Exercise} from "./exercise.module";
import {Subject} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Injectable} from "@angular/core";

@Injectable()
export class TrainingService {
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;

  exerciseChange = new Subject<Exercise>();
  exercisesChange = new Subject<Exercise[]>();
  pastExercisesChanged = new Subject<Exercise[]>();

  constructor(private db: AngularFirestore) {
  }

  fetchAvailableExercises() {
    this.db.collection('availableExercises').snapshotChanges().map(docArray => {
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
        this.availableExercises = exercises;
        this.exercisesChange.next([...this.availableExercises]);
    });
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
    this.db.collection('finishedExercises')
      .valueChanges()
      // @ts-ignore
      .subscribe((exercises: Exercise[]) => {
        this.pastExercisesChanged.next(exercises);
      });
  }

  addDatatoDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
