import { Component } from '@angular/core';
import { Parcelas, Contrato, Veiculo } from '../../_models/db.models';

@Component({
  selector: 'app-c-paineladmin',
  standalone: true,
  imports: [],
  templateUrl: './c-paineladmin.component.html',
  styleUrl: './c-paineladmin.component.scss'
})
export class CPaineladminComponent {
 // Dados que serão populados pelo backend
  dadosParcelas: Parcelas | null = null;
  dadosContrato: Contrato | null = null;
  dadosVeiculo: Veiculo | null = null;

  // Loading state
  carregando = true;

  ngOnInit() {
    // Aqui você fará a chamada para o backend
    this.carregarDados();
  }

  carregarDados() {
    // Simulando chamada assíncrona ao backend
    this.carregando = true;
    
    // Exemplo de como os dados serão atribuídos quando vierem do backend
    setTimeout(() => {
      // Dados mock - substituir pela chamada real ao backend
      this.dadosParcelas = {
        pagar: 1500.00,
        emAtraso: 2300.50,
        aVencer: 3500.75,
        situacaoTotal: 7300.25,
        totalAtraso: 2300.50
      };

      this.dadosContrato = {
        idContrato: '2139323223',
        dataEmissao: '20/09/2023',
        vigenciaInicio: '20/09/2023',
        vigenciaFim: '20/09/2043',
        statusContrato: 'EM_ATRASO',
        produto: 'VEÍCULO LEVE',
        tipoProduto: 'CARRO',
        cedente: 'AUREUSBank S/A'
      };

      this.dadosVeiculo = {
        marca: 'Toyota',
        modelo: 'Corolla XEi 2.0',
        ano: '2022/2023',
        placa: 'ABC-1D23',
        renavam: '01234567890',
        chassi: '9BRBLWHE0NP123456'
      };

      this.carregando = false;
    }, 1000);
  }
}
