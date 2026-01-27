# Form & Input Components

Componentes para entrada de dados.

## `Form`

Container padrão para agrupamento de controles de entrada. Adapta-se automaticamente à plataforma (ex: estilo grouped no iOS).

**Props:**
- `children`: `ReactNode`

```tsx
<Form>
  <Section title="Dados Pessoais">
    <TextField placeholder="Nome" />
  </Section>
</Form>
```

---

## `TextField`

Campo de entrada de texto.

**Props:**
- `defaultValue`: `string` - Valor inicial (componente não controlado).
- `placeholder`: `string` - Texto de dica.
- `onChangeText`: `(text: string) => void` - Callback de texto alterado.
- `onSubmit`: `(text: string) => void` - Callback ao pressionar Return.
- `keyboardType`: `'default' | 'email-address' | 'numeric' ...` - Tipo de teclado.
- `multiline`: `boolean` - Se permite múltiplas linhas.
- `numberOfLines`: `number` - Número de linhas visíveis (se multiline).
- `ref`: `Ref<TextFieldRef>` - Permite foco imperativo (`focus()`, `blur()`).
- `allowNewlines`: `boolean` - Se a tecla return insere nova linha (default: true).

**Modificadores Úteis:**
- `submitLabel('go' | 'search' | 'done' ...)`: Altera o texto do botão de retorno.
- `textFieldStyle('roundedBorder' | 'plain')`.

```tsx
const ref = useRef<TextFieldRef>(null);

<TextField
  placeholder="Email"
  keyboardType="email-address"
  ref={ref}
  modifiers={[submitLabel('next')]}
/>
```

---

## `SecureField`

Variação do TextField para senhas (texto oculto). Possui props similares ao `TextField`.

```tsx
<SecureField placeholder="Senha" onChangeText={setPswd} />
```

---

## `Toggle`

Switch para valores booleanos.

**Props:**
- `isOn`: `boolean` - Estado atual.
- `onIsOnChange`: `(isOn: boolean) => void` - Callback de mudança.
- `label`: `string` - Texto do label.
- `systemImage`: `SFSymbol` - Ícone opcional.
- `children`: `ReactNode` - Label customizado.

```tsx
<Toggle
  isOn={isEnabled}
  onIsOnChange={setEnabled}
  label="Notificações"
  systemImage="bell.fill"
/>
```

---

## `Picker`

Seletor de opções.

**Props:**
- `selection`: `string | number` - Valor selecionado.
- `onSelectionChange`: `(val: T) => void` - Callback.
- `label`: `string` - Rótulo.
- `children`: `ReactNode` - Opções (geralmente `Text` com modificador `tag`).

**Modificadores:**
- `pickerStyle('menu' | 'wheel' | 'segmented' | 'palette')`.

```tsx
<Picker
  selection={selected}
  onSelectionChange={setSelected}
  modifiers={[pickerStyle('segmented')]}
>
  <Text modifiers={[tag(0)]}>Opção A</Text>
  <Text modifiers={[tag(1)]}>Opção B</Text>
</Picker>
```

---

## `Button`

Botão nativo.

**Props:**
- `label`: `string` - Texto.
- `systemImage`: `SFSymbol` - Ícone.
- `onPress`: `() => void` - Ação.
- `role`: `'default' | 'cancel' | 'destructive'` - Semântica (ex: destructive deixa o texto vermelho).
- `children`: `ReactNode` - Conteúdo customizado (se não usar label).

**Modificadores:**
- `buttonStyle('bordered' | 'borderedProminent' | 'plain')`.
- `controlSize('large' | 'regular' | 'small')`.

```tsx
<Button
  label="Deletar Conta"
  role="destructive"
  onPress={handleDelete}
  modifiers={[buttonStyle('bordered')]}
/>
```
