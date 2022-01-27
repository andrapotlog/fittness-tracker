import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.module";
import {NgForm} from "@angular/forms";
import {Observable, Subscription} from "rxjs";

import 'rxjs-compat/add/operator/map'

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exerciseSubscription: Subscription;

  constructor(private trainingService : TrainingService) { }

  ngOnInit(): void {
    //this.exercises = this.trainingService.getExercises()
    this.exerciseSubscription = this.trainingService.exercisesChange
      .subscribe(exercises => (this.exercises = exercises))
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form : NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }

}
