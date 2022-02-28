import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@fboenvironments/environment';
import { LedgerGroupService } from '@fboservices/accounting/ledger-group.service';
import { LedgerService } from '@fboservices/accounting/ledger.service';
import { VoucherService } from '@fboservices/accounting/voucher.service';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { Ledger } from '@shared/entity/accounting/ledger';
import { TransactionType } from '@shared/entity/accounting/transaction';
import { Voucher, VoucherType } from '@shared/entity/accounting/voucher';
import { QueryData } from '@shared/util/query-data';
import * as dayjs from 'dayjs';
import { FilterItem } from '../../../../directives/table-filter/filter-item';
import { FilterLedgerGroupReportComponent } from '../filter-ledger-group-report/filter-ledger-group-report.component';

interface LedgerGroupReportFields {
  id: string;
  number: string;
  type: VoucherType,
  date: Date;
  primaryLedger: string;
  ledger: string;
  debit: string;
  credit: string;
  details: string;
}

@Component({
  selector: 'app-ledger-group-report',
  templateUrl: './ledger-group-report.component.html',
  styleUrls: [ './ledger-group-report.component.scss' ]
})
export class LedgerGroupReportComponent implements OnInit {

  tableHeader = 'Ledger Group Report';

  displayedColumns: string[] = [ 'number', 'date', 'type', 'primaryLedger', 'ledger', 'debit', 'credit', 'details' ];

  numberColumns: string[] = [ 'debit', 'credit' ];

  columnHeaders = {
    number: 'Voucher #',
    type: 'Type',
    date: 'Date',
    details: 'Details',
    primaryLedger: 'Primary Ledger',
    ledger: 'Ledger',
    debit: 'Debit',
    credit: 'Credit',
  }

  queryParams: QueryData = {};

  loading = true;

  ledgerRows: ListQueryRespType<LedgerGroupReportFields> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;


  constructor(private activatedRoute: ActivatedRoute,
    private voucherService: VoucherService,
    private ledgerService: LedgerService,
    private ledgerGroupService: LedgerGroupService,) { }

    private pushIntoItems =
    (items: Array<LedgerGroupReportFields>, voucher: Voucher, amount: number, tType: TransactionType,
      primaryLedger: string, ledger: string, details: string): void => {

      const { id, number, date, type } = voucher;
      let debit = '';
      let credit = '';
      const amountS = amount.toFixed(environment.decimalPlaces);
      tType === TransactionType.CREDIT ? credit = amountS : debit = amountS;
      items.push({
        id,
        number,
        date,
        type,
        debit,
        credit,
        primaryLedger,
        ledger,
        details: details ?? voucher.details,
      });

    }

  private extractReportItems =
  (vouchers: Array<Voucher>, ledgerIds: Array<string>):[Array<LedgerGroupReportFields>, Array<string>] => {

    const items: Array<LedgerGroupReportFields> = [];
    const otherLids:Array<string> = [];
    for (const voucher of vouchers) {

      const [ pTran, ...cTrans ] = voucher.transactions;
      if (ledgerIds.includes(pTran.ledgerId)) {

        for (const cTran of cTrans) {

          this.pushIntoItems(items, voucher, cTran.amount, pTran.type, pTran.ledgerId, cTran.ledgerId, cTran.details);
          otherLids.push(cTran.ledgerId);

        }

      } else {

        otherLids.push(pTran.ledgerId);
        cTrans.filter((ctrn) => ledgerIds.includes(ctrn.ledgerId)).forEach(
          (tran) => {

            this.pushIntoItems(items, voucher, tran.amount, tran.type, tran.ledgerId, pTran.ledgerId, tran.details);

          });

      }

    }
    return [ items, otherLids ];

  }

  private createSummaryRows = (items: Array<LedgerGroupReportFields>,
    ledger: string, debit: string, credit: string) => {

    items.push({
      id: null,
      number: null,
      ledger,
      primaryLedger: null,
      type: null,
      date: null,
      credit,
      debit,
      details: ''
    });

  }


