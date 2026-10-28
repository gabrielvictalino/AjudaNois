# Funcionalidades oficiais

## F01 - Gerenciamento de postagens
O coordenador cadastra os tipos de postagem que professores e monitores podem usar nas salas. Cada tipo tem um nome e uma cor, e a cor identifica visualmente as postagens daquele tipo no mural da sala (por exemplo: Aula em vermelho, Atividade em azul).

Existem dois grupos de tipos:

- **Tipos do sistema**: Aula, Atividade, Comunicado, Material didático e Extra. Eles já vêm cadastrados. Aula, Atividade, Comunicado e Material didático têm comportamento próprio (a aula gera presença, a atividade recebe entregas, o comunicado controla leituras). O Extra é a postagem genérica, com título, texto e anexos, para o que não se encaixa nos outros tipos.
- **Tipos personalizados**: criados pelo coordenador, como "Evento", "Dica da semana", "Vídeo" ou "Enquete". Funcionam como a postagem Extra, com título, texto e anexos, mas com nome e cor próprios.

**Complexidade:** Média.

### Campos do tipo de postagem
| Campo | Obrigatório | Exemplo |
|---|---|---|
| Nome | sim | Aula |
| Cor | sim | `#D32F2F` |
| Descrição | não | Encontro ao vivo da monitoria |
| Ativo | sim (começa ativo) | sim |
| Do sistema | definido pelo sistema | sim (Aula) / não (Evento) |

### Regras de negócio

#### RN001 - Permissão
Somente o coordenador cria, altera, desativa e exclui tipos de postagem. Professores e monitores apenas escolhem um tipo ao publicar.

#### RN002 - Nome
O nome é obrigatório, tem no máximo 40 caracteres e não pode se repetir. A comparação ignora diferenças de maiúsculas e minúsculas, acentos e espaços nas pontas: "Aula" e " aula " são o mesmo nome.

#### RN003 - Cor
A cor é obrigatória e pode ser escolhida numa paleta ou num seletor livre. Ela é guardada em hexadecimal, no formato `#RRGGBB`. Tipos diferentes podem ter a mesma cor.

#### RN004 - Legibilidade
A cor do texto sobre a etiqueta do tipo (preto ou branco) é escolhida automaticamente pelo contraste com a cor de fundo, para que o nome continue legível.

#### RN005 - Tipos do sistema
Aula, Atividade, Comunicado, Material didático e Extra já vêm cadastrados, cada um com uma cor padrão. O coordenador pode alterar o nome exibido e a cor desses tipos, mas não pode desativá-los nem excluí-los.

#### RN006 - Exclusão
O coordenador pode excluir qualquer tipo personalizado, mesmo que ele tenha postagens. A exclusão pede confirmação e informa quantas postagens usam o tipo. As postagens já publicadas continuam na sala, exibindo o último nome e a última cor do tipo, com a indicação "tipo excluído". Depois da exclusão, não é mais possível criar postagens desse tipo, e o nome excluído pode ser usado por um novo tipo.

#### RN007 - Desativação
Um tipo personalizado pode ser desativado e reativado a qualquer momento. Um tipo desativado deixa de aparecer na hora de criar uma postagem, mas continua na lista de tipos. As postagens já publicadas continuam com o tipo, o nome e a cor dele.

#### RN008 - Alteração reflete nas postagens
Alterar o nome ou a cor de um tipo muda a aparência de todas as postagens daquele tipo, inclusive as antigas. Postagens de tipos excluídos não são afetadas, porque mantêm o nome e a cor do momento da exclusão.

#### RN009 - Uso na publicação
Toda postagem pertence a exatamente um tipo ativo no momento em que é publicada. Ao criar uma postagem personalizada, o autor escolhe um dos tipos personalizados ativos.

---

## F02 - Gerenciamento de processo seletivo
O professor cria processos seletivos para escolher monitores de uma matéria e define, já na criação, as salas do Classroom em que os monitores vão atuar. Os alunos se inscrevem respondendo ao formulário do processo (F03), desde que cumpram os requisitos do histórico acadêmico (F04). Depois, o professor avalia os candidatos, aprova os escolhidos e os aloca nas salas do processo. O aluno aprovado passa a ser monitor daquela matéria.

Nesta funcionalidade, "professor" significa professor ou coordenador.

Depende do cadastro de salas do Classroom (F05).

**Complexidade:** Difícil.

### Campos do processo seletivo
| Campo | Obrigatório | Exemplo |
|---|---|---|
| Título | sim | Seleção de monitores · 2027.1 |
| Matéria | sim | Algoritmos e estrutura de dados (00008) |
| Semestre | sim | 2027.1 |
| Vagas | sim | 2 |
| Início das inscrições | sim | 01/11/2026 |
| Fim das inscrições | sim | 20/11/2026 |
| Salas do Classroom | sim | Algoritmos · Turma A, Algoritmos · Turma B |
| Nota mínima na matéria | não | 7,0 |
| Descrição | não | Apoiar as monitorias de Algoritmos |
| Responsável | definido pelo sistema | quem criou o processo |

### Regras de negócio

#### RN001 - Permissão de gerenciamento
Somente professores e coordenadores criam, alteram, cancelam e excluem processos seletivos. O coordenador gerencia qualquer processo. O professor gerencia apenas os processos das matérias que leciona.

