import { Injectable } from '@angular/core';
import { Voucher } from '@shared/entity/accounting/voucher';
import { VOUCHER_API_URI } from '@shared/server-apis';
import { LedgerSummaryTB } from '@shared/util/trial-balance-ledger-summary';
import { LedgerGroupSummary } from '@shared/util/ledger-group-summary';
import { BaseHTTPService } from '@fboservices/base-http.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Ledger } from '@shared/entity/accounting/ledger';

@Injectable({
  providedIn: 'root'
})
export class VoucherService extends BaseHTTPService<Voucher> {

  public API_URI = VOUCHER_API_URI;

  public upsert(voucher: Voucher): Observable<void> {

    const {id, ...voucher2} = voucher;
    if (id) {

      return super.update({id,
        ...voucher2});

    }
    return super.save(voucher2);

  }

  public importVouchers(file: File): Observable<void> {

    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http.post<void>(`${this.API_URI}/import`, formData).pipe(
      catchError((err) => throwError(err))
    );

  }

  public fetchLedgerSummary(): Observable<Array<LedgerSummaryTB>> {

    return this.http.get<Array<LedgerSummaryTB>>(`${this.API_URI}/ledgerSummary`).pipe(
      catchError((err) => throwError(err))
    );

  }

  public fetchLedgerGroupSummary(): Observable<Array<LedgerGroupSummary>> {

    return this.http.get<Array<LedgerGroupSummary>>(`${this.API_URI}/ledgerGroupSummary`).pipe(
      catchError((err) => throwError(err))
    );

  }

  public fetchLedgersUsed(vType: string):Observable<Array<Ledger>> {

    return this.http.get<Array<Ledger>>(`${this.API_URI}/ledgers-used/${vType}`).pipe(
      catchError((err) => throwError(err))
    );

  }

}
