import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { GridColumn } from '../../../widgets/grid/grid.component';
import Invoice from '../../../models/invoice';
import Customer from '../../../models/customer';
import * as moment from 'moment'
import ReportService from '../../../services/report.service';
import { fromEvent, Subscription } from 'rxjs';
import UtilsService from '../../../services/utils.service';
import { Key } from 'ts-keycode-enum';
import { FlyoutComponent } from '../../../widgets/flyout/flyout.component';
import CustomerService from '../../../services/customer.service';
import * as _ from 'lodash'
import SearchModel from 'web/src/app/models/search';
import { IncomeByInvoiceComponent } from './income-by-invoice.component';
import { IncomeByCustomerComponent } from './income-by-customer.component';
import v8n from 'v8n'

declare var $: any;

@Component({
  selector: 'income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IncomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private _subscription: Subscription = new Subscription();

  constructor(private el: ElementRef,
    private reportService: ReportService,
    private utils: UtilsService) { }

  @ViewChild('flyout') flyout: FlyoutComponent;
  @ViewChild(IncomeByInvoiceComponent) incomeByInvoice;
  @ViewChild(IncomeByCustomerComponent) incomeByCustomer;

  viewBy: string = 'invoice';
  customerId: number;
  fromDate: string = moment().format();
  toDate: string = moment().format();
  errors: Map<string, string> = new Map();
  isLoading: boolean;

  ngOnInit() {
    this._subscription.add(fromEvent(document, 'keydown').subscribe((e: KeyboardEvent) => {
      this.handleKeydown(e);
    }));
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  handleKeydown(e: KeyboardEvent) {
    switch (e.keyCode) {
      case Key.Escape:
        this.flyout.hide();
        break;
      case Key.F7:
        this.flyout.show();
        break;
    }
  }

  generateReport() {
    if (!this.validate()) return;

    this.flyout.hide();
    switch (this.viewBy) {
      case 'invoice':
        this.isLoading = true;
        this.incomeByInvoice.generateReport({
          customerId: this.customerId,
          fromDate: this.utils.toDbDate(this.fromDate),
          toDate: this.utils.toDbDate(this.toDate),
        }).then(() => this.isLoading = false);
        break;
      case 'customer':
        this.isLoading = true;
        this.incomeByCustomer.generateReport({
          customerId: this.customerId,
          fromDate: this.utils.toDbDate(this.fromDate),
          toDate: this.utils.toDbDate(this.toDate),
        }).then(() => this.isLoading = false);

        break;
    }
  }

  export() {
    let observable = null;
    switch (this.viewBy) {
      case 'invoice':
        observable = this.reportService.exportIncomeByInvoice({
          customerId: this.customerId,
          fromDate: this.utils.toDbDate(this.fromDate),
          toDate: this.utils.toDbDate(this.toDate),
          orderBy: 'invoiceNo',
          isDesc: true
        });

        break;
      case 'customer':
        observable = this.reportService.exportIncomeByCustomer({
          customerId: this.customerId,
          fromDate: this.utils.toDbDate(this.fromDate),
          toDate: this.utils.toDbDate(this.toDate),
          orderBy: 'no',
          isDesc: true
        });

        break;
    }

    observable.subscribe(buffer => {
      var blob = new Blob([buffer], { type: 'application/octet-stream' });
      var link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Báo cáo doanh thu-" + moment().format("DD/MM/YYYY") + ".xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }

  validate() {
    this.errors.clear();
    if (v8n().empty().test(this.fromDate || '')) {
      this.errors.set('fromDate', 'Vui lòng nhập ngày');
    }

    if (v8n().empty().test(this.toDate || '')) {
      this.errors.set('toDate', 'Vui lòng nhập ngày');
    }

    return this.errors.size == 0;
  }
}