#### RN002 - Datas e vagas
A data de fim das inscrições não pode ser anterior à data de início. A quantidade de vagas deve ser um número inteiro maior que zero.

#### RN003 - Situação calculada pelas datas
Antes da data de início, o processo fica "Agendado". Entre o início e o fim, fica "Inscrições abertas". Depois do fim, fica "Em avaliação" até ser finalizado ou cancelado pelo professor.

#### RN004 - Alteração
Enquanto não houver inscritos, todos os campos podem ser alterados. Com inscritos, a matéria não pode mais mudar, e as vagas não podem ficar abaixo da quantidade de aprovados.

#### RN005 - Exclusão e cancelamento
Um processo sem inscritos pode ser excluído. Um processo com inscritos só pode ser cancelado, e os candidatos são notificados. Um processo finalizado não pode ser excluído nem cancelado.

#### RN006 - Inscrição
Somente alunos se inscrevem, e só enquanto as inscrições estão abertas. Cada aluno se inscreve uma única vez em cada processo. Um aluno que já é monitor ativo da matéria não pode se inscrever. O aluno precisa ter enviado o histórico acadêmico do semestre atual e ter sido aprovado na matéria do processo (F04). Se o processo tiver nota mínima, a média do aluno na matéria precisa ser igual ou maior que ela. Para concluir a inscrição, o aluno responde ao formulário do processo (F03).

#### RN007 - Cancelamento da inscrição
O aluno pode cancelar a própria inscrição enquanto as inscrições estão abertas. Depois de cancelar, ele pode se inscrever de novo, desde que as inscrições ainda estejam abertas.

#### RN008 - Avaliação dos candidatos
O professor só aprova ou reprova candidatos quando o processo está "Em avaliação". Ao avaliar, ele vê as respostas do formulário e o histórico do candidato. O número de aprovados não pode passar do número de vagas.

#### RN009 - Aprovação gera monitor
Ao ser aprovado, o aluno passa a ser monitor da matéria do processo, no semestre do processo.

#### RN010 - Salas do processo e alocação
Ao criar o processo, o professor escolhe uma ou mais salas do Classroom da matéria em que os monitores podem atuar. O professor só escolhe salas de que participa, e o coordenador escolhe qualquer sala da matéria. Ao aprovar um candidato, o professor escolhe em quantas e em quais dessas salas o monitor fica, sendo pelo menos uma. Ao ser alocado, o monitor passa a participar da sala.

#### RN011 - Finalização
O processo pode ser finalizado quando todos os candidatos tiverem sido avaliados. Ao finalizar, todos os candidatos recebem uma notificação com o resultado.

#### RN012 - Busca e filtros
Os processos podem ser buscados por título ou matéria e filtrados pela situação. O aluno vê apenas os processos com inscrições abertas e aqueles em que se inscreveu.

#### RN013 - Máximo de monitores da sala
Um monitor só pode ser alocado numa sala que ainda não atingiu o seu máximo de monitores, definido no cadastro da sala (F05).

#### RN014 - Lista de espera
Depois da avaliação, os candidatos não aprovados formam a lista de espera do processo. Ela é apenas para consulta: o professor vê o nome e a matrícula de cada aluno, junto com os dados que ele enviou (disciplinas aprovadas, médias e respostas do formulário). O sistema não chama ninguém da lista automaticamente.

#### RN015 - Inscrição única
O aluno só pode ter uma inscrição ativa por vez, contando todos os processos seletivos. Se tentar se inscrever num segundo processo, o sistema recusa a inscrição e informa em qual processo ele já está inscrito. Inscrições canceladas e reprovadas não contam: o aluno reprovado pode se inscrever em outro processo que ainda esteja com inscrições abertas.

---

## F03 - Formulário de inscrição do processo seletivo
O professor que gerencia o processo seletivo monta o formulário que o aluno responde ao se inscrever. As perguntas podem ser respondidas por escrito, marcando opções ou enviando um arquivo. O professor vê as respostas e os arquivos de cada candidato.

Nesta funcionalidade, "professor" significa professor ou coordenador.

**Complexidade:** Difícil.

### Tipos de pergunta
| Tipo | Como o aluno responde |
|---|---|
| Texto curto | uma linha de texto |
| Texto longo | um parágrafo de texto |
| Múltipla escolha | marca uma única opção |
| Caixas de seleção | marca uma ou mais opções |
| Envio de arquivo | envia um PDF |

### Regras de negócio

#### RN001 - Montagem
O professor que gerencia o processo monta o formulário. Cada pergunta tem enunciado, tipo e indicação de obrigatória, e pode ser reordenada ou removida.

#### RN002 - Opções
Perguntas de múltipla escolha e de caixas de seleção têm pelo menos duas opções.

#### RN003 - Arquivo
Perguntas de envio de arquivo aceitam somente PDF de até 5 MB. Outros formatos e arquivos maiores são recusados.

#### RN004 - Respostas obrigatórias
A inscrição só é enviada quando todas as perguntas obrigatórias foram respondidas.

#### RN005 - Bloqueio do formulário
O formulário não pode ser editado enquanto houver pelo menos um aluno inscrito no processo. Inscrições canceladas não contam: se todos os inscritos cancelarem, o professor volta a poder editar.

#### RN006 - Visualização das respostas
Somente o professor vê as respostas e os arquivos dos candidatos. O aluno vê apenas as próprias respostas.

