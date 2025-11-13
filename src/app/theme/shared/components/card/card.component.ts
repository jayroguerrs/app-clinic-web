import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
/*import {AnimationBuilder, AnimationService} from 'css-animator';*/
import {animate, AUTO_STYLE, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('collapsedCard', [
      state('collapsed, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('expanded',
        style({
          //overflow: 'hidden',
          height: AUTO_STYLE,
        })
      ),
      transition('collapsed <=> expanded', [
        animate('400ms ease-in-out')
      ])
    ]),
    trigger('cardRemove', [
      state('open', style({
        opacity: 1
      })),
      state('closed', style({
        opacity: 0,
        display: 'none'
      })),
      transition('open <=> closed', animate('400ms')),
    ])
  ]
})

export class CardComponent implements OnInit {
  @Input() cardTitle: string;
  @Input() cardTitle2: string;
  @Input() headerColor: string;
  @Input() headerFontColor: string;
  @Input() cardClass: string;
  @Input() blockClass: string;
  @Input() headerClass: string;
  @Input() titleClass: string;
  @Input() options: boolean;
  @Input() hidHeader: boolean;
  @Input() hidBlock: boolean;
  @Input() customHeader: boolean;

  @Input() fullscreen: boolean = false;
  @Input() collapse: boolean = false;
  @Input() reload: boolean = false;
  @Input() remove: boolean = false;
  @Input() pdf: boolean = false;
  @Input() excel: boolean = false;

  @Input() collapseInit: boolean = false
  @Input() noBorder: boolean = false;

  @Input() collapsedCardCustom: string;

  @Output() reloadCallback: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() pdfCallback: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() excelCallback: EventEmitter<boolean> = new EventEmitter<boolean>();

  public animation: string;
  public fullIcon: string;
  public isAnimating: boolean;
  /*public animator: AnimationBuilder;
  public animators: AnimationBuilder;*/

  public collapsedCard: string;
  public collapsedIcon: string;

  public loadCard: boolean;

  public cardRemove: string;

  constructor(/*animationService: AnimationService,*/ config: NgbDropdownConfig) {
    config.placement = 'bottom-right';
    this.customHeader = false;
    this.options = true;
    this.hidHeader = false;
    this.hidBlock = false;
    this.cardTitle = 'Card Title';
    this.cardTitle2 = '';
    this.headerColor = '';
    this.headerFontColor = '';

    /*this.animator = animationService.builder();
    this.animators = animationService.builder();
    this.animator.useVisibility = true;*/
    this.fullIcon = 'icon-maximize';
    this.isAnimating = false;

    this.collapsedCard = 'expanded';
    this.collapsedIcon = 'icon-minus';

    this.loadCard = false;

    this.cardRemove = 'open';
  }

  ngOnInit(): void {
    this.collapsedCard = this.collapseInit ? 'collapsed' : 'expanded';
    this.collapsedIcon = this.collapsedCard === 'collapsed' ? 'icon-plus' : 'icon-minus';
    /*if (!this.options || this.hidHeader || this.customHeader) {
      this.collapsedCard = 'false';
    }*/
    //this.collapsedCardToggle(new MouseEvent('click'));
    /*if(this.isLargeScreen()){
      if( this.collapseInit ){ this.collapsedCardToggle(new MouseEvent('click')); }
    }*/
  }

  public fullCardToggle(element: HTMLElement, animation: string, status: boolean): void {
    animation = this.cardClass === 'full-card' ? 'zoomOut' : 'zoomIn';
    this.fullIcon = this.cardClass === 'full-card' ? 'icon-maximize' : 'icon-minimize';
    // const duration = this.cardClass === 'full-card' ? 300 : 600;
    this.cardClass = this.cardClass === 'full-card' ? this.cardClass : 'full-card';
    if (status) {
      this.animation = animation;
    }
    this.isAnimating = true;

    /*this.animators
      .setType(this.animation)
      .setDuration(500)
      .setDirection('alternate')
      .setTimingFunction('cubic-bezier(0.1, -0.6, 0.2, 0)')
      .animate(element)
      .then(() => {
        this.isAnimating = false;
      })
      .catch(e => {
        this.isAnimating = false;
      });*/
    setTimeout(() => {
      this.cardClass = animation === 'zoomOut' ? '' : this.cardClass;
      if (this.cardClass === 'full-card') {
        document.querySelector('body').style.overflow = 'hidden';
      } else {
        document.querySelector('body').removeAttribute('style');
      }
    }, 500);
  }

  collapsedCardToggle(event): void {
    this.collapsedCard = this.collapsedCard === 'expanded'  ? 'collapsed' : 'expanded';
    this.collapsedIcon = this.collapsedCard === 'collapsed' ? 'icon-plus' : 'icon-minus';
  }

  cardRefresh = () =>{

    if( this.reloadCallback ){
      this.reloadCallback.emit(true);
      return;
    }

    this.loadCard = true;
    this.cardClass = 'card-load';
    setTimeout( () => {
      this.loadCard = false;
      this.cardClass = 'expanded';
    }, 3000);
  }

  cardPdfAction = () =>{

    if( this.pdfCallback ){
      this.pdfCallback.emit(true);
      return;
    }
    return;

  }

  cardExcelAction = () =>{

    if( this.excelCallback ){
      this.excelCallback.emit(true);
      return;
    }
    return;

  }

  cardRemoveAction(): void {
    this.cardRemove = this.cardRemove === 'closed' ? 'open' : 'closed';
  }

  // Events
  isLargeScreen(): boolean{
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width > 720;
  }

}
