import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { routes } from './retail.routing'
import { RouterModule } from '@angular/router';
import { WidgetModule } from '../widgets/widget.module';
import { FormsModule } from '@angular/forms';
import { RetailComponent } from './components/retail/retail.component';
import { PaymentComponent } from './components/payment/payment.component';
import { QtyEditorComponent } from './components/qty-editor/qty-editor.component';
import { NoProductFoundDialog } from './components/no-product-found-dialog/no-product-found-dialog.component';
import { AddCustomerDialog } from './components/add-customer-dialog/add-customer-dialog.component';
import { ConfirmDialogComponent } from '../widgets/confirm-dialog/confirm-dialog.component';
import { PrintComponent } from './components/print/print.component';
import { ProductLookupDialogComponent } from './components/product-lookup-dialog/product-lookup-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    WidgetModule,
    FormsModule
  ],
  declarations: [
    RetailComponent,
    PaymentComponent,
    QtyEditorComponent,
    NoProductFoundDialog,
    AddCustomerDialog,    
    PrintComponent,
    ProductLookupDialogComponent
  ],
  providers: [DecimalPipe],
  entryComponents: [
    NoProductFoundDialog,
    AddCustomerDialog,
    ConfirmDialogComponent,
    ProductLookupDialogComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class RetailModule { }