#### RN007 - Formulário alterado durante o preenchimento
Cada vez que o formulário é salvo, ele ganha uma nova versão. Se o professor editar o formulário enquanto um aluno está respondendo, a resposta desse aluno não é aceita ao ser enviada. O sistema avisa que o formulário foi alterado e mostra a versão nova para o aluno responder novamente.

---

## F04 - Envio do histórico acadêmico
A cada semestre, o aluno envia o PDF do seu histórico acadêmico. O sistema extrai do arquivo as disciplinas com situação "Aprovado", com código, nome e média. Essas disciplinas definem em quais processos seletivos o aluno pode se inscrever: ele só pode ser monitor de uma matéria em que já foi aprovado.

**Complexidade:** Difícil.

### Semestres
| Semestre | Começa em | Termina em | Exemplo |
|---|---|---|---|
| 1º | 1º de janeiro | 31 de julho | 2027.1 |
| 2º | 1º de agosto | 31 de dezembro | 2026.2 |

### Dados extraídos de cada disciplina aprovada
| Campo | Exemplo |
|---|---|
| Código | 00008 |
| Nome da disciplina | ALGORITMOS E ESTRUTURA DE DADOS |
| Média | 7,86 |

### Regras de negócio

#### RN001 - Envio obrigatório por semestre
Para se inscrever em qualquer processo seletivo, o aluno precisa ter enviado o histórico no semestre atual. Um histórico enviado num semestre deixa de valer quando o próximo começa, em 1º de janeiro ou em 1º de agosto, e o aluno precisa enviar um novo.

#### RN002 - Formato do arquivo
Só é aceito o PDF do histórico emitido pela instituição, com texto selecionável. Se o arquivo não tiver a seção de disciplinas no formato esperado, o envio é recusado com uma mensagem explicando o motivo.

#### RN003 - Dono do histórico
A matrícula que aparece no PDF precisa ser igual à matrícula do aluno que está enviando. Se for diferente, o envio é recusado.

#### RN004 - Extração
De cada disciplina com situação "Aprovado", o sistema extrai o código, o nome e a média. As demais situações são descartadas. Se nenhuma disciplina aprovada for encontrada, o envio é recusado.

#### RN005 - Conferência pelo aluno
Antes de salvar, o aluno vê a lista de disciplinas extraídas, com as médias, e confirma o envio.

#### RN006 - Reenvio
O aluno pode reenviar o histórico dentro do mesmo semestre. O novo envio substitui o anterior, e as inscrições já feitas continuam valendo.

#### RN007 - Requisito para inscrição
O aluno só pode se inscrever num processo seletivo se o código da matéria do processo estiver entre as disciplinas aprovadas do seu histórico do semestre atual. Se o processo tiver nota mínima, a média do aluno nessa disciplina precisa ser igual ou maior que ela.

#### RN008 - Visualização pelo professor
Ao avaliar um candidato, o professor ou coordenador vê as disciplinas aprovadas e as médias do histórico do candidato, e pode abrir o PDF original.

---

## F05 - Gerenciamento de salas
O professor ou o coordenador cria as salas do Classroom, onde a monitoria acontece. Cada sala pertence a uma matéria e reúne professores, monitores e alunos. Os alunos entram na sala por convite por e-mail, por código ou por QR Code. Uma sala que não é mais usada pode ser arquivada, e o coordenador pode excluí-la, com prazo de 30 dias para restaurar.

Nesta funcionalidade, "professor" significa professor ou coordenador. Os monitores entram na sala pelo processo seletivo (F02).

**Complexidade:** Difícil.

### Campos da sala
| Campo | Obrigatório | Exemplo |
|---|---|---|
| Nome | sim | Algoritmos · Turma A |
| Matéria | sim | 00008 · Algoritmos e estrutura de dados |
| Descrição | não | Monitoria às terças e quintas |
| Professores | sim (pelo menos 1) | Helena, Marcos |
| Máximo de monitores | sim | 2 |
| Código de convite | gerado pelo sistema | ALG-7K2Q |
| Criada por | definido pelo sistema | Helena |
| Situação | definido pelo sistema | Ativa, Arquivada ou Excluída |

### Abas
| Aba | O que mostra | Quem vê |
|---|---|---|
| Ativas | salas em uso | professores e coordenadores |
| Arquivadas | salas arquivadas, somente para leitura | professores e coordenadores |
| Excluídas recentemente | salas excluídas há até 30 dias | somente coordenadores |

### Regras de negócio

#### RN001 - Permissão
Somente professores e coordenadores criam salas. O coordenador edita e arquiva qualquer sala. O professor edita e arquiva apenas as salas de que participa.

#### RN002 - Nome
O nome é obrigatório, tem no máximo 60 caracteres e não precisa ser único: duas salas podem ter o mesmo nome.

#### RN003 - Matéria
Toda sala pertence a uma matéria, identificada pelo código (ex.: 00008). O professor só cria salas das matérias que leciona, e o coordenador, de qualquer matéria. A matéria não pode mais ser alterada depois que a sala tiver monitores alocados ou estiver vinculada a um processo seletivo.

#### RN004 - Professores da sala
Quem cria a sala entra nela automaticamente como professor. Outros professores, de qualquer matéria, podem ser adicionados ou removidos depois, mas a sala sempre precisa ter pelo menos um professor.

