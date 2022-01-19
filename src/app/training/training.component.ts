import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from "./training.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  trainingSubscription : Subscription;

  constructor(private trainingService : TrainingService) { }

  ngOnInit(): void {
    this.trainingSubscription = this.trainingService.exerciseChange.subscribe(exercise => {
      //this.ongoingTraining = (exercise == {} ? true : false)
      //this.ongoingTraining = (!!exercise)
      this.ongoingTraining = Object.keys(exercise).length !== 0;
    });
  }

  ngOnDestroy() {
    this.trainingSubscription.unsubscribe();
  }
}
