import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid/grid.component';
import { FlyoutComponent } from './flyout/flyout.component';
import { DropdownComponent } from './dropdown/dropdown.component'
import { FormsModule } from '@angular/forms';
import { BindableComponent } from './bindable.component';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { TypeaheadComponent } from './typeahead/typeahead.component';
import { ProductLookupComponent } from './product-lookup/product-lookup.component';
import { HotkeyModule } from 'angular2-hotkeys';
import { FormatNumberPipe } from '../pipes/number.pipe';
import { NumberDirective } from '../directives/number.directive';
import { MatDialogModule } from '@angular/material';

@NgModule({  
  imports: [
    CommonModule,
    FormsModule,    
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatRippleModule,
    MatCheckboxModule,
    MatChipsModule,
    HotkeyModule,
    MatDialogModule
  ],
  declarations: [
    GridComponent,
    FlyoutComponent,
    DropdownComponent,
    BindableComponent,
    TypeaheadComponent,
    ProductLookupComponent,
    NumberDirective,
    FormatNumberPipe
  ],
  exports: [
    GridComponent,
    FlyoutComponent,
    DropdownComponent,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatRippleModule,
    MatCheckboxModule,
    MatChipsModule,
    TypeaheadComponent,
    ProductLookupComponent,
    NumberDirective,
    FormatNumberPipe
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: []
})
export class WidgetModule { }
