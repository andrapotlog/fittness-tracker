import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.module";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  pastExercises : Exercise[] = [];
  dataSource = new MatTableDataSource<Exercise>();
  displayedColumns: string[] = ['date', 'name', 'duration', 'calories', 'state'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.dataSource.data = this.trainingService.getPasExercises();
  }

  doFilter(event: Event) {
    this.dataSource.filter = (<HTMLInputElement>event.target).value.trim().toLowerCase()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
