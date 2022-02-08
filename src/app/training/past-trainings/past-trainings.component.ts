import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.module";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {Store} from "@ngrx/store";
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit{
  pastExercises : Exercise[] = [];
  dataSource = new MatTableDataSource<Exercise>();
  displayedColumns: string[] = ['date', 'name', 'duration', 'calories', 'state'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private trainingService: TrainingService,
              private store: Store<fromTraining.State>) {}

  ngOnInit(): void {
    this.store.select(fromTraining.getFinishedExercises)
      .subscribe((exercises: Exercise[]) =>{
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
}
