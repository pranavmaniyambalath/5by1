import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const MOBILE_SCREEN_MAX_WIDTH = 768;
@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  leftMenuDrawerSubject = new BehaviorSubject(false);

  leftMenuDrawerMobileSubject = new BehaviorSubject(false);

  private leftMenuLastToggleStatus = false;

  private exports = new BehaviorSubject<Record<string, unknown>>({});

  private head = new BehaviorSubject<Record<string, unknown>>({});

  isMobileView = (): boolean => this.document.defaultView.innerWidth <= MOBILE_SCREEN_MAX_WIDTH;

  setLeftMenuDrawerSubject = (val: boolean): void => {

    this.leftMenuDrawerSubject.next(val);

  }

  getLeftMenuLastToggleStatus = (): boolean => this.leftMenuLastToggleStatus;

  toggleLeftMenuDrawer = (): void => {

    this.leftMenuDrawerSubject.next(!this.leftMenuDrawerSubject.value);
    this.leftMenuLastToggleStatus = this.leftMenuDrawerSubject.value;


  }

  showLeftMenuDrawer = (): void => {

    this.leftMenuDrawerMobileSubject.next(true);

  }

  setExport(options: Record<string, unknown>): void {

    this.exports.next(options);

  }

  getExport(): Observable<Record<string, unknown>> {

    return this.exports.asObservable();

  }

  setHd(products: Record<string, unknown>): void {

    this.head.next(products);

  }

  getHd(): Observable<Record<string, unknown>> {

    return this.head.asObservable();

  }

  private dataSource: BehaviorSubject<string> = new BehaviorSubject<string>('');

  data: Observable<string> = this.dataSource.asObservable();

  setUserInfo(data: string): void {

    this.dataSource.next(data);

  }

  fetchUserInfo(): Observable<string> {

    return this.dataSource.asObservable();

  }


}
