import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-c-consultar',
  standalone: true,
  imports: [InputTextModule, FormsModule,
    ButtonModule, 
  ],
  templateUrl: './c-consultar.component.html',
  styleUrl: './c-consultar.component.scss'
})
export class CConsultarComponent {
  search!: string;


}
