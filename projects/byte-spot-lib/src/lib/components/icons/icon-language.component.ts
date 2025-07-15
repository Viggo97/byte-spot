import { Component } from '@angular/core';

@Component({
    selector: 'ngx-bsa-icon-language',
    imports: [],
    template: `
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <ellipse style="stroke: currentColor; fill: none; stroke-width: 1.5;" cx="16" cy="16" rx="12" ry="12"/>
          <ellipse style="stroke: currentColor; fill: none; stroke-width: 1.5;" cx="16" cy="16" rx="4.854" ry="11.903"/>
          <path style="stroke: currentColor; stroke-width: 1.5; transform-origin: 16px 12px;" d="M 5.16 11.977 L 26.844 11.977"/>
          <path style="stroke: currentColor; stroke-width: 1.5; transform-origin: 16px 20px;" d="M 5.16 20 L 26.844 20"/>
      </svg>
  `,
    styleUrl: './icon.scss'
})
export class IconLanguageComponent {

}
