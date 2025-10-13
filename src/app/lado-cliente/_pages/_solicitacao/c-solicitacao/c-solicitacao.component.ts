import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { FipeService } from '../../../_services/fipe.service';
import { Marcas, Modelos, Anos, InformacoesFipe, ModelosResponse } from '../../../_models/fipe.models';
import { RouterModule } from '@angular/router';

// Importações do PrimeNG
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-c-solicitacao',
  standalone: true,
  imports: [
    DropdownModule, 
    CommonModule, 
    FormsModule,
    RouterModule,
    ProgressSpinnerModule,
    MessagesModule,
    CardModule,
    ButtonModule,
    RippleModule,
    InputNumberModule,
    TooltipModule
  ],
  templateUrl: './c-solicitacao.component.html',
  styleUrl: './c-solicitacao.component.scss'
})
export class CSolicitacaoComponent implements OnInit {


  // dropdowns FIPE
  marcasListagem: SelectItem[] = [];
  modelosListagem: SelectItem[] = [];
  anosListagem: SelectItem[] = [];

  // selecionados da FIPE
  tiposVeiculo: SelectItem[] = [
    { label: 'Carros', value: 'carros' },
    { label: 'Motos', value: 'motos' },
    { label: 'Caminhões', value: 'caminhoes' }
  ];
  tipoVeiculo: string = 'carros';
  marcaSelecionada?: string;
  modeloSelecionado?: string;
  anoSelecionado?: string;

  // Resultado FIPE
  informacoesFipe?: InformacoesFipe;
  carregando: boolean = false;
  mensagens: any[] = [];

  // Campos de simulação
  valorEntrada: number = 0;
  opcoesParcelas: SelectItem[] = [
    { label: '12x', value: 12 },
    { label: '24x', value: 24 },
    { label: '36x', value: 36 },
    { label: '48x', value: 48 },
    { label: '60x', value: 60 }
  ];
  parcelasSelecionadas: number = 36;
  taxaJuros: number = 1.5;
  rendaMensal: number = 0;

  resultadoSimulacao: any = null;

  // construtor
  constructor(private fipeService: FipeService) {}

  // incializador
  ngOnInit(): void {
    this.carregarMarcas();
  }

  // getter pro cálculos
  get valorVeiculoNumerico(): number {
    if (!this.informacoesFipe?.Valor) return 0;
    const valor = this.informacoesFipe.Valor.replace('R$ ', '').replace('.', '').replace(',', '.');
    return parseFloat(valor) || 0;
  }

  get formularioValido(): boolean {
    return !!(this.marcaSelecionada && this.modeloSelecionado && this.anoSelecionado);
  }

  // metodos usados no consumo da api da FIPE
  carregarMarcas(): void {
    this.carregando = true;
    this.limparMensagens();
    
    this.fipeService.listarMarcas(this.tipoVeiculo).subscribe({
      next: (marcas: Marcas[]) => {
        this.marcasListagem = marcas.map(m => ({ 
          label: m.nome, 
          value: m.codigo 
        }));
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar marcas:', err);
        this.mostrarErro('Erro ao carregar marcas. Tente novamente.');
        this.marcasListagem = [];
        this.carregando = false;
      }
    });
  }

  onMarcaChange(): void {
    if (!this.marcaSelecionada) {
      this.modelosListagem = [];
      this.anosListagem = [];
      this.modeloSelecionado = undefined;
      this.anoSelecionado = undefined;
      this.informacoesFipe = undefined;
      this.resultadoSimulacao = null;
      return;
    }

    this.carregando = true;
    this.limparMensagens();
    this.modelosListagem = [];
    this.anosListagem = [];
    this.modeloSelecionado = undefined;
    this.anoSelecionado = undefined;
    this.informacoesFipe = undefined;
    this.resultadoSimulacao = null;

    this.fipeService.listarModelos(this.tipoVeiculo, this.marcaSelecionada).subscribe({
      next: (response: ModelosResponse) => {
        if (response && response.modelos && response.modelos.length > 0) {
          this.modelosListagem = response.modelos.map(m => ({
            label: m.nome,
            value: m.codigo
          }));
        } else {
          this.mostrarErro('Nenhum modelo encontrado para esta marca.');
          this.modelosListagem = [];
        }
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar modelos:', err);
        this.mostrarErro('Erro ao carregar modelos. Tente novamente.');
        this.modelosListagem = [];
        this.carregando = false;
      }
    });
  }

