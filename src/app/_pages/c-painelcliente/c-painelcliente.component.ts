import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'app-c-painelcliente',
  standalone: true,
  imports: [ButtonModule, 
    TabMenuModule,
    CommonModule,

  ],
  templateUrl: './c-painelcliente.component.html',
  styleUrls: ['./c-painelcliente.component.scss'],
})


export class CPainelclienteComponent implements OnInit {
    menuSuperior: MenuItem[] | undefined;

    constructor(private router: Router) {}

    ngOnInit() {
        this.menuSuperior = [
            { label: 'Home', icon: 'pi pi-home', route: '' },
            { label: 'Meus Contratos', icon: 'pi pi-file', route: '/meuscontratos' },
        ];
    }
}
