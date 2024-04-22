import { Component } from '@angular/core';

@Component({
    selector: 'bsa-search',
    standalone: true,
    imports: [],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent {
    suggestionGroups: { group: string, suggestions: string[] }[] = [
        {
            group: 'Group A',
            suggestions: [
                'suggestion A1',
                'suggestion A2',
                'suggestion A3',
            ],
        },
        {
            group: 'Group B',
            suggestions: [
                'suggestion B1',
                'suggestion B2',
                'suggestion B3',
            ],
        },
        {
            group: 'Group C',
            suggestions: [
                'suggestion C1',
                'suggestion C2',
                'suggestion C3',
            ],
        },
        {
            group: 'Group D',
            suggestions: [
                'suggestion D1',
                'suggestion D2',
                'suggestion D3',
            ],
        },
        {
            group: 'Group E',
            suggestions: [
                'suggestion E1',
                'suggestion E2',
                'suggestion E3',
            ],
        },
        {
            group: 'Group F',
            suggestions: [
                'suggestion F1',
                'suggestion F2',
                'suggestion F3',
            ],
        },
        {
            group: 'Group G',
            suggestions: [
                'suggestion G1',
                'suggestion G2',
                'suggestion G3',
            ],
        },
    ];
}
