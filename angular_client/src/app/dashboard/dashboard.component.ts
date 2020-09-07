import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogAddTimeSheet} from './add/add.component';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { isBuffer } from 'util';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styles: [`
  p{
    background-color:green;
    color:red;
    border:2px solid black;
  }
  .notthinh{
    color:white;
  }
  `],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DashBoardComponent implements OnInit{
  days = [];
  dateInput = '';
  currentTime = new Date();
  monthPicker = new FormControl(this.currentTime);
  monthCurrent = this.currentTime.getMonth();
  yearCurrent = this.currentTime.getFullYear();
  constructor(
    public dialog: MatDialog,
    // public DialogAddTimeSheet: DashBoardComponent
  ) {

  }
  ngOnInit()
  {
    this.khoiTao(this.monthCurrent,this.yearCurrent,this.monthPicker.value);
  }
  trArr: any[] = [
    {},{},{},{},{},{}
  ];
  tdArr: any[] = [
    {},{},{},{},{},{},{}
  ];
  Array = [];
  public getDaysInMonth(month, year) {
    var date = new Date(year, month,1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
  public khoiTao(monthCurrent,yearCurrent,monthPicker){
    console.log(this.currentTime.getMonth()+'valueInput');
    this.days = this.getDaysInMonth(monthCurrent,yearCurrent);
    let firstDateCalendar = this.days[0];
    let lastDateCalendar = this.getDaysInMonth(monthCurrent,yearCurrent).slice(-1).pop();
    const firstOfCalendar = this.getMondayOfWeek(firstDateCalendar);
    const tempstr = this.getMondayOfWeek(firstDateCalendar);
    let firstArrCalendar = [];
    let lastArr = [];
    let countLoopFirstArr = firstDateCalendar.getDay();
    if(countLoopFirstArr == 0){
      countLoopFirstArr = 7;
    }
    for(let i= 0; i<countLoopFirstArr-1;i++){
      let str = tempstr.setDate(firstOfCalendar.getDate() + i);
      firstArrCalendar.push(new Date(str));
    }
    let now = monthPicker;
    if (now.getMonth() == 11) {
        var currentDate = new Date(now.getFullYear() + 1, 0, 1);
    } else {
        var currentDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    let ar= [];
    for(let i = 0;i < 7-now.getDay(); i++)
    {
      if(new Date(lastDateCalendar).getDay() == 0){
          break;
      }
      let end = currentDate.setDate(1 + i);
      lastArr.push(new Date(end));
    }
    let abcd = firstArrCalendar.concat(this.days);
    let abcde = abcd.concat(lastArr);
    this.days = abcde;
  }
  changeMonth(event): void {
    // this.khoiTao(event.value._i.month+1,event.value._i.year,this.monthPicker);
  }
  nextBackMonth(params) {
    if(params == 'next'){
      var getMon =this.currentTime.getMonth() +1;
      if(getMon ==12){
        getMon = 0;
        this.currentTime = new Date(this.yearCurrent +=1,0,1);
      }
      else{
        this.currentTime =  new Date(this.currentTime.setMonth(getMon));
      }
      console.log('input');
      console.log(getMon);
      console.log(this.currentTime.getMonth());
      this.khoiTao(getMon,this.yearCurrent,this.currentTime);
    }else{
      let getMon = this.currentTime.getMonth()-1;
      if(getMon ==-1){
        getMon = 11;
        this.currentTime = new Date(this.yearCurrent -=1,11,1);
      }
      else{
        this.currentTime =  new Date(this.currentTime.setMonth(getMon));
      }
      this.khoiTao(getMon,this.yearCurrent,this.currentTime);
    }
  }
  public getMondayOfWeek(dayParam){
    let d = new Date(dayParam);
    let day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  timeSheet()
  {
    const dialogRef = this.dialog.open(DialogAddTimeSheet, {
      width: '500px',
      height:'900px'
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }
}
