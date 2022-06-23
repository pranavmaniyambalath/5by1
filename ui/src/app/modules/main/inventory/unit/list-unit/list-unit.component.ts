import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ListQueryRespType } from '@fboutil/types/list.query.resp';
import { QueryData } from '@shared/util/query-data';
import { Subscription } from 'rxjs';
import { Unit } from '@shared/entity/inventory/unit';
import { ActivatedRoute } from '@angular/router';
import { UnitService } from '@fboservices/inventory/unit.service';
import { FilterItem } from '../../../directives/table-filter/filter-item';
import { FilterUnitComponent } from '../filter-unit/filter-unit.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../../../services/main.service';
import { exportAsXLSX } from '@fboutil/export-xlsx.util';
@Component({
  selector: 'app-list-unit',
  templateUrl: './list-unit.component.html',
  styleUrls: [ './list-unit.component.scss' ]
})
export class ListUnitComponent implements AfterViewInit, OnInit {

  tableHeader = 'List of Units';

  displayedColumns: string[] = [ 'name', 'code', 'decimalPlaces', 'parent.name', 'times' ];

  c = this.displayedColumns.length;

  columnHeaders = {
    name: 'Name',
    code: 'Code',
    decimalPlaces: 'Decimals',
    'parent.name': 'Base Unit',
    times: 'Times'
  };

  xheaders = [

    {key: 'name',
      width: 30, },
    { key: 'code',
      width: 30, },
    { key: 'decimalPlaces',
      width: 30, },
    { key: 'parent.name',
      width: 30, },
    { key: 'times',
      width: 30, },

  ];

    iheaders = [
      'Name',
      'Code',
      'Decimals',
      'Base Unit',
      'Times'
    ];

  queryParams: QueryData = { };

  routerSubscription: Subscription;

  loading = true;

  units: ListQueryRespType<Unit> = {
    totalItems: 0,
    pageIndex: 0,
    items: []
  };

  filterItem: FilterItem;

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly unitService: UnitService,
    private dialog: MatDialog,
    private mainservice: MainService,) { }

    private loadData = () => {

      this.loading = true;
      this.unitService.list(this.queryParams).subscribe((units) => {

        this.units = units;
        this.loading = false;

      }, (error) => {

        console.error(error);
        this.loading = false;

      });

    }

    ngOnInit(): void {

      this.filterItem = new FilterItem(FilterUnitComponent, {});

    }

    ngAfterViewInit(): void {

      this.activatedRoute.queryParams.subscribe((value) => {

        const {whereS, ...qParam} = value;
        this.queryParams = qParam;
        if (whereS) {

          this.queryParams.where = JSON.parse(whereS);

        }
        this.loadData();

      });

    }

    handleImportClick = (file: File): void => {

      this.unitService.importUnit(file).subscribe(() => {});


    };

    exportExcel() : void {

      const headers = this.displayedColumns.map((col) => ({header: this.columnHeaders[col],
        key: col}));

      exportAsXLSX(this.tableHeader, this.units.items, headers);

    }

}
