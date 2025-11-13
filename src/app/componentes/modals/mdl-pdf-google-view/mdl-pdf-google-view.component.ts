import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit, Output, ViewChild,
} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

@Component({
  selector: 'app-mdl-pdf-google-view',
  templateUrl: './mdl-pdf-google-view.component.html',
  styleUrls: ['./mdl-pdf-google-view.component.scss']
})

export class MdlPdfGoogleViewComponent implements OnInit, AfterViewInit, OnDestroy  {
  @Input() urlVisualizar: string;
  @Input() mostrarPdfViewer = false;
  @Input() set Url(value: string) {
    this._url = value;
  }
  _url!: string;
  url: string;

  @ViewChild('iframe') iframe: ElementRef | undefined;

  windowWidth: number = window.innerWidth;
  isSmallScreen: boolean = this.windowWidth <= 1193;

  @Output() eventImprimirMobile: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    public activeModal: NgbActiveModal,
    public router: Router
  ) {
    this.url = 'https://docs.google.com/gview?url=';

  }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy(): void {

  }

  get getUrl(): string{
    return this._url;
  }

  imprimir(): void{
    if(!this.mostrarPdfViewer){
      (this.iframe?.nativeElement as HTMLIFrameElement).contentWindow?.window.focus();
      (this.iframe?.nativeElement as HTMLIFrameElement).contentWindow?.window.print();
    } else{
      this.abrirPdfMobile();
    }
  }

  abrirPdfMobile(): void{
    this.eventImprimirMobile.emit(true);
  }

  ver(): void{
    window.open(this._url, "_blank");
  }

}
