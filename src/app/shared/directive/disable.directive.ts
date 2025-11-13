import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDisable]'
})
export class DisableDirective implements OnInit {

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void{
    this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'true');
  }

}
