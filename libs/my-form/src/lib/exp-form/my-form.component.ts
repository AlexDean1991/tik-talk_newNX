import {Component, inject} from '@angular/core';
import {
  AbstractControl,
  FormArray, FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';

import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { MockService } from './mock.service';
import { NameValidator } from './name.validators';



enum RecieverType {
  Bugulma = 'Bugulma',
  Almet = 'Almet',
  Leninogorsk = 'Leninogorsk',
  Bavly = 'Bavly'
}

interface Address {
  city?: string
  street?: string
  building?: number
  appartment?: number
}

function getAddressFrom(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    building: new FormControl<number | null>(initialValue.building ?? null),
    appartment: new FormControl<number | null>(initialValue.appartment ?? null),
  })
}

function validateStartWith(forbiddenLetter: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return control.value?.startsWith(forbiddenLetter)
      ? {startsWith: {message: `${forbiddenLetter} - последняя буква алфавита!`}}
      : null
  }
}

function validateDateRage({fromControlName, toControlName}: {fromControlName: string, toControlName: string}) {
  return (control: AbstractControl) => {
    const fromControl = control.get(fromControlName)
    const toControl = control.get(toControlName)

    if (!fromControl || !toControl) return null

    const fromDate = new Date(fromControl.value)
    const toDate = new Date(toControl.value)

    if (fromDate && toDate && fromDate > toDate) {
      toControl.setErrors({dateRange: {message: 'Дата неправильная'}})
      return {dateRange: {message: 'Дата неправильная'}}
    }

    return null

  }
}

@Component({
  selector: 'exp-form',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './my-form.component.html',
  styleUrl: './my-form.component.scss'
})
export class MyFormComponent {

  RecieverType = RecieverType
  mockService = inject(MockService);
  nameValidator = inject(NameValidator);

  form = new FormGroup({
    type: new FormControl<RecieverType>(RecieverType.Bugulma),
    name: new FormControl<string>('', {
      validators: [Validators.required],
      asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
      updateOn: 'blur'
    }),
    lastName: new FormControl<string>(''),
    addresses: new FormArray([getAddressFrom()]),
    dateRange: new FormGroup({
      from: new FormControl<string>(''),
      to: new FormControl<string>(''),
    }, validateDateRage({fromControlName: 'from', toControlName: 'to'}))
  })

  constructor() {
    this.mockService.getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe(addrs => {

        const addressArray = this.form.controls['addresses'] as FormArray;
        addressArray.clear();

        for (const addr of addrs) {
          this.form.controls.addresses.push(getAddressFrom(addr))
        }

      })
  }


  onSubmit(event: SubmitEvent) {
    this.form.markAllAsTouched();
    console.log('this form value', this.form.valid)
    console.log('get raw value', this.form.getRawValue());
    this.form.reset()
  }
}