#### RN005 - Máximo de monitores
Toda sala começa com zero monitores, e não existe número mínimo: uma sala pode funcionar sem monitores. O professor define o máximo de monitores da sala, um número inteiro maior que zero, e pode alterá-lo a qualquer momento. Se o máximo for reduzido para menos que o número atual de monitores, nenhum monitor é removido, mas novas alocações ficam bloqueadas até a sala voltar ao limite. O máximo e a ocupação são visíveis apenas para professores e coordenadores.

#### RN006 - Código de convite
Ao criar a sala, o sistema gera um código de convite único. O professor pode gerar um código novo, o que invalida o código e o QR Code anteriores.

#### RN007 - Entrada por código e QR Code
O aluno entra na sala digitando o código de convite ou lendo o QR Code da sala, que leva ao mesmo código. Um código inválido, antigo ou de uma sala arquivada ou excluída é recusado com uma mensagem explicando o motivo.

#### RN008 - Convite por e-mail
O professor convida alunos cadastrados pelo e-mail, vários de uma vez. O convite fica pendente até o aluno aceitar ou recusar e expira em 7 dias. Não é possível convidar quem já participa da sala nem quem já tem um convite pendente. Se o aluno entrar pelo código, o convite pendente dele é considerado aceito.

#### RN009 - Participação única
O aluno não pode entrar duas vezes na mesma sala. Se tentar entrar numa sala de que já participa, o sistema avisa.

#### RN010 - Saída e remoção
O aluno pode sair da sala, e o professor pode removê-lo. Em ambos os casos, o aluno perde o acesso, mas o histórico dele (entregas, presenças, mensagens) é preservado e volta se ele entrar de novo.

#### RN011 - Arquivamento
O professor pode arquivar e desarquivar a sala a qualquer momento. A sala arquivada vai para a aba Arquivadas e fica somente para leitura: os participantes continuam vendo o conteúdo, mas a sala não aceita novas postagens, mensagens, entradas de alunos, convites nem alocação de monitores, e não aparece para escolha em novos processos seletivos.

#### RN012 - Exclusão
Somente o coordenador exclui salas. A sala excluída vai para a aba Excluídas recentemente e deixa de aparecer para os participantes. Durante 30 dias, o coordenador pode restaurá-la, e ela volta para a situação anterior (ativa ou arquivada). Depois de 30 dias, a sala é apagada definitivamente.

#### RN013 - Sala vinculada a processo seletivo
Uma sala não pode ser arquivada nem excluída enquanto estiver vinculada a um processo seletivo com inscrições abertas ou em avaliação.

#### RN014 - Busca e filtros
As salas podem ser buscadas por nome, matéria ou código da matéria dentro de cada aba. O professor vê as salas de que participa, e o coordenador vê todas.

---

## F06 - Atividades
A atividade é um tipo de postagem do sistema (F01) com regras próprias. O professor ou o monitor da sala publica a atividade com questões, pontos e prazo. Cada aluno entrega uma única vez, inclusive com atraso. A atividade é corrigida automaticamente quando todas as questões são de marcar e manualmente nos outros casos, e o aluno recebe uma nota de 0 a 10.

Nesta funcionalidade, "professor" significa professor ou coordenador.

**Complexidade:** Difícil.

### Tipos de questão
As questões usam os mesmos tipos do formulário de inscrição (F03).

| Tipo | Como é corrigida |
|---|---|
| Múltipla escolha | pelo gabarito (uma alternativa correta) |
| Caixas de seleção | pelo gabarito (uma ou mais alternativas corretas) |
| Texto curto | pelo professor ou monitor |
| Texto longo | pelo professor ou monitor |
| Envio de PDF (até 5 MB) | pelo professor ou monitor |

### Campos da atividade
| Campo | Obrigatório | Exemplo |
|---|---|---|
| Título | sim | Lista 03 · Estruturas de repetição |
| Instruções | não | Resolva as questões e explique seu raciocínio |
| Prazo (data e hora) | sim | 25/11/2026 às 23:59 |
| Questões | sim (pelo menos 1) | 2 de marcar e 1 escrita |
| Pontos de cada questão | sim | 2,5 |
| Gabarito | sim, nas questões de marcar | alternativa "do-while" |
| Aceita entregas atrasadas | sim | sim |
| Penalidade por atraso | sim, se aceitar atraso | nenhuma, percentual por dia ou nota máxima |
| Percentual por dia de atraso | sim, se a penalidade for por dia | 10% |
| Nota máxima com atraso | sim, se a penalidade for nota máxima | 8,0 |
| Prazo final para atrasos | não | 30/11/2026 às 23:59 |

### Opções de entrega atrasada
| Opção | Como funciona | Exemplo |
|---|---|---|
| Não aceitar | depois do prazo, a entrega é bloqueada | — |
| Aceitar sem penalidade | a entrega atrasada vale a nota normal | nota 9,0 → 9,0 |
| Percentual por dia | a nota perde um percentual para cada dia de atraso | 10% por dia, 2 dias de atraso: 9,0 → 7,2 |
| Nota máxima | a entrega atrasada vale no máximo uma nota fixa, não importa quando foi enviada | máximo 8,0: 9,0 → 8,0 e 6,5 → 6,5 |
| Prazo final (opcional) | combinado com qualquer opção que aceite atraso, define até quando a entrega atrasada é aceita | só até 30/11 às 23:59 |

