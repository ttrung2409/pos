import { Component, OnInit, Input, Output, EventEmitter, DoCheck, IterableDiffers, OnDestroy, IterableDiffer, SimpleChanges, OnChanges, ViewChild, HostListener, ElementRef, Inject, ViewEncapsulation } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { Key } from 'ts-keycode-enum';
import { Sort, MatSort, MatCheckboxChange } from '@angular/material';
import { APP_GLOBAL } from 'web/src/app/app.global';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import UtilsService from 'web/src/app/services/utils.service';
import * as $ from 'jquery'

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GridComponent implements OnInit, DoCheck, OnDestroy, OnChanges {
  private _differ: IterableDiffer<any>;
  private _hotkeySubscription: Subscription = new Subscription();
  private _subscription: Subscription = new Subscription();
  private _global: any;

  constructor(private differs: IterableDiffers,
    @Inject(APP_GLOBAL) global,
    private el: ElementRef,
    private utils: UtilsService) {
    this._differ = differs.find([]).create(null);
    this._global = global;
  }

  @Input() columns: GridColumn[];
  @Input() dataSource: any[];
  @Input() selectedIndex: number = 0;
  @Input() showFooter: boolean;
  @Input() isHeaderSticky: boolean = true;
  @Input() isFooterSticky: boolean;
  @Input() defaultSort: any = {};
  @Input() height: string | Function;
  @Input() virtualScroll: boolean;
  @Input() rowHeight: number = 40;
  @Input() rowClass: string | Function;
  @Input() selectable: boolean;
  @Input() selectOnEnter: boolean = true;
  @Input() useShift: boolean;

  @Output() rowClick = new EventEmitter();
  @Output() selectedIndexChange = new EventEmitter();
  @Output() select = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() sortChange = new EventEmitter();

  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(CdkVirtualScrollViewport) viewport;
  @ViewChild('container') container: ElementRef;

  get allSelected() {
    return this.bindingSource.length > 0 && this.bindingSource.every(x => x.selected);
  }

  bindingSource: any[] = [];

  get displayedColumns() {
    return this.columns.map(x => x.field);
  }

  ngOnInit() {
    for (let column of this.columns) {
      column.format = column.format || ((value, item) => value);
    }

    if (this.selectable) {
      this.columns.unshift(new GridColumn({ selectable: true }));
    }

    this.enableHotkeys();

    if (!!this.height) {
      this._subscription.add(fromEvent(window, 'resize').subscribe(e => {
        let height = typeof (this.height) === 'function' ? this.height() : this.height
        $(this.container.nativeElement).height(height);
        if (this.virtualScroll) {
          let viewportHeight = height - $(this.el.nativeElement).find('.mat-header-row').outerHeight(true);
          if (this.showFooter) {
            viewportHeight -= $(this.el.nativeElement).find('.footer').outerHeight(true);
          }

          $(this.el.nativeElement).find('.virtual-scroll-viewport').height(viewportHeight);
          this.viewport.checkViewportSize();
        }
      }));
    }
  }

  ngAfterViewInit() {
    if (!!this.height) {
      setTimeout(() => {
        let height = typeof (this.height) === 'function' ? this.height() : this.height
        $(this.container.nativeElement).height(height);
        if (this.virtualScroll) {
          let viewportHeight = height - $(this.el.nativeElement).find('.mat-header-row').outerHeight(true);
          if (this.showFooter) {
            viewportHeight -= $(this.el.nativeElement).find('.footer').outerHeight(true);
          }

          $(this.el.nativeElement).find('.virtual-scroll-viewport').height(viewportHeight);
          this.viewport.checkViewportSize();
        }
      });
    }

    this.setColumnWidth();
  }

  ngDoCheck() {
    if (!!this._differ.diff(this.dataSource)) {
      this.bindingSource = [...this.dataSource];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnDestroy() {
    this.disableHotkeys();
    this._subscription.unsubscribe();
  }

  setColumnWidth() {
    let widthInPercent = 100;
    let widthInPx = $(this.container.nativeElement).width();
    let count = this.columns.length;
    for (let column of this.columns) {
      if (!!column.width) {
        if (column.width.endsWith('%')) {
          widthInPercent -= parseFloat(column.width.match(/(\d)+%/)[0]);
        }
        else if (column.width.endsWith('px')) {
          widthInPercent -= parseFloat(column.width.match(/(\d)+px/)[0]) / widthInPx * 100;
        }

        count--;
      }
    }

    if (count > 0) {
      this.columns = this.columns.map(x => Object.assign(x, {
        width: !x.width ? `${widthInPercent / count}%` : x.width
      }));
    }
  }

  onRowClick(row, index) {
    this.selectedIndex = index;
    this.selectedIndexChange.emit(this.selectedIndex);
    this.rowClick.emit(row);
  }

  getCellData(row: any, column: GridColumn) {
    let paths = column.field.split('.');
    let value = paths.reduce((acc, value) => !!acc ? acc[value] : null, row);
    return column.isNumber ? this.utils.formatNumber(value, { allowDecimal: column.allowDecimal }) : value;
  }

  handleKeyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case Key.UpArrow:
        this.up();
        break;
      case Key.DownArrow:
        this.down();
        break;
      case Key.Enter:
        if (this.useShift && !event.shiftKey) return;
        if (this.selectedIndex > -1 && this.selectOnEnter) {
          this.select.emit(this.dataSource[this.selectedIndex]);
        }

        break;
      case Key.Delete:
        if (this.useShift && !event.shiftKey) return;
        if (this.selectedIndex > -1) {
          this.delete.emit(this.dataSource[this.selectedIndex]);
        }

        break;
    }
  }

  getFooterValue(footer) {
    if (typeof (footer) === 'function') {
      return footer();
    }

    return footer || '';
  }

  onSortChange(sort: Sort) {
    this.sortChange.emit({ orderBy: sort.active, isDesc: sort.direction == 'desc' ? true : false });
  }

  enableHotkeys() {
    this.disableHotkeys();
    this._hotkeySubscription = new Subscription();
    this._hotkeySubscription.add(fromEvent(document, 'keydown').subscribe((event: KeyboardEvent) => {
      if (!this._global.lockHotkeys) {
        this.handleKeyEvent(event);
      }
    }));
  }

  disableHotkeys() {
    if (!!this._hotkeySubscription) {
      this._hotkeySubscription.unsubscribe();
      this._hotkeySubscription = null;
    }
  }

  toggleAll(change: MatCheckboxChange) {
    for (let row of this.bindingSource) {
      row.selected = change.checked;
    }
  }

  scrollTo(pos) {
    $('.grid-container').scrollTop(pos);
  }

  up() {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1);
    this.selectedIndexChange.emit(this.selectedIndex);

    let grid = $(this.el.nativeElement).find('.grid-container')[0];
    let row = $(this.el.nativeElement).find('.mat-row:first')[0];
    let gridHeight = grid.offsetHeight - $(this.el.nativeElement).find('.mat-header-row').height();
    let rowHeight = this.rowHeight;

    const prevIndexScrollTop = rowHeight * this.selectedIndex;
    const currentPage = Math.ceil((grid.scrollTop + 1) / gridHeight)
    const itemPage = Math.floor((prevIndexScrollTop + rowHeight / 2) / gridHeight)

    if (currentPage != itemPage) {
      grid.scrollTop = itemPage * gridHeight;
    }
  }

  down() {
    this.selectedIndex = Math.min(this.dataSource.length - 1, this.selectedIndex + 1);
    this.selectedIndexChange.emit(this.selectedIndex);

    let grid = $(this.el.nativeElement).find('.grid-container')[0];
    let row = $(this.el.nativeElement).find('.mat-row:first')[0];
    let gridHeight = grid.offsetHeight - $(this.el.nativeElement).find('.mat-header-row').height();
    let rowHeight = this.rowHeight;

    const nextIndexScrollTop = rowHeight * this.selectedIndex;
    const currentPage = Math.ceil((grid.scrollTop + 1) / gridHeight)
    const itemPage = Math.ceil((nextIndexScrollTop + rowHeight / 2) / gridHeight)

    if (currentPage != itemPage) {
      grid.scrollTop = (itemPage - 1) * gridHeight;
    }
  }

  getRowClass(row) {
    return typeof (this.rowClass) === 'function' ? this.rowClass(row)
      : !!this.rowClass && !!row[this.rowClass] ? row[this.rowClass].toLowerCase() : '';
  }
}

export class GridColumn {
  public constructor(init?: Partial<GridColumn>) {
    Object.assign(this, init);
  }

  public caption: string;
  public field: string;
  public width: string;
  public format: Function;
  public footer: any;
  public sortable: boolean;
  public isNumber: boolean;
  public selectable: boolean;
  public allowDecimal: boolean;
}
