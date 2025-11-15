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

  calcularFinanciamento(valorFinanciado: number, taxaJuros: number, numeroParcelas: number): {
    valorFinanciado: number;
    valorParcela: number;
    totalPagar: number;
    totalJuros: number;
  } {
    const taxaMensal = taxaJuros / 100;
    const valorParcela = valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, numeroParcelas)) /
      (Math.pow(1 + taxaMensal, numeroParcelas) - 1);
    const totalPagar = valorParcela * numeroParcelas;
    const totalJuros = totalPagar - valorFinanciado;

    return {
      valorFinanciado,
      valorParcela,
      totalPagar,
      totalJuros
    };
  }
}