### Situação da entrega
| Situação | Quando |
|---|---|
| Pendente | o aluno ainda não entregou e o prazo não terminou |
| Aguardando correção | o aluno entregou e há questões escritas ou de PDF sem pontos |
| Corrigida | todas as questões têm pontos e a nota foi liberada |
| Não entregue | o prazo terminou e o aluno não entregou (sem nota) |
| Atrasada | marcação adicional de uma entrega feita depois do prazo |

### Regras de negócio

#### RN001 - Quem publica
Somente os professores e os monitores da sala publicam, editam e excluem atividades. Só é possível publicar em salas ativas (F05).

#### RN002 - Pontos obrigatórios
Toda atividade tem pelo menos uma questão, e cada questão precisa ter o número de pontos que vale, maior que zero. Sem isso, a atividade não é publicada. A nota do aluno é calculada como pontos obtidos ÷ total de pontos × 10, com duas casas decimais.

#### RN003 - Gabarito
Questões de múltipla escolha e de caixas de seleção precisam ter pelo menos duas opções e o gabarito marcado. Nas caixas de seleção, o aluno só ganha os pontos da questão se marcar exatamente as alternativas corretas.

#### RN004 - Entrega única
Somente alunos ativos da sala entregam a atividade, e cada aluno entrega uma única vez, respondendo todas as questões. Depois de entregue, o aluno não pode alterar as respostas.

#### RN005 - Aceitação de entregas atrasadas
Ao criar a atividade, o professor ou o monitor escolhe se ela aceita entregas atrasadas. Se não aceitar, nenhuma entrega é recebida depois do prazo. Se aceitar, a entrega feita depois do prazo é recebida e marcada como "Atrasada" para o aluno e para o professor. As regras de atraso da atividade ficam visíveis para o aluno antes de ele entregar.

#### RN015 - Penalidade por atraso
Quando a atividade aceita entregas atrasadas, o professor ou o monitor escolhe uma única penalidade:

- **Nenhuma:** a entrega atrasada vale a nota normal.
- **Percentual por dia:** a nota perde um percentual, um número inteiro de 1 a 100, para cada dia de atraso. Cada período de 24 horas iniciado depois do prazo conta como um dia: entregar 1 hora depois do prazo já conta como 1 dia. A nota final é a nota calculada × (1 − percentual × dias de atraso) e nunca fica abaixo de zero.
- **Nota máxima:** a entrega atrasada vale no máximo uma nota fixa, de 0 a 10, independentemente de quantos dias de atraso. Se a nota calculada for menor que esse limite, ela continua igual.

A penalidade é aplicada sobre a nota calculada pelos pontos, depois da correção automática ou manual. O aluno e o professor veem a nota antes da penalidade, o desconto aplicado e a nota final.

#### RN016 - Prazo final para atrasos
Quando a atividade aceita entregas atrasadas, o professor ou o monitor pode definir um prazo final, posterior ao prazo normal, que vale com qualquer penalidade. Depois do prazo final, nenhuma entrega é recebida. Sem prazo final, entregas atrasadas são aceitas a qualquer momento.

#### RN017 - Alteração das regras de atraso
As regras de atraso (aceitar ou não, penalidade, percentual e nota máxima) podem ser alteradas enquanto a atividade não tiver nenhuma entrega atrasada. Depois disso, elas ficam bloqueadas, para que todos os atrasados sejam avaliados da mesma forma. O prazo final para atrasos pode ser prorrogado a qualquer momento.

#### RN006 - Nota automática
A nota só sai automaticamente quando todas as questões da atividade são de marcar (múltipla escolha ou caixas de seleção). Nesse caso, ela fica disponível para o aluno no momento da entrega.

#### RN007 - Correção manual
Se a atividade tiver pelo menos uma questão escrita ou de envio de PDF, não existe nota automática. O professor ou o monitor dá os pontos de cada questão escrita ou de PDF, de zero até o valor da questão, e pode deixar um comentário de correção. As questões de marcar continuam pontuadas pelo gabarito. A nota só é liberada para o aluno quando todas as questões da entrega tiverem pontos.

#### RN008 - Revisão da correção
O professor ou o monitor pode revisar a correção depois de concluída. Quando a nota muda, o aluno é notificado.

#### RN009 - Edição da atividade
Depois da primeira entrega, as questões, os pontos e o gabarito não podem mais ser alterados. O título, as instruções e o prazo continuam editáveis, e o prazo pode ser prorrogado. As regras de atraso seguem a RN017.

#### RN010 - Quem não entregou
Depois do prazo, quem não entregou fica com a situação "Não entregue" e sem nota, o que é diferente de nota zero. Esses alunos não entram na média da turma. Se a atividade aceitar entregas atrasadas e o aluno entregar dentro do prazo final, quando houver, ele passa a ter nota, com a penalidade de atraso aplicada.

#### RN011 - Exclusão
Uma atividade sem entregas pode ser excluída. Uma atividade com entregas não pode ser excluída, para preservar as notas.

#### RN012 - Acompanhamento
O professor e o monitor veem a lista de alunos da sala com a situação de cada entrega, podendo filtrar por aguardando correção, corrigida, atrasada, pendente e não entregue. Também veem quantos alunos entregaram, a média das entregas corrigidas e a porcentagem de acerto de cada questão de marcar.

