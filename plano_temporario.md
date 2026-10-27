# Plano: entidades e agregados do AjudaNois ("Meu monitor, Minha vida")

## Contexto
O objetivo é organizar as **19 entidades que você definiu** nos 4 contextos do seu Context Map (Administrativo, Pedagógico, Comunicação e Recomendação), seguindo as regras do `ajudanois/AGENTS.md` e das skills `ajudanois/.agents/skills/projetar-*`:
- cada agregado tem **uma única entidade** (a raiz) e seus objetos de valor;
- os agregados se referenciam **só pelo identificador**, numa única direção;
- cada agregado tem um **Serviço** e um **Repositório**;
- relatórios e painéis não ficam no domínio: pelo CQRS, são **consultas** na camada de aplicação.

Este documento é só o plano, sem código.

**Referência:** o protótipo `AjudaNois.html` e o `LEIA-ME.md` (12 fluxos) foram usados como inspiração para atributos e regras, mas não como verdade absoluta. Onde ele contradiz suas decisões (ex.: no protótipo a sala tem um local físico), valem as suas decisões.

**Herança.** Pela regra de um agregado por entidade, as classes-pai **Postagem** e **Feedback** são **abstratas**: guardam os atributos e as regras comuns, mas não são agregados nem têm repositório próprio. Cada filha (Aula, Atividade, Comunicado, FeedbackAula, FeedbackMonitor, FeedbackProfessor) é um agregado próprio que herda da classe-pai.

---

## 1. Distribuição por contexto
Cada contexto só depende dos que vêm antes dele na tabela, então não há ciclos:

| Contexto | Depende de | Entidades |
|---|---|---|
| **Compartilhado** | — | papéis de acesso, Horário, Período (objetos de valor) |
| **Administrativo** | compartilhado | Coordenador, Professor, Aluno, **Matéria**, Monitor, ProcessoSeletivo, **Assinatura** |
| **Pedagógico** (núcleo) | administrativo | Sala do Classroom; Postagem → Aula, Atividade, Comunicado, MaterialDidatico, Extra; Presença; Certificado; Feedback → FeedbackAula, FeedbackMonitor, FeedbackProfessor |
| **Comunicação** | administrativo, pedagógico | Chat, Mensagem, Notificação |
| **Recomendação** (núcleo) | administrativo, pedagógico | nenhuma entidade sua; só usa os dados dos outros contextos (ver seção 6) |

---

## 2. Administrativo
| Agregado | Identificador | Atributos principais | Regras |
|---|---|---|---|
| **Aluno** | Matrícula | nome, e-mail, curso, período, histórico (disciplinas cursadas e notas), disponibilidade de horários | e-mail único |
| **Professor** | Matrícula funcional | nome, e-mail, disciplinas que leciona | e-mail único |
| **Coordenador** | Matrícula funcional | nome, e-mail, curso que coordena | é quem aprova processos seletivos, conclusões e certificados |
| **Materia** | Código | nome, carga horária, professor responsável | código único; é a matéria **da qual** o monitor é monitor |
| **Monitor** | identificador próprio | **aluno** (ref. Aluno), **matéria** (ref. Matéria), processo seletivo de origem, período de atuação, carga horária semanal, ativo | o monitor é **de uma matéria**; só um aluno aprovado no processo seletivo daquela matéria vira monitor; o mesmo aluno não pode ser monitor ativo duas vezes na mesma matéria |
| **ProcessoSeletivo** | identificador próprio | **título**, descrição, **matéria**, semestre (ex.: 2027.1), **vagas**, **data de início e de fim**, requisitos (nota mínima), **candidaturas** (aluno, data, nota, situação), situação (*em breve, aberto, encerrado*, calculada pelas datas) | **criado, alterado e excluído pela Coordenação** (fluxo 22 do protótipo); data de fim não pode ser anterior à de início; vagas inteiras e maiores que zero; inscrição só dentro do prazo; aluno precisa ter cursado a matéria; aprovados ≤ vagas; ao aprovar, gera o Monitor. *(No protótipo, a inscrição e a classificação ficaram de fora. Aqui estão incluídas porque alimentam a recomendação de monitores.)* |
| **Assinatura** | identificador próprio | nome, cargo, imagem opcional (PNG ou JPG de até 500 KB), coordenador dono | gerenciada pela Coordenação (fluxo 16 do protótipo); alterar a assinatura **não muda** os certificados já emitidos, porque cada certificado guarda uma cópia dela |

