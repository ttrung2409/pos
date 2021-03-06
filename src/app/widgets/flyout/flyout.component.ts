import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
declare var $: any;

@Component({
  selector: 'flyout',
  templateUrl: './flyout.component.html',
  styleUrls: ['./flyout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlyoutComponent implements OnInit, AfterViewInit {
  private _resolve: any;

  constructor(private el: ElementRef) { }
  
  @Input() direction?: string = 'right';
  @Input() size?: string = 'very wide';
  @Input() class: string = '';
  @Input() closable: boolean = true;
  @Input() containerSelector: string;
  @Output() onShow = new EventEmitter();
  @Output() onHide = new EventEmitter();

  ngOnInit() {
  }

  ngAfterViewInit() {
    let _this = this;
    $(this.el.nativeElement).find('.ui.sidebar').sidebar({
      context: $(this.containerSelector),
      transition: 'overlay',
      closable: this.closable,
      exclusive: false,
      onVisible: function () {
        $('.pusher').addClass('dimmed');
        if (!!_this._resolve) _this._resolve();
        _this.onShow.emit();
      },
      onShow: function () {        
      },
      onHide: function () {
        $('.pusher').removeClass('dimmed');
        setTimeout(() => _this.onHide.emit());
      }
    });
  }

  show() {
    $('#app').find('.ui.sidebar.right').sidebar('show');
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
    });      
  }

  hide() {
    $('#app').find('.ui.sidebar.right').sidebar('hide');   
  }  
}
