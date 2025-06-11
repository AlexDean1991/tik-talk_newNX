import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[test]',
  standalone: true})
export class TestDirective {
  elRef = inject(ElementRef);
}
