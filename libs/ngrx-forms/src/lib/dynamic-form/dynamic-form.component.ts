import { Field } from '../+state/ngrx-forms.interfaces';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { debounceTime, map, takeUntil, tap, filter } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

UntilDestroy();
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit {
  @Input() structure$: Observable<Field[]>;
  @Input() data$: Observable<any>;
  @Input() touchedForm$: Observable<boolean>;
  @Output() updateForm: EventEmitter<any> = new EventEmitter();
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.structure$
      .pipe(
        map(this.formBuilder),
        tap((f) => (this.form = f)),
        tap((f) => this.listenFormChanges(f)),
        (f$) => combineLatest([f$, this.data$]),
        untilDestroyed(this),
      )
      .subscribe(this.patchValue);

    if (this.touchedForm$) {
      this.touchedForm$
        .pipe(
          filter((t) => !t && !!this.form),
          untilDestroyed(this),
        )
        .subscribe((_) => this.form.reset());
    }
  }

  private formBuilder = (structure: Field[]): FormGroup => {
    const group = this.fb.group({});
    structure.forEach((field) => group.addControl(field.name, this.control(field)));
    return group;
  };

  private control = (field: Field): FormControl => {
    return this.fb.control('', field.validator);
  };

  private patchValue = ([form, data]) => {
    !!data ? form.patchValue(data, { emitEvent: false }) : form.patchValue({}, { emitEvent: false });
  };

  private listenFormChanges(form: FormGroup) {
    form.valueChanges
      .pipe(debounceTime(100), untilDestroyed(this))
      .subscribe((changes: any) => this.updateForm.emit(changes));
  }
}
