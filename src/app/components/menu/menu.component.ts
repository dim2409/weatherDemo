import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { setTempUnit } from '../../state/weather.actions';
import { selectTempUnit } from '../../state/weather.selectors';
import { NgClass, NgStyle } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [NgClass, NgStyle, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  tempUnit: 'si' | 'us' = 'si';
  constructor(private store: Store) {
    this.store.select(selectTempUnit).subscribe(unit => this.tempUnit = unit);
  }

  // dispatch action to set temp unit
  setTempUnit(unit: 'si' | 'us') {
    this.store.dispatch(setTempUnit({ unit }));
  }

  // toggle temp unit
  toggleTempUnit() {
    this.setTempUnit(this.tempUnit === 'si' ? 'us' : 'si');
  }
}
