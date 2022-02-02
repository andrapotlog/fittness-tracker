import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.module";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy{
  pastExercises : Exercise[] = [];
  dataSource = new MatTableDataSource<Exercise>();
  pastExercisesSubs: Subscription;
  displayedColumns: string[] = ['date', 'name', 'duration', 'calories', 'state'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.pastExercisesSubs = this.trainingService.pastExercisesChanged.subscribe((exercises: Exercise[]) =>{
      this.dataSource.data = exercises;
    })
    this.trainingService.fetchPasExercises();
  }

  doFilter(event: Event) {
    this.dataSource.filter = (<HTMLInputElement>event.target).value.trim().toLowerCase()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    if(this.pastExercisesSubs) {
      this.pastExercisesSubs.unsubscribe();
    }
  }
}
