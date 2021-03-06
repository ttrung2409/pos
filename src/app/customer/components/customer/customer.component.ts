import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, HostListener, Output, AfterViewInit } from '@angular/core';
import Customer, { CustomerType } from '../../../models/customer';
import CustomerService from '../../../services/customer.service';
import { Key } from 'ts-keycode-enum';
import v8n from 'v8n'
import { NotifierService } from 'angular-notifier';

declare var $: any;

@Component({
  selector: 'customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, AfterViewInit {
  constructor(private customerService: CustomerService, private notifier: NotifierService) { }

  @Input() id: number;
  @Output() cancel = new EventEmitter();
  @Output() commit = new EventEmitter();

  @ViewChild('customerNameInput') customerNameInput: ElementRef;

  @HostListener('keydown', ['$event']) onKeydown(e: KeyboardEvent) {
    switch (e.keyCode) {
      case Key.Escape:
        this.doCancel();
        break;
      case Key.F9:
        this.save();
        break;
    }
  }

  customer: Customer = new Customer();
  customerTypes: CustomerType[];
  errors: Map<string, string> = new Map();

  ngOnInit() {
    if (this.id > 0) {
      this.customerService.get(this.id).subscribe(customer => {
        this.customer = customer;
      });
    }
    else {
      this.customer = new Customer({
        typeId: 1
      });
    }
    
    this.customerService.allTypes().subscribe(types => this.customerTypes = types);
  }

  ngAfterViewInit() {
    setTimeout(() => this.focus());
  }

  focus() {
    $(this.customerNameInput.nativeElement).focus();
  }

  doCancel() {
    this.cancel.emit();
  }

  save() {
    if (this.validate()) {
      this.customerService.save(this.customer).subscribe(customer => {
        this.notifier.notify('success', 'Lưu thành công');
        this.commit.emit();
      });
    }    
  }

  validate(): boolean {
    this.errors.clear();
    if (v8n().empty().test(this.customer.name || '')) {
      this.errors.set('name', 'Vui lòng nhập tên khách hàng');
    }

    return this.errors.size == 0;
  }
}
