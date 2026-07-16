# Mapa do Plantão — UPA de Humildes

Sistema digital para registro do **Mapa do Plantão** com envio direto via WhatsApp. Site estático, sem backend, pronto para publicação em **GitHub Pages**.

## Recursos

- Página inicial com seleção de turno (**Diurno** / **Noturno**)
- Data e hora automáticas
- Campos de equipe com botão **+ Adicionar**, gerando lista **numerada**
- Campos numéricos de fluxo e transferências
- Observação final em campo expansível
- **Envio via WhatsApp** (`wa.me`) com mensagem formatada
- Número do WhatsApp configurável (ícone de engrenagem), salvo no navegador
- Tema claro/escuro
- Indicador Online/Offline
- PWA (pode ser instalado na tela inicial)

## Como usar

1. Acesse `index.html`.
2. Toque em **Plantão Diurno** ou **Plantão Noturno**.
3. Preencha os campos. Nos campos de equipe/pacientes, digite o nome e toque em **Adicionar**.
4. Toque no **ícone de engrenagem** (topo direito) para definir o número do WhatsApp de destino (formato `55 + DDD + número`, só dígitos).
5. Toque em **Enviar via WhatsApp**.

## Publicação no GitHub Pages

1. Crie um repositório novo no GitHub (ex.: `mapa-plantao-upa`).
2. Envie todos os arquivos desta pasta para a branch `main`.
3. Em **Settings → Pages**, selecione:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / pasta `/root`
4. Aguarde alguns segundos. Seu site estará em:

   ```
   https://SEU-USUARIO.github.io/mapa-plantao-upa/
   ```

> O arquivo `.nojekyll` já está incluído para o GitHub Pages não processar como Jekyll.

### Publicação via linha de comando

```bash
git init
git add .
git commit -m "feat: mapa do plantão UPA de Humildes"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/mapa-plantao-upa.git
git push -u origin main
```

## Estrutura de arquivos

```
mapa-plantao-upa/
├── index.html          # Página inicial (seleção de turno)
├── plantao.html        # Formulário (Diurno/Noturno via ?turno=)
├── style.css           # Estilo (paleta saúde: navy + teal)
├── common.js           # Tema, status de rede
├── plantao.js          # Lógica do formulário
├── manifest.json       # Metadados PWA
├── .nojekyll           # Evita processamento Jekyll no GitHub Pages
├── README.md
└── icons/
    ├── favicon.svg
    ├── icon-192.svg
    └── icon-512.svg
```

## Personalização rápida

- **Nome da unidade**: edite o valor padrão em `plantao.html` (campo `#unidade`).
- **Campos**: adicione/remova itens nos arrays `STAFF_FIELDS`, `PATIENT_FIELDS`, `FLOW_FIELDS`, `TRANSFER_FIELDS` em `plantao.js`.
- **Cores**: ajuste as variáveis CSS em `:root[data-theme="dark"]` e `:root[data-theme="light"]` em `style.css`.
- **Número fixo do WhatsApp**: em `plantao.js`, substitua a leitura do `localStorage` por uma constante com o número desejado.

## Licença

MIT. Livre para uso e adaptação.
