import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import {
  ActivityAP,
  ActivityAPCreation,
  AulaProject,
} from 'src/app/interfaces/aulaProject.interface';
import { Student } from 'src/app/interfaces/student.interface';
import { TransversalAxisType } from 'src/app/interfaces/transversalAxis.interface';
import { AulaProjectsService } from 'src/app/services/aula-projects.service';
import { AxisService } from 'src/app/services/axis.service';
import { StudentsService } from 'src/app/services/students.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
})
export class AulaProjectActivitiesComponent {
  public showDialog: boolean = false;

  private _form: FormGroup;
  private _axisTypes: TransversalAxisType[];
  private _activities: ActivityAP[];
  private _students: Student[];

  public selectedStudents: Student[];
  public aulaProject: number = 1;

  public constructor(
    private fb: FormBuilder,
    private aulaProjectService: AulaProjectsService,
    private axisService: AxisService,
    private studentsService: StudentsService,
    private activatedRoute: ActivatedRoute,
  ) {
    this._form = this.fb.group({
      nombre: ['', [Validators.required]],
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]],
      docente_apoyo: [1, [Validators.required]],
      cumplimiento: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
    });

    this._axisTypes = [];
    this._activities = [];
    this.selectedStudents = [];
    this._students = [];
  }

  public ngOnInit() {

    this.axisService.listTransversalAxisTypes().subscribe({
      next: (axisTypes) => (this._axisTypes = axisTypes),
    });
    
    this.activatedRoute.paramMap.subscribe((params) => {
      this.aulaProject = Number(params.get('id')) ?? 1;
      this.aulaProjectService.listActivities(this.aulaProject)
        .subscribe({
          next: (activities) => {
            this._activities = activities;
          },
        });
    });
  }

  filterStudents(event: AutoCompleteCompleteEvent) {
    const query = Number(event.query);
    this.studentsService.list(query)
      .subscribe({
        next: (students) => {
          this._students = students;
        },
    });
  }

  get form(): FormGroup {
    return this._form;
  }

  get axisTypes(): TransversalAxisType[] {
    return this._axisTypes;
  }

  get activities(): ActivityAP[] {
    return this._activities;
  }

  get students(): Student[] {
    return this._students;
  }

  public createActivity() {
    if (!this.form.valid) return;

    const activity: ActivityAP = {
      nombre: this._form.controls['nombre'].value,
      fecha_inicio: this._form.controls['fecha_inicio'].value,
      fecha_fin: this._form.controls['fecha_fin'].value,
      cumplimiento: this._form.controls['cumplimiento'].value,
      observacion: this._form.controls['observacion'].value,
    };

    const body: ActivityAPCreation = {
      actividadPA: activity,
      estudiantes: this.selectedStudents.map((student) => student.codigo),
    };

    this.aulaProjectService.createActivity(body, this.aulaProject).subscribe({
      next: () => {
        this._form.reset();
      },
    });
  }

}
