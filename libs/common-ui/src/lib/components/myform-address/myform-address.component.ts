import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tt-myform-address',
  imports: [CommonModule],
  templateUrl: './myform-address.component.html',
  styleUrl: './myform-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyformAddressComponent {}
