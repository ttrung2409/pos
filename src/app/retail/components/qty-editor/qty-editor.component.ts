import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { Key } from 'ts-keycode-enum';
import InvoiceItem from '../../../models/invoiceItem';
import { MatChipSelectionChange } from '@angular/material';
import v8n from 'v8n'

declare var $: any;

@Component({
  selector: 'qty-editor',
  templateUrl: './qty-editor.component.html',
  styleUrls: ['./qty-editor.component.scss']
})
export class QtyEditorComponent implements OnInit, AfterViewInit {
  constructor() { }

  @Input() item: InvoiceItem;
  @Output() commit = new EventEmitter();
  @Output() cancel = new EventEmitter();

  @ViewChild('qtyInput') qtyInput: ElementRef;

  errors: Map<string, string> = new Map();

  @HostListener('keydown', ['$event']) onKeydown(e: KeyboardEvent) {
    switch (e.keyCode) {
      case Key.Escape:
        this.doCancel();
        break;
      case Key.F9:
        this.save();
        break;
      case Key.Enter:
        this.save();
        break;
    }

    if (e.shiftKey) {
      switch (e.keyCode) {
        case Key.L:
          this.onPriceTagClick('retail');
          e.preventDefault();
          break;
        case Key.S:
          this.onPriceTagClick('wholesale');
          e.preventDefault();
          break;
        case Key.K:
          this.onPriceTagClick('discount');
          e.preventDefault();
          break;
      }
    }    
  };

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => this.focus());
  }

  doCancel() {
    this.cancel.emit();
  }

  save() {
    if (this.validate()) {
      this.commit.emit(this.item);
    }
  }

  focus() {
    $(this.qtyInput.nativeElement).focus();
  }

  onPriceTagClick(type) {
    switch (type) {
      case 'retail':
        this.item.price = this.item.product.retailPrice;
        break;
      case 'wholesale':
        this.item.price = this.item.product.wholesalePrice;
        break;
      case 'discount':
        this.item.price = this.item.product.discountPrice;
        break;
    }
  }

  validate() {
    this.errors.clear();
    if (v8n().empty().test(this.item.qty || '')) {
      this.errors.set('qty', 'Vui lòng nhập số lượng');
    }

    if (v8n().empty().test(this.item.price || '')) {
      this.errors.set('price', 'Vui lòng nhập giá');
    }

    return this.errors.size == 0;
  }
}
