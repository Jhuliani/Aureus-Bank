export interface Contrato {
  idContrato: string;
  dataEmissao: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  statusContrato: 'EM_ATRASO' | 'ATIVO' | 'PAGO' | 'PENDENTE' | 'CANCELADO';
  produto: string;
  tipoProduto: string;
  cedente: string;
}

export interface Veiculo {
  marca: string;
  modelo: string;
  ano: string;
  placa: string;
  renavam: string;
  chassi: string;
}

export interface Parcelas {
  pagar: number;
  emAtraso: number;
  aVencer: number;
  situacaoTotal: number;
  totalAtraso: number;
}