#### RN013 - Privacidade das notas
Cada aluno vê apenas a própria entrega, a própria nota, os pontos de cada questão e o comentário de correção. As notas dos colegas não aparecem para ele.

#### RN014 - Exibição no mural
A atividade aparece no mural da sala com a etiqueta e a cor do tipo "Atividade" (F01), junto com o prazo e a situação da entrega do aluno.

### Fica para depois
A atividade durante a aula, que gera presença, depende da funcionalidade de aulas, que ainda não existe. Por enquanto, todas as atividades funcionam como extraclasse.

---

## F07 - Publicação de postagens
Coordenadores, professores e monitores publicam postagens no mural da sala. Ao publicar, a pessoa escolhe o tipo da postagem (F01), e cada tipo exige campos próprios. Os participantes da sala veem as postagens em ordem, podendo filtrar por tipo.

**Complexidade:** Média.

### Campos por tipo
| Tipo | Obrigatórios | Opcionais | Como aparece no mural |
|---|---|---|---|
| Aula | título, data, horário de início, duração, link externo (Google Meet ou similar) | conteúdo | data, horário, duração e botão "Entrar na aula" |
| Atividade | título, prazo, questões, pontos, gabarito e regras de atraso (F06) | instruções | prazo, número de questões, total de pontos e regra de atraso |
| Comunicado | título, mensagem, destinatários (sala toda ou alunos específicos) | urgente, fixar no topo | destinatários, marca de urgente e leituras |
| Material didático | título, unidade ou assunto, arquivo ou link (pelo menos um) | descrição | unidade, arquivo para baixar e link |
| Extra | título, texto | link, anexo | texto, link e anexo |
| Tipos personalizados | os mesmos do Extra | os mesmos do Extra | como o Extra, com o nome e a cor do tipo |

### Regras de negócio

#### RN001 - Quem publica
Somente coordenadores, professores e monitores publicam postagens. O coordenador publica em qualquer sala, o professor nas salas de que participa e o monitor nas salas em que está alocado. Alunos apenas visualizam. Só é possível publicar em salas ativas (F05).

#### RN002 - Tipo da postagem
Toda postagem tem exatamente um tipo, escolhido entre os tipos ativos (F01). O tipo define os campos exigidos, a etiqueta e a cor da postagem.

#### RN003 - Campos obrigatórios
A postagem só é publicada quando todos os campos obrigatórios do seu tipo estão preenchidos. O título tem no máximo 120 caracteres. Se faltar algum campo, o sistema informa quais.

#### RN004 - Aula
A aula exige data, horário de início, duração maior que zero e um link externo válido (http ou https). A aula acontece fora do sistema: só o link é guardado, e o chat ou a gravação do serviço externo não são trazidos para a aplicação.

#### RN005 - Atividade
A atividade segue as regras da F06. Ela é publicada no mural com o prazo, o número de questões, o total de pontos e a regra de atraso visíveis para os alunos.

#### RN006 - Comunicado
O comunicado é enviado para a sala toda ou para alunos específicos da sala, escolhidos na publicação. Quem não é destinatário não vê o comunicado. O comunicado pode ser marcado como urgente. Os alunos marcam o comunicado como lido, e o autor, os professores e o coordenador veem quantas leituras ele teve.

#### RN007 - Material didático
O material didático exige a unidade ou o assunto e pelo menos um arquivo ou um link. O arquivo pode ser de qualquer formato, com até 10 MB.

#### RN008 - Extra e tipos personalizados
O Extra e os tipos personalizados exigem texto. O link e o anexo são opcionais, e o anexo pode ser de qualquer formato, com até 10 MB.

#### RN009 - Links
Todo link informado numa postagem precisa ser um endereço válido, começando com http ou https.

#### RN010 - Fixar no topo
Somente comunicados podem ser fixados no topo do mural. Os comunicados fixados aparecem antes das demais postagens.

#### RN011 - Edição
Somente o autor edita a própria postagem. O tipo da postagem não pode ser alterado, e a edição segue as mesmas validações da publicação. Uma postagem editada mostra a data e a hora da última edição. Editar um comunicado zera as leituras, e os destinatários precisam marcá-lo como lido de novo. A edição de atividades segue também a RN009 da F06.

#### RN012 - Exclusão
O autor exclui as próprias postagens. Professores e coordenadores excluem qualquer postagem da sala. A exclusão de atividades segue também a RN011 da F06: uma atividade com entregas não pode ser excluída.

#### RN013 - Visualização do mural
Somente os participantes ativos da sala veem o mural. As postagens aparecem da mais recente para a mais antiga, com os comunicados fixados primeiro. O mural pode ser filtrado por tipo de postagem.

### Comentários
Os comentários em cada postagem estão especificados na F08.

---

## F08 - Canal de comunicação
Os participantes de uma sala conversam de três formas: em particular, nos comentários de cada postagem e no chat geral da sala. As mensagens têm texto e podem ter um anexo. Toda mensagem pode responder outra, mostrando um trecho da mensagem original. O autor edita e exclui as próprias mensagens, e o remetente vê quem já leu.

**Complexidade:** Difícil.

### Os três canais
| Canal | Como começa | Quem participa |
|---|---|---|
| Individual | clicando no avatar de uma pessoa, na lista de participantes da sala | exatamente duas pessoas que participam de uma mesma sala |
| Comentários da postagem | criado automaticamente junto com cada postagem (F07) | quem pode ver a postagem |
| Chat geral da sala | criado automaticamente junto com a sala (F05) | todos os participantes ativos da sala |

