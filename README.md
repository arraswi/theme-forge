# Theme Forge

Gerador de tokens CSS a partir de uma cor hexadecimal. Útil para iniciar a paleta de uma interface.

## Funcionalidades

- Aceita `#RGB` e `#RRGGBB`.
- Gera dez tons, do passo 50 ao 900, preservando a base no 500.
- Escolhe entre preto e branco para maximizar o contraste do texto sobre a base.
- Exporta CSS ou JSON, com nome personalizável.

## Rodar

Requer Node.js 22 ou superior. Sem dependências externas ou build.

```bash
npm start -- --color "#0a63ff"
npm start -- --color "#0a63ff" --name niyo --json
node bin/cli.js --color "#0a63ff" > examples/tokens.css
npm test
```

Use o comando direto com `node` ao redirecionar a saída para um arquivo CSS; assim o cabeçalho de execução do npm não entra no arquivo.

```css
:root {
  --brand-500: #0a63ff;
  /* Os outros tokens são incluídos na saída gerada. */
}
```

Veja `examples/uso.css` para aplicar os tokens. `node bin/cli.js --help` mostra ajuda; erros retornam código 1.

## API JavaScript/TypeScript

```js
import { generateTheme, contrastRatio } from './src/index.js';
const theme = generateTheme('#0a63ff', 'brand');
console.log(theme.css);
console.log(contrastRatio(theme.base, theme.onBase));
```

Declarações para TypeScript em `src/index.d.ts`.

## Como funciona e limites

Os tons misturam os canais sRGB com branco ou preto; a escala não é perceptualmente uniforme. O contraste usa luminância relativa sRGB. A seleção de texto compara apenas preto e branco sobre a cor base opaca; não certifica acessibilidade da interface ou dos outros tons. Transparência não é aceita.

## Estrutura

- `src/`: geração de cores, contraste e tipos.
- `bin/cli.js`: argumentos e saída.
- `test/`: casos de contraste, validação e integração da CLI.
- `examples/`: CSS gerado e exemplo de consumo.

## Ideias para evoluir

Adicionar escalas OKLCH e exportação para ferramentas de design. Não estão implementadas nesta versão.

## Licença

MIT. Veja `LICENSE`.
