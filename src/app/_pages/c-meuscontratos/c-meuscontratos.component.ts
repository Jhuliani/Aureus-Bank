import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meuscontratos',
  standalone: true,
  imports: [TableModule, 
    CommonModule,
    TabMenuModule,
  ],
  templateUrl: './c-meuscontratos.component.html',
  styleUrl: './c-meuscontratos.component.scss',
})
export class CMeuscontratosComponent implements OnInit{
  unlockedCustomers!: any[];
  lockedCustomers!: any[];

  menuSuperior: MenuItem[] | undefined;
  constructor(private router: Router) {}

  ngOnInit() {
    this.menuSuperior = [
      { label: 'Home', icon: 'pi pi-home', route: '/painelcliente' },
      { label: 'Meus Contratos', icon: 'pi pi-file', route: '' },
    ]
  }
    
}
