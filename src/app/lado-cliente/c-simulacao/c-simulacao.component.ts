import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Importações do PrimeNG
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { Anos, InformacoesFipe, Marcas, ModelosResponse } from '../../_models/fipe.models';
import { FipeService } from '../../services/fipe.service';
import { SimulacaoService } from '../../services/simulacao.service';

@Component({
  selector: 'app-simulacao',
  standalone: true,
  imports: [
    DropdownModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProgressSpinnerModule,
    MessagesModule,
    CardModule,
    ButtonModule,
    RippleModule,
    InputNumberModule,
    TooltipModule,
    ToastModule
  ],
  templateUrl: './c-simulacao.component.html',
  styleUrls: ['./c-simulacao.component.scss']
})
export class CSimulacaoComponent implements OnInit {

  listaMarcas: SelectItem[] = [];
  listaModelos: SelectItem[] = [];
  listaAnos: SelectItem[] = [];

  listaTiposVeiculo: SelectItem[] = [
    { label: 'Carros', value: 'carros' },
    { label: 'Motos', value: 'motos' },
    { label: 'Caminhões', value: 'caminhoes' }
  ];

  tipoVeiculo: string = 'carros';
  marcaEscolhida?: string;
  modeloEscolhido?: string;
  anoEscolhido?: string;
  dadosFipe?: InformacoesFipe;

  formularioSimulacao!: FormGroup;

  listaParcelas: SelectItem[] = [
    { label: '12x', value: 12 },
    { label: '24x', value: 24 },
    { label: '36x', value: 36 },
    { label: '48x', value: 48 },
    { label: '60x', value: 60 }
  ];

  resultadoSimulacao: any = null;
  estaCarregando: boolean = false;

  constructor(
    private servicoFipe: FipeService,
    private construtorFormulario: FormBuilder,
    private roteador: Router,
    private servicoSimulacao: SimulacaoService,
    private servicoMensagem: MessageService
  ) {
    this.criarFormulario();
  }

  ngOnInit(): void {
    this.carregarMarcas();
  }

  private criarFormulario(): void {
    const taxaInicial = this.obterTaxaJuros(36);

    this.formularioSimulacao = this.construtorFormulario.group({
      valorEntrada: [null, [Validators.required, Validators.min(0)]],
      parcelasSelecionadas: [36, [Validators.required]],
      taxaJuros: [{value: taxaInicial, disabled: true}],
      rendaMensal: [null, [Validators.required, Validators.min(0.01)]]
    });

    this.formularioSimulacao.get('parcelasSelecionadas')?.valueChanges.subscribe((parcelas: number) => {
      if (parcelas) {
        const novaTaxa = this.obterTaxaJuros(parcelas);
        this.formularioSimulacao.get('taxaJuros')?.setValue(novaTaxa, {emitEvent: false});
      }
    });
  }

