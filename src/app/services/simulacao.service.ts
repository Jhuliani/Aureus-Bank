import { Injectable } from '@angular/core';
import { InformacoesFipe } from '../_models/fipe.models';

export interface DadosSimulacao {
  informacoesFipe?: InformacoesFipe;
  tipoVeiculo?: string;
  marcaSelecionada?: string;
  modeloSelecionado?: string;
  anoSelecionado?: string;
  valorEntrada?: number;
  parcelasSelecionadas?: number;
  taxaJuros?: number;
  rendaMensal?: number;
  resultadoSimulacao?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SimulacaoService {
  private dadosSimulacao?: DadosSimulacao;

  salvarDadosSimulacao(dados: DadosSimulacao): void {
    this.dadosSimulacao = dados;
  }

  obterDadosSimulacao(): DadosSimulacao | undefined {
    return this.dadosSimulacao;
  }

  limparDadosSimulacao(): void {
    this.dadosSimulacao = undefined;
  }
}

