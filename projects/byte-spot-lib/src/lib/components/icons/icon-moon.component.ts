import { Component } from '@angular/core';

@Component({
  selector: 'ngx-bsa-icon-moon',
  standalone: true,
  imports: [],
  template: `
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path style="stroke: currentColor; stroke-width: 1.5; fill: none;" stroke-linecap="round" stroke-linejoin="round" transform="matrix(-0.7071068286895752, 0.7071068286895752, -0.7071068286895752, -0.7071068286895752, 934.2892456054688, -207.70388793945312)" d="M 801.408 479.913 A 12 12 0 1 1 801.408 502.087 A 11.598 11.598 0 0 0 801.408 479.913 Z"/>
      </svg>
  `,
    styleUrl: './icon.scss'
})
export class IconMoonComponent {

}
