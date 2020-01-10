import { Component, OnInit } from '@angular/core';

import cssVars from 'css-vars-ponyfill';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'poc-angular-theming';
  primaryColor;
  secondaryColor;
  
  ngOnInit() {
    this.primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    this.secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');

    if (document.documentMode){
      cssVars({});
    }
  }

  colorChange(selectedColor: string, variable: string) {
    console.log(variable, selectedColor);
    const colorVariable = `--${variable}-color`;
    document.documentElement.style.setProperty(colorVariable, selectedColor);

    if (document.documentMode){
      cssVars({
        variables: {
          '--primary-color' : this.primaryColor,
          '--secondary-color': this.secondaryColor
        }
      });
    }
  }
}