**Monitor × Salas.** O monitor pertence a uma matéria e é **alocado** a uma ou mais salas dessa matéria. A alocação fica registrada na **Sala** (lista de monitores alocados), e não no Monitor. Motivo: o Monitor está no Administrativo, que vem antes do Pedagógico. Se o Monitor apontasse para a Sala, os dois contextos dependeriam um do outro, formando um ciclo.

---

## 3. Pedagógico (núcleo)
### Sala do Classroom
É como uma sala do Google Classroom: um espaço de postagens e participantes. **Não tem horários, frequência nem carga horária**; essas informações ficam nas Aulas e nas Presenças.

| Agregado | Atributos principais | Regras |
|---|---|---|
| **SalaClassroom** | nome (**não precisa ser único**), descrição, **matéria** (ref. Matéria), criador (professor ou coordenador), data de criação, **participantes**: professores, **monitores alocados** e alunos, cada um com situação (ativo ou saiu); **código de convite** (usado no QR Code e na digitação manual), arquivada | **só coordenador ou professor cria** a sala; **entrada de alunos**: (a) **convite por e-mail**, que fica pendente até o aluno aceitar, ou (b) **QR Code** ou digitação do código de convite; o código pode ser gerado de novo para invalidar o anterior; **o aluno pode sair da sala**: perde o acesso, mas o histórico dele (entregas, presenças) é preservado e volta se ele entrar de novo, como no protótipo; **alocar e desalocar monitores**, que precisam ser da mesma matéria da sala e estar ativos; a mesma pessoa não aparece duas vezes; só participantes ativos veem as postagens |

**Convite** (objeto de valor dentro da sala): e-mail convidado, quem convidou, data, situação (pendente, aceito ou expirado).

### Postagem (abstrata) e suas filhas
**Postagem** (comum a todas): sala, autor (professor ou monitor alocado na sala), título, texto, data de publicação, anexos.

| Agregado | Herda de | Atributos próprios | Regras |
|---|---|---|---|
| **Aula** | Postagem | data, horário de início, duração, **link externo** (Google Meet ou outro serviço), conteúdo, **situação** (agendada, em andamento, encerrada). A aula acontece fora do sistema: só o link fica guardado, e o chat e a gravação de lá não são trazidos para a aplicação | o monitor **inicia e encerra** a aula; ao encerrar, a duração é somada **uma única vez** à carga horária do monitor, e quem não interagiu recebe ausência; aula em andamento precisa ser encerrada antes de ser excluída; aula com atividades vinculadas não pode ser excluída; **conflito de horário**: o mesmo monitor ou professor não pode ter duas aulas sobrepostas, mesmo em salas diferentes |
| **Atividade** | Postagem | prazo, **modo** (durante a aula, vinculada a uma Aula, ou extraclasse), nível de dificuldade, tentativas permitidas, **questões**, que podem ser **objetivas** (alternativas, gabarito, pontuação) ou **dissertativas**; **entregas** dos alunos (aluno, respostas, tentativa, data, nota de 0 a 10, **comentário da correção**, corrigida) | entrega e revisão só até o prazo; respeita o limite de tentativas; questões objetivas têm **correção automática**, e as dissertativas são corrigidas pelo monitor (nota e comentário); **entrega corrigida não pode mais ser editada**; entregar uma atividade vinculada **com a aula em andamento gera a Presença** do aluno; revisar a entrega não duplica a presença |
| **Comunicado** | Postagem | **destinatários**: a sala toda ou alunos específicos; importância (normal ou urgente); fixado; **leituras** (quem leu e quando) | é o "Aviso" do protótipo; quem não é destinatário não vê o comunicado; **editar o comunicado zera as leituras**; ao publicar, gera Notificações para os destinatários |
| **MaterialDidatico** | Postagem | **unidade ou assunto** (ex.: "Unidade 02 · Estruturas de controle"), arquivo (até 1 MB no protótipo) ou link | só professor ou monitor da sala publica, edita ou exclui; tem prévia (texto, imagem, PDF) e download; pode ser ocultado pela moderação |
| **Extra** | Postagem | **categoria** (texto livre, por exemplo: aviso de evento, enquete, vídeo, link útil) | tipo genérico para o que não é aula, atividade, comunicado nem material; a categoria é obrigatória |

