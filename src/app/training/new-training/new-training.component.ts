import { Component, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.module";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {
  exercises: Exercise[] = [];
  selectedExerciseId: string;

  constructor(private trainingService : TrainingService) { }

  ngOnInit(): void {
    this.exercises = this.trainingService.getExercises()
  }

  onStartTraining(form : NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}
