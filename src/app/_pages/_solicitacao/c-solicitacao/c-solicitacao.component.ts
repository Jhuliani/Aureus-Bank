import { Component, OnInit} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';


interface City {
  name: string;
  code: string;
}


@Component({
  selector: 'app-c-solicitacao',
  standalone: true,
  imports: [FormsModule,
    InputTextModule,
    ButtonModule,
    TabMenuModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    SelectButtonModule,
    RadioButtonModule,
    FormsModule,
    DropdownModule,
  ],
  templateUrl: './c-solicitacao.component.html',
  styleUrl: './c-solicitacao.component.scss'
})
export class CSolicitacaoComponent implements OnInit {
  marca!: string;
  modelo!: string;
  ano!: number;

  // OnInit
  items: MenuItem[] | undefined;
  formGroup!: FormGroup;
  ingredient!: string;
  valorVeiculo!: number;
  valorFinanciado!: number;
  valorEntrada!: number;
  parcelas!: number;


  stateOptions: any[] = [
    { label: 'Carro', value: 'carro', icon: 'pi pi-car' },
    { label: 'Moto', value: 'moto', icon: 'pi pi-circle' },
    { label: 'Caminhão', value: 'caminhao', icon: 'pi pi-truck'}
  ];

  ngOnInit() {
    this.items = [

    ];

    // Inicializar FormGroup
    this.formGroup = new FormGroup({
      value: new FormControl('')
    });
  }

}
