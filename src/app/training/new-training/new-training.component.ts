import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.module";
import {NgForm} from "@angular/forms";
import {Observable, Subscription} from "rxjs";

import 'rxjs-compat/add/operator/map'
import {UIService} from "../../shared/ui.service";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[] | null;
  private exerciseSubscription: Subscription;
  private exerciseLoadedSubs: Subscription;

  exercisesLoaded = false;

  constructor(private trainingService : TrainingService,
              private uiService: UIService) { }

  ngOnInit(): void {
    //this.exercises = this.trainingService.getExercises()
    this.exerciseLoadedSubs = this.uiService.loadingStateChanged.subscribe(isLoaded => {
      this.exercisesLoaded = isLoaded;
    })
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
    if(this.exercisesLoaded) {
      this.exerciseLoadedSubs.unsubscribe();
    }
  }

}
