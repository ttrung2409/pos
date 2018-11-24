import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routing';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { WidgetModule } from './widgets/widget.module'
import ProductService from './services/product.service';
import { HotkeyModule } from 'angular2-hotkeys';
import RetailService from './services/retail.service';
import CustomerService from './services/customer.service';
import UtilsService from './services/utils.service';
import ReportService from './services/report.service';

@NgModule({
  declarations: [
    AppComponent    
  ],
  imports: [
    RouterModule.forRoot(appRoutes, {      
      preloadingStrategy: PreloadAllModules
    }),
    BrowserModule,
    BrowserAnimationsModule,
    WidgetModule,
    HotkeyModule.forRoot()
  ],
  providers: [ProductService, RetailService, CustomerService, UtilsService, ReportService],
  bootstrap: [AppComponent]
})
export class AppModule { }
