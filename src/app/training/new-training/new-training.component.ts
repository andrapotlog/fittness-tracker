import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.module";
import {NgForm} from "@angular/forms";
import {Observable, Subscription} from "rxjs";

import 'rxjs-compat/add/operator/map'
import {UIService} from "../../shared/ui.service";
import * as fromRoot from '../../app.reducer';
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[] | null;
  isLoading$: Observable<boolean>;
  private exerciseSubscription: Subscription;

  constructor(private trainingService : TrainingService,
              private uiService: UIService,
              private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exerciseSubscription = this.trainingService.exercisesChange
      .subscribe(exercises => {
        this.exercises = exercises;
      })
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form : NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if(this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
  }
}