### Demais agregados
| Agregado | Atributos principais | Regras |
|---|---|---|
| **Presenca** | aula, aluno, presente, **evidência** (ex.: "Resposta enviada na atividade"), data do registro | **presença por interação**: é gerada quando o aluno interage durante a aula em andamento (entrega de atividade vinculada); só abrir a tela não conta; ao encerrar a aula, quem não interagiu recebe ausência; **uma presença por aluno em cada aula**; presenças consolidadas não são apagadas; base para calcular a **frequência** |
| **Certificado** | **código público de verificação** (ex.: AN-2026-001, identificador), monitor, matéria, **semestre**, carga horária cumprida (soma das aulas encerradas em todas as salas em que o monitor esteve alocado, mais registros anteriores), data de emissão, **cópia da assinatura** (nome, cargo, imagem), **situação** (aguardando aval, disponível, recusado, cancelado), **versão** | **gerado automaticamente** ao fim do semestre de atuação do monitor que cumpriu a carga horária mínima, com as horas já somadas; fica **aguardando o aval da Coordenação**, que confere os registros e aprova (o certificado passa a disponível e recebe a assinatura atual) ou recusa com justificativa; o monitor só vê e baixa o certificado depois do aval; só pode haver **um certificado ativo** por monitor, matéria e semestre; **reemitir cancela a versão ativa**, gera uma nova com a assinatura atual e preserva o histórico; a versão ativa também pode ser cancelada sem reemissão; o monitor visualiza e baixa o PDF; consulta pública pelo código |

### Feedback (abstrato) e suas filhas
**Feedback** (comum a todos): autor, avaliado, **quem recebe** (quem pode ler o feedback), nota de 1 a 5, comentário, data, anônimo (sim ou não). Cada tipo fixa quem pode ser o autor e quem recebe.

> **Atenção ao nome:** no protótipo, "feedback" é o comentário que o monitor escreve ao corrigir uma atividade. Aqui, Feedback é a **avaliação que o aluno faz** da aula, do monitor ou do professor. Para não confundir, o comentário da correção se chama **"comentário da correção"** e fica dentro da entrega da Atividade.

| Agregado | Herda de | Quem escreve → sobre quem → quem recebe | Regras |
|---|---|---|---|
| **FeedbackAula** | Feedback | **Aluno** → sobre a **Aula** → recebido pelo monitor e pelo professor da sala | só um aluno que esteve presente na aula pode avaliar; um feedback por aluno em cada aula |
| **FeedbackMonitor** | Feedback | **Aluno** → sobre o **Monitor** → recebido pelo **Professor** | o aluno precisa participar de uma sala em que o monitor está alocado; quem recebe é o professor dessa sala; um feedback por aluno, monitor e sala; alimenta a recomendação de monitores |
| **FeedbackProfessor** | Feedback | **Monitor** → sobre o **Professor** → recebido pela **Coordenação** | o monitor e o professor precisam participar da mesma sala; um feedback por monitor, professor e sala |

Um feedback só é visto pelo autor e por quem o recebe. Quando é anônimo, quem recebe não vê o nome do autor.

---

## 4. Comunicação
As mensagens podem ser trocadas de **três formas**, e o **Chat** representa cada uma delas:

| Agregado | Atributos principais | Regras |
|---|---|---|
| **Chat** | **tipo**: (a) **individual**, uma conversa privada entre dois usuários; (b) **da postagem**, com os comentários de uma postagem (ref. Postagem); (c) **geral da sala**, a conversa de toda a turma (ref. Sala); participantes; data de criação | no **individual** participam exatamente duas pessoas, e não pode existir outro chat individual com o mesmo par; **toda postagem tem o seu chat**, criado junto com ela; **toda sala tem um chat geral**, criado junto com ela; nos chats da postagem e da sala participam os membros ativos da sala, e quem sai da sala perde o acesso, mas suas mensagens ficam no histórico |
| **Mensagem** | chat, autor, texto, data de envio, editada em, **leituras** (quem leu e quando), ocultada | o autor precisa participar do chat; **só o autor edita ou exclui** a própria mensagem; **editar exige nova leitura** (as leituras são zeradas); o remetente vê a confirmação de leitura; pode ser ocultada pela moderação |
| **Notificacao** | destinatário, tipo (comunicado, atividade, prazo, certificado, mensagem), texto, link para a origem, data, lida | marcar como lida; criada automaticamente por outros eventos (comunicado publicado, atividade perto do prazo, certificado emitido) |

---

