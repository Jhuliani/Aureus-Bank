
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-c-painelcliente',
  standalone: true,
  imports: [ButtonModule, MenuModule,
    CommonModule, RippleModule
  ],
  templateUrl: './c-painelcliente.component.html',
  styleUrls: ['./c-painelcliente.component.scss'],
})


export class CPainelclienteComponent implements OnInit {
    items: MenuItem[] = [];

    constructor(private router: Router) {}

    ngOnInit() {
this.items = [
    {
        label: 'Navigate',
        items: [
            { label: 'Router Link', icon: 'pi pi-palette', route: '/guides/csslayer' },
            { label: 'Programmatic', icon: 'pi pi-link', command: () => this.router.navigate(['/installation']) },
            { label: 'External', icon: 'pi pi-home', url: 'https://angular.io/' }
        ]
    }
];
    }
}
