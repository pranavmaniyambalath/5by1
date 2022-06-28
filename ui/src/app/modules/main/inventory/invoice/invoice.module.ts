import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListInvoiceComponent } from './list-invoice/list-invoice.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { DeleteInvoiceComponent } from './delete-invoice/delete-invoice.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ToolBarModule } from '../../tool-bar/tool-bar.module';
import { DataTableModule } from '../../data-table/data-table.module';
import { FilterInvoiceComponent } from './filter-invoice/filter-invoice.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import { DatePickerAdapter, PICK_FORMATS } from '@fboutil/date-picker-adapter';
@NgModule({
  declarations: [ ListInvoiceComponent, CreateInvoiceComponent, DeleteInvoiceComponent, FilterInvoiceComponent ],
  imports: [
    CommonModule, InvoiceRoutingModule, ToolBarModule, DataTableModule,
    MatButtonModule, NgxSkeletonLoaderModule, MatSortModule, MatTableModule, MatSelectModule,
    ReactiveFormsModule, FormsModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    MatAutocompleteModule, MatIconModule, MatSlideToggleModule, MatCardModule
  ],
  providers: [
    {provide: DateAdapter,
      useClass: DatePickerAdapter},
    {provide: MAT_DATE_FORMATS,
      useValue: PICK_FORMATS}
  ]
})
export class InvoiceModule { }