## 5. Compartilhado
- **Papéis de acesso:** ADMINISTRADOR, COORDENADOR, PROFESSOR, MONITOR, ALUNO.
- **Horário semanal:** dia, início e fim, com a regra de detectar sobreposição.
- **Período:** data de início e data de fim.

---

## 6. Cobertura das 12 funcionalidades do escopo
| Nº | Funcionalidade | Nível | Coberta? | Entidades que atendem |
|---|---|---|---|---|
| 3 | Canal de comunicação entre pessoas | Difícil | ✅ | **Chat** (individual, da postagem e geral da sala) e **Mensagem** (leitura, edição e exclusão pelo próprio autor, confirmação de leitura) |
| 6 | Ambiente virtual com os materiais da disciplina | Difícil | ✅ | **SalaClassroom**, **MaterialDidatico** (unidade, arquivo, prévia, download, edição e exclusão) |
| 8 | Entrada do aluno na sala da monitoria | Média | ✅ | **SalaClassroom**: convite por e-mail, QR Code ou código digitado, saída com histórico preservado |
| 9 | Registro de presença a partir das interações do aluno | Média | ✅ | **Presenca** (gerada por interação e com evidência), **Aula** (ao encerrar, registra ausência de quem não interagiu), **Atividade** (entrega durante a aula é a interação) |
| 10 | Resposta a atividades propostas pelos monitores | Difícil | ✅ | **Atividade**: proposta pelo monitor, durante a aula ou extraclasse; entregas, revisão até o prazo, bloqueio após a correção e consulta da nota e do comentário |
| 12 | Gerenciamento de aulas | Média | ✅ | **Aula**: cadastro, edição, exclusão com restrições, iniciar e encerrar, link externo |
| 13 | Acompanhamento das atividades dos alunos | Média | ✅ | **Atividade** (entregas, nota, comentário). As listagens com filtros (atividade, situação, nome do aluno, pendências) são **consultas** da camada de aplicação, sem agregado novo |
| 14 | Gerenciamento dos certificados do monitor | Média | ✅ | **Certificado**: situação, versões e histórico, visualização e download do PDF |
| 15 | Notificação dos alunos pelo monitor | Média | ✅ | **Comunicado** (para a sala toda ou alunos específicos, com leituras, e edição que zera as leituras) e **Notificacao** (alerta gerado para cada destinatário) |
| 16 | Cadastro da assinatura dos certificados | Difícil | ✅ | **Assinatura** (nome, cargo, imagem opcional, prévia, alteração, remoção da imagem, exclusão); o certificado guarda uma cópia dela |
| 17 | Emissão automática dos certificados de monitoria | Difícil | ✅ | **Certificado**, **Aula**, **Monitor**: gerado automaticamente com as horas somadas, e só emitido de fato **com o aval da Coordenação** |
| 22 | Gerenciamento de processo seletivo | Média | ✅ | **ProcessoSeletivo**: criação, consulta, alteração, exclusão, busca e filtro pela Coordenação |

## 7. Decisões tomadas
1. **Emissão automática (17):** o certificado é gerado automaticamente com as horas somadas, mas **continua precisando do aval da Coordenação** antes de ser emitido.
2. **Entidades fora das 12 funcionalidades** (Feedbacks, Postagem Extra, candidaturas do Processo Seletivo, contexto Recomendação): **ficam no plano como estão**.
3. **Matéria e Assinatura:** **ficam no plano como estão**.
4. **Chat:** passa a ter **três formas**: entre usuários (individual), na postagem e geral da sala.

---

## Ordem de execução (quando aprovado)
1. **Limpar a tentativa anterior**, que ainda está no disco: apagar `ajudanois/docs/` e desfazer a mudança no `ajudanois/AGENTS.md` com `git checkout -- ajudanois/AGENTS.md`.
2. Para cada uma das 12 funcionalidades, seguir o processo do AGENTS.md: escrever a especificação em `docs/S/funcionalidades/F0XX.md`, mantendo a numeração do seu documento (F003, F006, F008…), depois os testes Gherkin e por último o modelo `.cml`, usando este plano como base.

## Verificação
- Cada uma das 12 funcionalidades aparece na tabela da seção 6 com pelo menos uma entidade.
- Nenhuma entidade depende de um contexto que vem depois do dela na tabela da seção 1.
- Quando os `.cml` forem escritos, validar com a skill `validar-modelo`. Isso exige Java e Maven, que hoje não estão instalados neste computador.
