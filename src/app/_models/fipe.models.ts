export interface Marcas {
  codigo: string;
  nome: string;
}

export interface Modelos {
  codigo: string;
  nome: string;
}

export interface Anos {
  codigo: string;
  nome: string;
}

export interface InformacoesFipe {
  Valor: string;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
}

export interface ModelosResponse {
  modelos: Modelos[];
  anos?: Anos[];
}