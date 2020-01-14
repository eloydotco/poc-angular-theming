import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material';

import cssVars from 'css-vars-ponyfill';
import tinycolor from 'tinycolor2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'poc-angular-theming';
  opened = true;
  darkMode = false;
  colors = {
    primary: '',
    secondary: ''
  }
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

  ngOnInit() {
    this.colors.primary = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    this.colors.secondary = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');

    if (document['documentMode']) {
      cssVars({});
    }

    console.log(window.innerWidth)
    if (window.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55;
      this.opened = true;
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    let newColors;
    if (this.darkMode) {
      newColors = {
        primary: '#000000',
        secondary: '#FFAA00'
      };
    } else {
      newColors = this.colors;
    }
    const palettes = this.getColorPalettes(newColors);
    this.setColorPalettes(palettes);
  }

  colorChange(selectedColor: string, variable: string) {
    const newColors = Object.assign({}, this.colors);
    newColors[variable] = selectedColor;
    const palettes = this.getColorPalettes(newColors);
    this.setColorPalettes(palettes);
  }

  getColorPalettes(palettes: any): any {
    return {
      primary: computeColors(palettes.primary),
      secondary: computeColors(palettes.secondary)
    }
  }

  setColorPalettes(palettes: any) {
    const cssVariables = {};

    for (const key of Object.keys(palettes)) {
      for (const color of palettes[key]) {
        const mainKey = `--theme-${key}-${color.name}`;
        const mainValue = color.hex;
        const constrastKey = `--theme-${key}-contrast-${color.name}`;
        const constrastValue = color.darkContrast ? 'rgba(black, 0.87)' : 'white';

        document.documentElement.style.setProperty(mainKey, mainValue);
        document.documentElement.style.setProperty(constrastKey, constrastValue);

        cssVariables[mainKey] = mainValue;
        cssVariables[constrastKey] = constrastValue;
      }
    }

    if (document['documentMode']) {
      cssVars({
        variables: cssVariables
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55
      this.opened = true;
    }
  }

  isBiggerScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 768) {
      return true;
    } else {
      return false;
    }
  }
}

function computeColors(hex: string): Color[] {
  return [
    getColorObject('50', tinycolor(hex).lighten(52)),
    getColorObject('100', tinycolor(hex).lighten(37)),
    getColorObject('200', tinycolor(hex).lighten(26)),
    getColorObject('300', tinycolor(hex).lighten(12)),
    getColorObject('400', tinycolor(hex).lighten(6)),
    getColorObject('500', tinycolor(hex)),
    getColorObject('600', tinycolor(hex).darken(6)),
    getColorObject('700', tinycolor(hex).darken(12)),
    getColorObject('800', tinycolor(hex).darken(18)),
    getColorObject('900', tinycolor(hex).darken(24)),
    getColorObject('A100', tinycolor(hex).lighten(50).saturate(30)),
    getColorObject('A200', tinycolor(hex).lighten(30).saturate(30)),
    getColorObject('A400', tinycolor(hex).lighten(10).saturate(15)),
    getColorObject('A700', tinycolor(hex).lighten(5).saturate(5))
  ];
}

function getColorObject(name, value): Color {
  const c = tinycolor(value);
  return {
    name: name,
    hex: c.toHexString(),
    darkContrast: c.isLight()
  };
}

export interface Color {
  name: string;
  hex: string;
  darkContrast: boolean;
}