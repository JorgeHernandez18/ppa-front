import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransversalAxis } from 'src/app/interfaces/transversalAxis.interface';
import { ActivityPT, WorkPlan } from 'src/app/interfaces/workplan.interface';
import { AxisService } from 'src/app/services/axis.service';
import { WorkplanService } from 'src/app/services/workplan.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
})
export class ActivitiesComponent {
  private _form: FormGroup;
  private _activities: ActivityPT[];
  private _transversalAxis: TransversalAxis[];

  public showDialog = false;
  private workplan!: number;

  public constructor(
    private fb: FormBuilder,
    private workPlanService: WorkplanService,
    private toastr: ToastrService,
    private axisService: AxisService,
    private activatedRoute: ActivatedRoute,
  ) {
    this._form = this.fb.group({
      nombre: ['', [Validators.required]],
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]],
      docente_apoyo: [1, [Validators.required]],
      cumplimiento: ['', [Validators.required]],
      observacion: ['', Validators.required],
    });

    this._activities = [];
    this._transversalAxis = [];
  }

  public ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.workplan = Number(params.get('id')) ?? 1;
      this.workPlanService.listActivitys(this.workplan)
        .subscribe({
          next: (activities) => {
            this._activities = activities;
          },
        });
    });

    this.axisService.listTransversalAxis().subscribe({
      next: (axis) => {
        this._transversalAxis = axis;
      }
    })

  }

  get transversalAxis(): TransversalAxis[] {
    return this._transversalAxis;
  }

  get form(): FormGroup {
    return this._form;
  }

  get activities(): ActivityPT[] {
    return this._activities;
  }

  public createActivity() {
    const activity: ActivityPT = {
      nombre: this._form.controls['nombre'].value,
      fecha_inicio: this._form.controls['fecha_inicio'].value,
      fecha_fin: this._form.controls['fecha_fin'].value,
      docente_apoyo: this._form.controls['docente_apoyo'].value,
      cumplimiento: this._form.controls['cumplimiento'].value,
      observacion: this._form.controls['observacion'].value,
    };

    this.workPlanService
      .createActivity(activity, this.workplan)
      .subscribe({
        next: () => {
          this._form.reset();
          this.toastr.success('Actividad creada con exito!');
        },
      });
  }
}
