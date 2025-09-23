import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meuscontratos',
  standalone: true,
  imports: [TableModule, CommonModule,
  ],
  templateUrl: './c-meuscontratos.component.html',
  styleUrl: './c-meuscontratos.component.scss',
  providers: [],
})
export class CMeuscontratosComponent implements OnInit{
  unlockedCustomers!: any[];
  lockedCustomers!: any[];

  constructor() {}

  ngOnInit() {

  }
    
}
