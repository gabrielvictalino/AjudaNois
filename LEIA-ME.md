# AjudaNois — protótipo dos 12 fluxos

## Como executar

Abra **AjudaNois.html** em um navegador moderno. O arquivo contém toda a interface, sem instalação. Para editar os fontes, use `index.html`, `style.css` e `app.js` na mesma pasta. Opcionalmente, execute `python -m http.server 8766 --bind 127.0.0.1` nesta pasta e acesse `http://127.0.0.1:8766/`.

O seletor **Perfil** alterna entre Aluno (Ana Souza), Monitor (Lucas Costa), Professor e Coordenação. É um recurso da apresentação, sem autenticação real. Os dados persistem neste navegador e são compartilhados entre os perfis. Abrir o arquivo e acessar por localhost usa armazenamentos independentes.

O **Guia de demonstração** contém os roteiros e a opção de restaurar os exemplos. A atualização preserva os dados da versão anterior e acrescenta os campos necessários aos novos fluxos.

## Roteiro integrado

1. Como **Professor**, em Sala de materiais, crie uma sala e publique um arquivo (até 1 MB). Anote o código. Edite a unidade, visualize e baixe o material.
2. Como **Aluno**, entre usando o código em Minhas salas. Também há entrada manual e convite de e-mail simulado para Algoritmos. Sair bloqueia o acesso à sala, preservando o histórico para uma nova entrada.
3. Como **Monitor**, selecione Algoritmos em Agenda e inicie a sessão simulada de Laços de repetição. Como Aluno, responda à Lista 03. Consulte Minha frequência e revise a resposta: a revisão não duplica presença.
4. Como **Monitor**, em Acompanhamento, combine atividade, situação e busca por nome. A resposta de Ana é a entrega do perfil Aluno. Consulte e registre nota/feedback; como Aluno, consulte a correção.
5. O Monitor também pode **propor uma atividade** extraclasse ou vinculada a uma aula. Essas ações de apoio permitem apresentar os fluxos 10 e 13 com dados novos.
6. Encerre a sessão como Monitor. A duração é somada uma única vez aos registros. Sessão sem interação de Ana registra ausência. Os registros iniciais de Algoritmos somam 40h; encerrar uma aula de 2h resulta em 42h.
7. Como **Coordenação**, confira os registros na Emissão de certificados e emita. Como Monitor, visualize e baixe o PDF. Altere a assinatura na Coordenação e reemita: a versão anterior fica cancelada e a nova usa a assinatura atual. Também é possível cancelar a versão ativa.
8. Como **Monitor**, envie aviso para turma ou indivíduo. Como Aluno, consulte e filtre por leitura. Editar o aviso reinicia sua leitura. Avisos destinados a Bruno não aparecem para Ana.
9. Em Conversas, envie como Monitor, abra a mesma conversa como Professor e retorne: o envio terá confirmação de leitura. Cada sala tem histórico próprio. Somente o autor pode editar/excluir sua mensagem; a edição exige nova leitura.
10. Como **Coordenação**, crie um processo seletivo, busque por título/disciplina, filtre a situação, consulte, atualize e exclua com confirmação. Datas invertidas e vagas não inteiras são rejeitadas.

## Mapa do escopo

| Número | Área | Operações |
| --- | --- | --- |
| 3 | Conversas | Envio, leitura entre perfis, edição/exclusão própria e histórico por sala. |
| 6 | Sala de materiais | Criar sala, publicar/organizar/alterar/excluir materiais, prévia e download. |
| 8 | Minhas salas | Código, entrada manual, convite simulado, consulta e saída. |
| 9 | Minha frequência | Presença por interação em sessão, evidência e frequência. |
| 10 | Minhas atividades | Resposta durante aula ou extraclasse, revisão antes do prazo e consulta da correção. |
| 12 | Agenda | Cadastro, consulta, edição, exclusão e sessões simuladas. |
| 13 | Acompanhamento | Atividades, entregas, pendências, busca e filtros combinados. |
| 14 | Meus certificados | Situação, origem/histórico, visualização e download PDF. |
| 15 | Avisos | Turma/individual, criação, consulta, edição, exclusão e leitura. |
| 16 | Assinatura | Nome/cargo, imagem opcional, prévia, alteração, remoção da imagem e exclusão. |
| 17 | Emissão | Registros, soma de horas, assinatura/data, consulta, reemissão e cancelamento. |
| 22 | Processos seletivos | Criar, consultar, atualizar, excluir, buscar e filtrar. |

## Origem, hipóteses e limites

O escopo permanece exclusivamente em **3, 6, 8, 9, 10, 12, 13, 14, 15, 16, 17 e 22**. As onze primeiras seguem o PDF fornecido. A 22 segue a descrição do usuário: gerenciamento de processo seletivo com criação, atualização e exclusão. Não foram adicionados os outros módulos do PDF.

As regras do documento estavam em branco. São hipóteses da interface:

- Data de referência fixa em **16/10/2026**, para prazos e situação dos processos. Sessões simulam aula em andamento, independentemente da data agendada.
- Entregar/revisar atividade vinculada durante sessão aberta gera uma presença por aula. Entregar extraclasse, com a sessão fechada ou apenas abrir a tela não gera presença. Encerrar sem interação registra ausência.
- A resposta corrigida fica bloqueada para edição. A nota aceita de 0 a 10.
- Aulas em andamento exigem encerramento antes de excluir. Aulas vinculadas a atividades não podem ser excluídas, preservando o histórico. Crie uma aula sem vínculos para demonstrar exclusão. Horas/presenças já consolidadas são preservadas.
- A carga horária soma os registros fictícios iniciais e as sessões encerradas. A emissão guarda uma cópia das horas e assinatura. A reemissão cancela versões ativas da mesma monitoria/semestre e preserva o histórico.
- Coordenação gerencia a seleção; campos de vagas e datas são escolhas de interface. Inscrição/classificação de candidatos não fazem parte do pedido.

Não há backend, login, e-mail real ou sincronização entre dispositivos. O seletor de perfil não é controle de acesso de produção. Arquivos são locais: materiais até 1 MB, assinatura PNG/JPG até 500 KB. Falhas de armazenamento desfazem a operação e exibem mensagem, sem confirmar salvamento inexistente.

TXT, imagens comuns e PDF têm prévia quando o navegador permite; outros formatos podem ser baixados. O certificado é um PDF de uma página em paisagem com **MODELO DEMONSTRATIVO · SEM VALIDADE OFICIAL**. Seu conteúdo visual é rasterizado, sem texto selecionável ou assinatura digital criptográfica. Fontes do Google são opcionais; sem internet, fontes locais são usadas.

## Verificação

Sintaxe JavaScript conferida. Execute `node tests/fluxos.cjs` para 15 verificações sem dependências externas: telas por perfil, presença, revisão, filtros combinados, nota zero, horas/ausência, emissão duplicada, assinatura preservada, reemissão/cancelamento, leitura de mensagens, destinatários, validação da seleção, falta de espaço, migração e restauração.

No navegador foram exercitados: resposta/revisão/correção entre perfis, presença, filtros, sessão/carga horária, emissão/download PDF de 42h, leitura/edição/exclusão de mensagem, criação de sala, upload/prévia de TXT, entrada do aluno pelo código, aviso individual com leitura, upload de assinatura, reemissão/cancelamento e criação/atualização de seleção. O PDF foi reaberto, validado como uma página e renderizado para inspeção visual. Essas verificações cobrem o protótipo local.
