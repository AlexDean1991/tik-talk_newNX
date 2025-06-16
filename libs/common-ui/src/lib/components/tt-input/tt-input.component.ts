import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'tt-input',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TtInputComponent),
    },
  ],
})
export class TtInputComponent implements ControlValueAccessor {
  constructor(private cdr: ChangeDetectorRef) {}
  type = input<'text' | 'password'>('text');
  placeholder = input<string>();

  onChange: any
  onTouched: any

  value: string | null = null

  writeValue(val: string | null) {
    this.value = val;
    this.cdr.detectChanges();
  }

  registerOnChange(fn: any) {
    this.onChange = fn
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean) {}

  onModelChange(val:string | null): void {
    this.onChange(val)
  }
}
