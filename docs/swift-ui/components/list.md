# List Components

Componentes para exibir coleções de dados.

## `List`

Um container que apresenta linhas de dados dispostas em uma única coluna. Suporta seleção e estilos nativos.

**Props:**
- `selection`: `(string | number)[]` - Array de IDs dos itens selecionados (usado com modificador `tag` nos itens).
- `onSelectionChange`: `(selection: (string | number)[]) => void` - Callback chamado quando a seleção muda.
- `children`: `ReactNode`

**Modificadores Comuns:**
- `listStyle(style)`: `'automatic'`, `'plain'`, `'inset'`, `'insetGrouped'`, `'grouped'`, `'sidebar'`.
- `refreshable(asyncCallback)`: Adiciona pull-to-refresh.

```tsx
<List modifiers={[listStyle('insetGrouped')]}>
  {/* Seções e Itens */}
</List>
```

---

## `Section`

Agrupa conteúdo dentro de uma Lista ou Formulário.

**Props:**
- `title`: `string` - Título do cabeçalho (texto simples).
- `header`: `ReactNode` - Componente customizado para o cabeçalho.
- `footer`: `ReactNode` - Componente customizado para o rodapé.
- `isExpanded`: `boolean` - Controla expansão (apenas estilo `sidebar` no iOS 17+).
- `onIsExpandedChange`: `(expanded: boolean) => void` - Callback de expansão.
- `children`: `ReactNode`

```tsx
<Section title="Configurações Gerais" footer={<Text>Rodapé explicativo</Text>}>
  <Toggle label="Wi-Fi" isOn={true} />
</Section>
```

---

## `List.ForEach`

Usado para iterar sobre dados dinâmicos dentro de uma `<List>`. Permite ações de edição como deletar e mover.

**Props:**
- `data`: `T[]` (implícito via children map ou uso direto).
- `onDelete`: `(indices: number[]) => void` - Habilita "swipe to delete".
- `onMove`: `(from: number[], to: number) => void` - Habilita reordenação.

```tsx
<List>
  <List.ForEach
    onDelete={(indices) => console.log('Deletar', indices)}
    onMove={(from, to) => console.log('Mover', from, to)}
  >
    {items.map(item => (
      <Text key={item.id}>{item.title}</Text>
    ))}
  </List.ForEach>
</List>
```
