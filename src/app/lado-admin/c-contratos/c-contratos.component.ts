import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'app-c-contratos',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TabMenuModule
  ],
  templateUrl: './c-contratos.component.html',
  styleUrl: './c-contratos.component.scss'
})
export class CContratosComponent {
    contratos: string[] = []; // é da tabela
    loading = false;
}
