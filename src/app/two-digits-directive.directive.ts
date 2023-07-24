import { Directive, ElementRef, HostListener, Input } from '@angular/core';


@Directive({
  selector: '[appTwoDigits]'
})
export class TwoDigitsDirectiveDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('blur', ['$event.target.textContent'])
  onBlur(value: string) {
    const regex = /^\d+(\.\d{0,2})?$/;

    if (!regex.test(value)) {
      this.el.nativeElement.textContent = value.slice(0, -1);
    }
  }
}