  atualizarValorMaximoEntrada(): void {
    const valorMaximo = this.valorNumericoDoVeiculo;
    const campoValorEntrada = this.formularioSimulacao.get('valorEntrada');

    if (campoValorEntrada && valorMaximo > 0) {
      campoValorEntrada.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(valorMaximo)
      ]);
      campoValorEntrada.updateValueAndValidity();
    }
  }

  get valorNumericoDoVeiculo(): number {
    if (!this.dadosFipe?.Valor) return 0;
    const valor = this.dadosFipe.Valor.replace('R$ ', '').replace('.', '').replace(',', '.');
    return parseFloat(valor) || 0;
  }

  get formularioEstaValido(): boolean {
    return !!(this.marcaEscolhida && this.modeloEscolhido && this.anoEscolhido);
  }

  private obterTaxaJuros(parcelas: number): number {
    switch (parcelas) {
      case 12: return 1.5;
      case 24: return 2.5;
      case 36: return 3.5;
      case 48: return 4.5;
      case 60: return 5.5;
      default: return 3.5;
    }
  }

  carregarMarcas(): void {
    this.estaCarregando = true;

    this.servicoFipe.listarMarcas(this.tipoVeiculo).subscribe({
      next: (marcas: Marcas[]) => {
        this.listaMarcas = marcas.map(m => ({
          label: m.nome,
          value: m.codigo
        }));
        this.estaCarregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar marcas:', erro);
        this.mostrarErro('Erro ao carregar marcas. Tente novamente.');
        this.listaMarcas = [];
        this.estaCarregando = false;
      }
    });
  }

  aoMudarTipoVeiculo(): void {
    this.limparDadosFipe();
    this.carregarMarcas();
  }

  aoMudarMarca(): void {
    if (!this.marcaEscolhida) {
      this.limparDadosFipe();
      return;
    }

    this.estaCarregando = true;
    this.limparDadosFipe();

    this.servicoFipe.listarModelos(this.tipoVeiculo, this.marcaEscolhida).subscribe({
      next: (resposta: ModelosResponse) => {
        if (resposta && resposta.modelos && resposta.modelos.length > 0) {
          this.listaModelos = resposta.modelos.map(m => ({
            label: m.nome,
            value: m.codigo
          }));
        } else {
          this.mostrarErro('Nenhum modelo encontrado para esta marca.');
          this.listaModelos = [];
        }
        this.estaCarregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar modelos:', erro);
        this.mostrarErro('Erro ao carregar modelos. Tente novamente.');
        this.listaModelos = [];
        this.estaCarregando = false;
      }
    });
  }

  aoMudarModelo(): void {
    setTimeout(() => {
      if (!this.marcaEscolhida || !this.modeloEscolhido) {
        return;
      }

      if (this.modeloEscolhido === 'undefined' || this.modeloEscolhido === 'null') {
        return;
      }

      this.estaCarregando = true;

      this.listaAnos = [];
      this.anoEscolhido = undefined;
      this.dadosFipe = undefined;
      this.resultadoSimulacao = null;

      this.servicoFipe.listarAnos(this.tipoVeiculo, this.marcaEscolhida, this.modeloEscolhido).subscribe({
        next: (anos: Anos[]) => {
          if (anos && anos.length > 0) {
            this.listaAnos = anos.map(a => ({
              label: a.nome,
              value: a.codigo
            }));
          } else {
            this.mostrarErro('Nenhum ano encontrado para este modelo.');
            this.listaAnos = [];
          }
          this.estaCarregando = false;
        },
        error: (erro) => {
          console.error('Erro ao carregar anos:', erro);
          this.mostrarErro('Erro ao carregar anos. Tente novamente.');
          this.listaAnos = [];
          this.estaCarregando = false;
        }
      });
    }, 0);
  }

  aoMudarAno(): void {
    if (!this.marcaEscolhida || !this.modeloEscolhido || !this.anoEscolhido ||
        this.modeloEscolhido === 'undefined' || this.modeloEscolhido === 'null' ||
        this.anoEscolhido === 'undefined' || this.anoEscolhido === 'null') {
      this.dadosFipe = undefined;
      this.resultadoSimulacao = null;
      return;
    }

    this.estaCarregando = true;
    this.dadosFipe = undefined;
    this.resultadoSimulacao = null;

    this.servicoFipe.listarInformacoes(
      this.tipoVeiculo,
      this.marcaEscolhida,
      this.modeloEscolhido,
      this.anoEscolhido
    ).subscribe({
      next: (info: InformacoesFipe) => {
        this.dadosFipe = info;
        this.atualizarValorMaximoEntrada();
        this.estaCarregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar informações da FIPE:', erro);
        this.mostrarErro('Erro ao carregar informações da FIPE. Tente novamente.');
        this.estaCarregando = false;
      }
    });
  }

  limparConsulta(): void {
    this.tipoVeiculo = 'carros';
    this.limparDadosFipe();
    this.formularioSimulacao.reset({
      valorEntrada: null,
      parcelasSelecionadas: 36,
      rendaMensal: null
    });
    this.carregarMarcas();
  }

  private limparDadosFipe(): void {
    this.listaModelos = [];
    this.listaAnos = [];
    this.modeloEscolhido = undefined;
    this.anoEscolhido = undefined;
    this.dadosFipe = undefined;
    this.resultadoSimulacao = null;
  }

  calcularSimulacao(): void {
    if (!this.dadosFipe) {
      this.mostrarErro('Complete a consulta FIPE primeiro.');
      return;
    }

    this.formularioSimulacao.markAllAsTouched();

    if (this.formularioSimulacao.invalid) {
      this.mostrarErroValidacao();
      return;
    }

    const valorEntrada = this.formularioSimulacao.get('valorEntrada')?.value;
    const rendaMensal = this.formularioSimulacao.get('rendaMensal')?.value;
    const numeroParcelas = this.formularioSimulacao.get('parcelasSelecionadas')?.value || 36;
    const taxaJuros = this.formularioSimulacao.get('taxaJuros')?.value || 3.5;

    const valorVeiculo = this.valorNumericoDoVeiculo;
    const valorFinanciado = valorVeiculo - valorEntrada;

    if (valorFinanciado <= 0) {
      this.mostrarErro('O valor da entrada deve ser menor que o valor do veículo.');
      return;
    }

    const resultado = this.calcularFinanciamento(valorFinanciado, taxaJuros, numeroParcelas);
    const aprovado = resultado.valorParcela <= (rendaMensal * 0.3);

    this.resultadoSimulacao = {
      ...resultado,
      aprovado: aprovado,
      mensagem: aprovado
        ? 'Sua renda mensal foi aprovada na simulação inicial. \nAperte o botão abaixo e solicite seu financiamento.'
        : 'Valor da parcela excede 30% da sua renda mensal.'
    };

    if (aprovado) {
      this.salvarDadosParaSolicitacao();
    }
  }

  private calcularFinanciamento(valorFinanciado: number, taxaJuros: number, numeroParcelas: number): any {
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

  private mostrarErroValidacao(): void {
    if (this.formularioSimulacao.get('valorEntrada')?.invalid) {
      this.mostrarErro('Informe o valor de entrada válido.');
    } else if (this.formularioSimulacao.get('rendaMensal')?.invalid) {
      this.mostrarErro('Informe sua renda mensal válida.');
    } else {
      this.mostrarErro('Preencha todos os campos obrigatórios.');
    }
  }

  irParaSolicitacao(): void {
    this.salvarDadosParaSolicitacao();
    this.roteador.navigate(['/painelcliente/solicitacao']);
  }

  novaSimulacao(): void {
    this.limparConsulta();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private salvarDadosParaSolicitacao(): void {
    const valorEntrada = this.formularioSimulacao.get('valorEntrada')?.value;
    const rendaMensal = this.formularioSimulacao.get('rendaMensal')?.value;
    const numeroParcelas = this.formularioSimulacao.get('parcelasSelecionadas')?.value || 36;
    const taxaJuros = this.formularioSimulacao.get('taxaJuros')?.value || 3.5;

    if (!this.marcaEscolhida || !this.modeloEscolhido || !this.anoEscolhido || !this.dadosFipe) {
      console.error('Erro ao salvar dados: informações incompletas', {
        marcaEscolhida: this.marcaEscolhida,
        modeloEscolhido: this.modeloEscolhido,
        anoEscolhido: this.anoEscolhido,
        dadosFipe: this.dadosFipe
      });
      return;
    }

    const dadosParaSalvar = {
      informacoesFipe: this.dadosFipe,
      tipoVeiculo: this.tipoVeiculo,
      marcaSelecionada: this.marcaEscolhida,
      modeloSelecionado: this.modeloEscolhido,
      anoSelecionado: this.anoEscolhido,
      valorEntrada: valorEntrada,
      parcelasSelecionadas: numeroParcelas,
      taxaJuros: taxaJuros,
      rendaMensal: rendaMensal,
      resultadoSimulacao: this.resultadoSimulacao
    };

    console.log('Salvando dados para solicitação:', dadosParaSalvar);
    this.servicoSimulacao.salvarDadosSimulacao(dadosParaSalvar);
  }

  private mostrarErro(mensagem: string): void {
    this.servicoMensagem.add({
      severity: 'error',
      summary: 'Erro',
      detail: mensagem,
      life: 10000
    });
  }

  private mostrarSucesso(mensagem: string): void {
    this.servicoMensagem.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: mensagem,
      life: 10000
    });
  }
}