### Campos da mensagem
| Campo | Obrigatório | Exemplo |
|---|---|---|
| Texto | sim, se não houver anexo | "Professora, posso entregar a lista amanhã?" |
| Anexo | não (um arquivo de até 10 MB) | exercicio-resolvido.pdf |
| Resposta a | não | trecho da mensagem que está sendo respondida |
| Autor | definido pelo sistema | Ana Souza |
| Enviada em | definido pelo sistema | 05/11 às 14:32 |
| Editada em | definido pelo sistema | 05/11 às 14:40 |
| Leituras | definido pelo sistema | lida por Helena às 14:35 |

### Regras de negócio

#### RN001 - Lista de participantes
Cada sala mostra os avatares de todos os participantes ativos, separados em professores, monitores e alunos. Clicar num avatar abre a conversa individual com aquela pessoa.

#### RN002 - Conversa individual
Existe uma única conversa individual para cada par de pessoas, mesmo que elas participem de várias salas em comum. Qualquer participante pode iniciar conversa com qualquer outro, inclusive aluno com aluno, desde que os dois participem de pelo menos uma mesma sala ativa. Ninguém conversa individualmente consigo mesmo.

#### RN003 - Comentários da postagem
Toda postagem tem a sua conversa de comentários, que aparece no rodapé do cartão no mural. Só comenta e lê os comentários quem pode ver a postagem. Por exemplo, num comunicado para alunos específicos, comentam só esses alunos, os professores e os monitores da sala.

#### RN004 - Chat geral da sala
Toda sala tem um chat geral, criado junto com ela, de que participam todos os participantes ativos.

#### RN005 - Conteúdo da mensagem
A mensagem precisa ter texto, anexo ou os dois. O texto tem até 2.000 caracteres, e os espaços no começo e no fim são ignorados. O anexo é um único arquivo, de qualquer formato, com até 10 MB. Quem pode ler a conversa pode baixar o anexo, e imagens e PDFs têm prévia.

#### RN006 - Responder mensagem
Qualquer mensagem pode responder outra mensagem da mesma conversa. A resposta mostra o autor e um trecho da original, e clicar no trecho leva até ela.

#### RN007 - Edição
Só o autor edita a própria mensagem, podendo alterar o texto e trocar ou remover o anexo, desde que a mensagem continue com texto ou anexo. A mensagem passa a mostrar "editada", e as leituras são zeradas: quem já tinha lido precisa ler de novo.

#### RN008 - Exclusão
Só o autor exclui a própria mensagem. No lugar dela aparece "Mensagem apagada", para que as respostas a ela continuem fazendo sentido.

#### RN009 - Confirmação de leitura
Na conversa individual, o remetente vê "Lida" quando a outra pessoa abre a conversa. Nos comentários e no chat da sala, o remetente vê quantas pessoas leram e quem são.

#### RN010 - Mensagens não lidas
Cada conversa mostra quantas mensagens novas ainda não foram lidas.

#### RN011 - Moderação
Professores e coordenadores podem ocultar mensagens dos comentários e do chat da sala. No lugar delas aparece "Mensagem ocultada pela moderação". Conversas individuais não são moderadas.

#### RN012 - Sala arquivada ou excluída
Numa sala arquivada (F05), os comentários e o chat da sala ficam somente para leitura. Numa sala excluída, eles ficam inacessíveis até a sala ser restaurada. Conversas individuais continuam funcionando se as duas pessoas ainda tiverem outra sala ativa em comum. Se não tiverem, ficam somente para leitura.

#### RN013 - Saída da sala
Quem sai ou é removido da sala perde o acesso aos comentários e ao chat dela. As mensagens que a pessoa enviou continuam no histórico.

#### RN014 - Notificações
A pessoa recebe uma notificação quando chega uma mensagem individual e quando alguém responde uma mensagem sua.

#### RN015 - Ordem das mensagens
As mensagens aparecem em ordem cronológica, da mais antiga para a mais nova, e a conversa abre na primeira mensagem não lida.

### Fica de fora (por enquanto)
- mais de um anexo por mensagem;
- menções com @;
- reações (curtir);
- conversas em grupo além do chat geral da sala.

---

## F09 - Certificados de monitoria
Ao fim de cada semestre, o sistema gera automaticamente um certificado para cada monitoria concluída. O professor da matéria ou a coordenação dá o aval, e o certificado sai com a assinatura cadastrada e as horas complementares definidas pela coordenação. O monitor acompanha, visualiza e baixa os próprios certificados, e qualquer pessoa pode verificar a autenticidade pelo código público.

Esta funcionalidade reúne o cadastro da assinatura, a configuração de horas, a emissão e o gerenciamento dos certificados pelo monitor.

**Complexidade:** Difícil.

### Configuração de horas (coordenação)
| Campo | Exemplo | Significado |
|---|---|---|
| Horas por monitoria | 10 | toda monitoria aprovada vale esse número de horas complementares no certificado |
| Monitorias que rendem horas | 2 | o aluno pode fazer quantas monitorias quiser, mas só as primeiras, até esse limite, rendem horas |

Exemplo: com 10 horas e limite 2, um aluno que faz três monitorias ganha 10 horas na primeira, 10 horas na segunda e recebe o certificado da terceira sem horas.

