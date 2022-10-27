import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent} from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((mod) => mod.DashboardModule)
      },
      {
        path: 'unit',
        loadChildren: () => import('./inventory/unit/unit.module').then((mod) => mod.UnitModule)
      },
      {
        path: 'product',
        loadChildren: () => import('./inventory/product/product.module').then((mod) => mod.ProductModule)
      },
      {
        path: 'tax',
        loadChildren: () => import('./inventory/tax/tax.module').then((mod) => mod.TaxModule)
      },
      {
        path: 'category',
        loadChildren: () => import('./inventory/category/category.module').then((mod) => mod.CategoryModule)
      },
      {
        path: 'invoice',
        loadChildren: () => import('./inventory/invoice/invoice.module').then((mod) => mod.InvoiceModule)
      },
      {
        path: 'revenue',
        loadChildren: () => import('./inventory/revenue/revenue.module').then((mod) => mod.RevenueModule)
      },
      {
        path: 'customer',
        loadChildren: () => import('./inventory/customer/customer.module').then((mod) => mod.CustomerModule)
      },
      {
        path: 'bill',
        loadChildren: () => import('./inventory/bill/bill.module').then((mod) => mod.BillModule)
      },
      {
        path: 'payment',
        loadChildren: () => import('./inventory/payment/payment.module').then((mod) => mod.PaymentModule)
      },
      {
        path: 'vendor',
        loadChildren: () => import('./inventory/vendor/vendor.module').then((mod) => mod.VendorModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },

      {
        path: 'bank',
        loadChildren: () => import('./inventory/bank/bank.module').then((mod) => mod.BankModule)
      },

      {
        path: 'transfer',
        loadChildren: () => import('./inventory/transfer/transfer.module').then((mod) => mod.TransferModule)
      },
      {
        path: 'transaction',
        loadChildren: () => import('./inventory/transaction/transaction.module').then((mod) => mod.TransactionModule)
      },
      {
        path: 'branch',
        loadChildren: () => import('./auth/branch/branch.module').then((mod) => mod.BranchModule)
      },

      {
        path: 'company',
        loadChildren: () => import('./auth/company/company.module').then((mod) => mod.CompanyModule)
      },
      {
        path: 'fin-year',
        loadChildren: () => import('./auth/fin-year/fin-year.module').then((mod) => mod.FinYearModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./auth/user/user.module').then((mod) => mod.UserModule)
      },
      {
        path: 'ledgerGroup',
        loadChildren: () => import('./accounting/ledgergroup/ledgergroup.module').then((mod) => mod.LedgergroupModule)
      },
      {
        path: 'ledger',
        loadChildren: () => import('./accounting/ledger/ledger.module').then((mod) => mod.LedgerModule)
      },
      {
        path: 'voucher',
        loadChildren: () => import('./accounting/voucher/voucher.module').then((mod) => mod.VoucherModule)
      },
      {
        path: 'my-account',
        loadChildren: () => import('./auth/my-account/my-account.module').then((mod) => mod.MyAccountModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./accounting/reports/reports.module').then((mod) => mod.ReportsModule)
      },
      {
        path: 'logs',
        loadChildren: () => import('./common/logs/logs.module').then((mod) => mod.LogsModule)
      },

    ]
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class MainRoutingModule { }
