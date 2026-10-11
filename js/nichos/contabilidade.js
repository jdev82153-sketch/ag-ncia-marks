window.NICHO = {
  id: 'contabilidade',
  nome: 'Painel de Contabilidade',
  menu: ['Visão geral', 'Clientes', 'Vencimentos', 'Documentos', 'Atendente WhatsApp'],
  kpis: [
    { rotulo: 'Clientes ativos', valor: '64' },
    { rotulo: 'Vencimentos na semana', valor: '11' },
    { rotulo: 'Documentos pendentes', valor: '18' },
    { rotulo: 'Guias emitidas', valor: '37' }
  ],
  tabela: {
    titulo: 'Próximos vencimentos',
    colunas: ['Cliente', 'Obrigação', 'Vencimento', 'Situação'],
    linhas: [
      ['Padaria Central', 'DAS', '20/10', 'Guia emitida'],
      ['Clínica Vida', 'ISS', '15/10', 'Pendente'],
      ['Mercado Bom Preço', 'FGTS', '07/11', 'Em preparo']
    ]
  }
};