### Ciclo de vida do certificado
| Situação | Quando |
|---|---|
| Aguardando aval | gerado automaticamente no fim do semestre |
| Disponível | aprovado pelo professor ou pela coordenação |
| Recusado | recusado com justificativa; pode ser reaberto para nova análise |
| Cancelado | cancelado pela coordenação ou substituído por uma reemissão |

### Campos do certificado
| Campo | Exemplo |
|---|---|
| Código público | AN-2027-004 |
| Monitor | Lucas Costa |
| Matéria | 00008 · Algoritmos e estrutura de dados |
| Semestre | 2026.2 |
| Salas em que atuou | Algoritmos · Turma A |
| Horas complementares | 10 horas, ou "sem horas complementares" |
| Data de emissão | 05/01/2027 |
| Cópia da assinatura | Marina Oliveira · Coordenadora de monitorias |
| Aprovado por | Helena |
| Versão | 1 |
| Histórico | geração, aprovação, recusa, reabertura, reemissão e cancelamento, com data e responsável |

### Regras de negócio

#### RN001 - Assinatura
Existe uma única assinatura dos certificados no sistema, cadastrada pela coordenação, com nome, cargo e uma imagem opcional em PNG ou JPG de até 500 KB. A coordenação vê uma prévia de como a assinatura aparece no certificado. Sem imagem, o certificado mostra o nome escrito.

#### RN002 - Alteração e exclusão da assinatura
A coordenação pode alterar a assinatura, remover só a imagem ou excluí-la. Sem assinatura cadastrada, nenhum certificado pode ser aprovado nem reemitido. Os certificados já emitidos guardam uma cópia da assinatura usada e não mudam quando ela é alterada ou excluída.

#### RN003 - Configuração de horas
Somente a coordenação define as horas por monitoria e o número de monitorias que rendem horas, ambos números inteiros maiores que zero, e pode alterá-los a qualquer momento. Ninguém digita horas manualmente num certificado.

#### RN004 - Horas do certificado
Ao ser aprovado, o certificado copia as horas por monitoria vigentes naquele momento. Alterar a configuração depois não muda os certificados já emitidos.

#### RN005 - Limite de monitorias com horas
O limite vale para todo o curso do aluno. As horas são dadas às primeiras monitorias do aluno, pela ordem de aprovação dos certificados, até o limite. As monitorias além do limite também recebem certificado, com a indicação "Sem horas complementares: limite de monitorias atingido".

#### RN006 - Geração automática
No último dia do semestre (31 de julho ou 31 de dezembro), o sistema gera um certificado "Aguardando aval" para cada monitoria do semestre, ou seja, para cada aluno aprovado num processo seletivo (F02) daquele semestre, com a matéria e as salas em que ele atuou.

#### RN007 - Quem dá o aval
A coordenação aprova ou recusa qualquer certificado. O professor aprova ou recusa os certificados das matérias que leciona. Antes de decidir, a pessoa vê quantas horas o certificado vai receber e quantas monitorias com horas o aluno já usou.

#### RN008 - Aprovação
Ao ser aprovado, o certificado passa para "Disponível" e recebe o código público, a data de emissão, as horas (RN004 e RN005), a cópia da assinatura atual e o nome de quem aprovou. Uma observação é opcional.

#### RN009 - Recusa e reabertura
Para recusar um certificado, a justificativa é obrigatória. O monitor vê a justificativa. O professor ou a coordenação pode reabrir um certificado recusado, que volta para "Aguardando aval".

#### RN010 - Um certificado ativo por vez
Existe no máximo um certificado "Aguardando aval" ou "Disponível" para cada monitor, matéria e semestre.

#### RN011 - Reemissão
A coordenação pode reemitir um certificado disponível. A versão atual é cancelada, e uma nova versão é emitida com novo código, a assinatura atual e as horas da configuração atual. A reemissão continua ocupando a mesma vaga no limite de monitorias com horas.

#### RN012 - Cancelamento
A coordenação pode cancelar um certificado disponível sem reemitir. A versão cancelada continua no histórico, mas o download fica bloqueado, e a vaga no limite de monitorias com horas do aluno é liberada.

#### RN013 - Visão do monitor
O monitor vê os próprios certificados com a situação de cada um. Enquanto o certificado está "Aguardando aval", ele vê que está em análise, sem download. Quando está "Disponível", ele visualiza e baixa o PDF. Quando está "Recusado", ele vê a justificativa. O monitor também vê quantas monitorias com horas já usou (por exemplo, "1 de 2") e o total de horas obtidas.

#### RN014 - PDF do certificado
O certificado é um PDF de uma página em paisagem, com o nome do monitor, a matéria, o semestre, as salas, as horas complementares (ou a indicação de que não há horas), a data de emissão, a versão, a assinatura e o código público.

#### RN015 - Verificação pública
Qualquer pessoa, sem login, digita o código do certificado e vê se ele é válido, cancelado ou inexistente. Para um certificado válido, aparecem o nome do monitor, a matéria, o semestre, as horas e a data de emissão.

#### RN016 - Histórico
Cada certificado guarda o histórico de geração, aprovação, recusa, reabertura, reemissão e cancelamento, com a data e o responsável. O histórico é visível para o professor da matéria e para a coordenação.

#### RN017 - Notificações
O monitor é notificado quando o certificado é aprovado, recusado, reemitido ou cancelado.