  private findBalances = (totalCredit: number, totalDebit: number, sLedgers: Array<Ledger>):Array<string> => {

    let totalOBCr = 0;
    let totalOBDr = 0;
    sLedgers.forEach((sLedger) => {

      sLedger.obType === TransactionType.CREDIT ? totalOBCr += sLedger.obAmount : totalOBDr += sLedger.obAmount;

    });
    const opBalCr = String(totalOBCr);
    const opBalDr = String(totalOBDr);
    const balCr = totalCredit + totalOBCr;
    const balDr = totalDebit + totalOBDr;
    const balCrS = balCr > balDr ? String((balCr - balDr).toFixed(environment.decimalPlaces)) : '';
    const balDrS = balDr > balCr ? String((balDr - balCr).toFixed(environment.decimalPlaces)) : '';
    return [ opBalCr, opBalDr, balCrS, balDrS ];

  }

  private createTableRowData =
  (ledgerMap:Record<string, Ledger>, items: Array<LedgerGroupReportFields>, sLedgers: Array<Ledger>) => {

    let totalDebit = 0;
    let totalCredit = 0;
    items.forEach((item) => {

      item.ledger = ledgerMap[item.ledger].name;
      item.primaryLedger = ledgerMap[item.primaryLedger].name;
      totalDebit += Number(item.debit);
      totalCredit += Number(item.credit);

    });
    this.createSummaryRows(items, 'Total', String(totalDebit.toFixed(environment.decimalPlaces)), String(totalCredit.toFixed(environment.decimalPlaces)));
    const [ opBalCr, opBalDr, balCrS, balDrS ] = this.findBalances(totalCredit, totalDebit, sLedgers);
    this.createSummaryRows(items, 'Opening Balance', opBalDr, opBalCr);
    this.createSummaryRows(items, 'Balance', balDrS, balCrS);
    this.ledgerRows = {
      items,
      totalItems: items.length,
      pageIndex: 0
    };


  }

  private loadData = (ledgerGroupId: string, againstId?: string) => {

    this.ledgerGroupService.get(ledgerGroupId, {}).subscribe((lGroup) => {

      this.tableHeader = `Ledger Group Report -- ${lGroup.name}`;

    });

    const queryP2: QueryData = {
      where: {
        ledgerGroupId: {'like': ledgerGroupId,
          'options': 'i'}
      }
    };
    this.ledgerService.queryData(queryP2).subscribe((ledgers2) => {

      const ledgerIds: Array<string> = [];
      ledgers2.forEach((lgs) => ledgerIds.push(lgs.id));
      const queryP3 = {...this.queryParams};
      queryP3.where = {...queryP3.where,
        'transactions.ledgerId': {
          in: ledgerIds
        }};
      delete queryP3.where.ledgerGroupId;
      this.voucherService.search(queryP3).subscribe((vouchers) => {

        const [ items2, otherLids2 ] = this.extractReportItems(vouchers, ledgerIds);
        // To show the details of selected ledger, fetch it from server.
        let otherLids = otherLids2;
        let items = items2;
        if (againstId) {

          items = items2.filter((item) => item.ledger === againstId);
          otherLids = otherLids.filter((oId) => oId === againstId);

        }
        const queryDataL: QueryData = {
          where: {
            id: {
              inq: otherLids
            }
          }
        };

        this.ledgerService.search(queryDataL).subscribe((ledgers) => {

          const ledgerMap:Record<string, Ledger> = {};
          ledgers.forEach((ldg) => (ledgerMap[ldg.id] = ldg));
          ledgers2.forEach((ldg) => (ledgerMap[ldg.id] = ldg));
          this.createTableRowData(ledgerMap, items, ledgers2);
          this.loading = false;

        });

      });

    });


  }


  ngOnInit(): void {

    this.filterItem = new FilterItem(FilterLedgerGroupReportComponent, {});
    this.activatedRoute.queryParams.subscribe((value) => {

      const { whereS, ...qParam } = value;
      this.queryParams = qParam;
      if (whereS) {

        this.loading = true;
        this.queryParams.where = JSON.parse(whereS);
        const ledgerGroupParam = this.queryParams.where.ledgerGroupId as {like: string};
        const againstParam = this.queryParams.where.againstL as {ne: string};
        const ledgerGroupId = ledgerGroupParam?.like;
        const againstId = againstParam?.ne;
        this.loadData(ledgerGroupId, againstId);

      }

    });
    this.loading = false;

  }


  columnParsingFn = (element: unknown, column: string): string => {

    if (!element[column]) {

      return null;

    }
    switch (column) {

    case 'date':
      return dayjs(element[column]).format(environment.dateFormat);

    }
    return null;

  }

}