  onModeloChange(): void {
    if (!this.marcaSelecionada || !this.modeloSelecionado) {
      this.anosListagem = [];
      this.anoSelecionado = undefined;
      this.informacoesFipe = undefined;
      this.resultadoSimulacao = null;
      return;
    }

    this.carregando = true;
    this.limparMensagens();
    this.anosListagem = [];
    this.anoSelecionado = undefined;
    this.informacoesFipe = undefined;
    this.resultadoSimulacao = null;

    this.fipeService.listarAnos(this.tipoVeiculo, this.marcaSelecionada, this.modeloSelecionado).subscribe({
      next: (anos: Anos[]) => {
        if (anos && anos.length > 0) {
          this.anosListagem = anos.map(a => ({ 
            label: a.nome, 
            value: a.codigo 
          }));
        } else {
          this.mostrarErro('Nenhum ano encontrado para este modelo.');
          this.anosListagem = [];
        }
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar anos:', err);
        this.mostrarErro('Erro ao carregar anos. Tente novamente.');
        this.anosListagem = [];
        this.carregando = false;
      }
    });
  }

  onAnoChange(): void {
    if (!this.marcaSelecionada || !this.modeloSelecionado || !this.anoSelecionado) {
      this.informacoesFipe = undefined;
      this.resultadoSimulacao = null;
      return;
    }

    this.carregando = true;
    this.limparMensagens();
    this.informacoesFipe = undefined;
    this.resultadoSimulacao = null;

    this.fipeService.listarInformacoes(
      this.tipoVeiculo,
      this.marcaSelecionada,
      this.modeloSelecionado,
      this.anoSelecionado
    ).subscribe({
      next: (info: InformacoesFipe) => {
        this.informacoesFipe = info;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar informações da FIPE:', err);
        this.mostrarErro('Erro ao carregar informações da FIPE. Tente novamente.');
        this.carregando = false;
      }
    });
  }

  onTipoVeiculoChange(): void {
    this.marcasListagem = [];
    this.modelosListagem = [];
    this.anosListagem = [];
    this.marcaSelecionada = undefined;
    this.modeloSelecionado = undefined;
    this.anoSelecionado = undefined;
    this.informacoesFipe = undefined;
    this.resultadoSimulacao = null;
    this.limparMensagens();

    this.carregarMarcas();
  }

  limparConsulta(): void {
    this.tipoVeiculo = 'carros';
    this.marcasListagem = [];
    this.modelosListagem = [];
    this.anosListagem = [];
    this.marcaSelecionada = undefined;
    this.modeloSelecionado = undefined;
    this.anoSelecionado = undefined;
    this.informacoesFipe = undefined;
    this.resultadoSimulacao = null;
    this.valorEntrada = 0;
    this.rendaMensal = 0;
    this.limparMensagens();

    this.carregarMarcas();
  }

  // metodos de simulação
  realizarSimulacao(): void {
    if (!this.informacoesFipe) {
      this.mostrarErro('Complete a consulta FIPE primeiro.');
      return;
    }

    const valorVeiculo = this.valorVeiculoNumerico;
    const valorFinanciado = valorVeiculo - this.valorEntrada;

    if (valorFinanciado <= 0) {
      this.mostrarErro('O valor da entrada deve ser menor que o valor do veículo.');
      return;
    }

    // Cálculo da parcela (juros compostos)
    const taxaMensal = this.taxaJuros / 100;
    const valorParcela = valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, this.parcelasSelecionadas)) / 
    (Math.pow(1 + taxaMensal, this.parcelasSelecionadas) - 1);

    const totalPagar = valorParcela * this.parcelasSelecionadas;
    const totalJuros = totalPagar - valorFinanciado;

    // Análise de crédito inicial
    const aprovado = valorParcela <= (this.rendaMensal * 0.3); // Parcela <= 30% da renda
    const mensagem = aprovado 
      ? 'Sua renda mensal foi aprovada na simulação inicial. \nAperte o botão abaixo e solicite seu financiamento.' 
      : 'Valor da parcela excede 30% da sua renda mensal.';

    this.resultadoSimulacao = {
      valorFinanciado,
      valorParcela,
      totalPagar,
      totalJuros,
      aprovado,
      mensagem
    };
  }

  // Métodos auxiliares
  private mostrarErro(mensagem: string): void {
    this.mensagens = [{ severity: 'error', summary: 'Erro', detail: mensagem }];
  }

  private limparMensagens(): void {
    this.mensagens = [];
  }

  novaSimulacao() {
    // Limpa o formulário
    this.limparConsulta();        
    // Rola para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

 
}