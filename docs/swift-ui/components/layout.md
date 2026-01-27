# Layout Components

Componentes para organizar a interface do usuário.

## `Host`

Container raiz **obrigatório** para qualquer conteúdo `@expo/ui/swift-ui`. Faz a ponte entre o layout do React Native (Flexbox) e o layout do SwiftUI.

**Props:**
- `style`: `StyleProp<ViewStyle>` - Estilo do container React Native. **Importante**: Deve ter dimensões definidas (ex: `flex: 1` ou `height`).
- `children`: `ReactNode` - Conteúdo SwiftUI.

```tsx
<Host style={{ flex: 1 }}>
  {/* Conteúdo SwiftUI */}
</Host>
```

---

## `VStack` (Vertical Stack)

Organiza os filhos verticalmente.

**Props:**
- `alignment`: `'leading' | 'center' | 'trailing'` - Alinhamento horizontal dos itens. (Default: `center`)
- `spacing`: `number` - Espaço entre os itens.
- `children`: `ReactNode`

```tsx
<VStack alignment="leading" spacing={10}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</VStack>
```

---

## `HStack` (Horizontal Stack)

Organiza os filhos horizontalmente.

**Props:**
- `alignment`: `'top' | 'center' | 'bottom' | 'firstTextBaseline' | 'lastTextBaseline'` - Alinhamento vertical dos itens. (Default: `center`)
- `spacing`: `number` - Espaço entre os itens.
- `children`: `ReactNode`

```tsx
<HStack alignment="center" spacing={20}>
  <Image systemName="star" />
  <Text>Favorito</Text>
</HStack>
```

---

## `ZStack` (Depth Stack)

Sobrepõe os filhos uns sobre os outros (eixo Z).

**Props:**
- `alignment`: `'center' | 'top' | 'bottom' | 'leading' | 'trailing' ...` - Alinhamento dos itens dentro da stack.
- `children`: `ReactNode`

```tsx
<ZStack>
  <Image systemName="square.fill" points={100} color="blue" />
  <Text modifiers={[foregroundStyle('white')]}>Sobreposto</Text>
</ZStack>
```

---

## `Spacer`

Espaço flexível que se expande para ocupar o espaço disponível ao longo do eixo do layout container (`HStack` ou `VStack`).

**Props:**
- `minLength`: `number` - O comprimento mínimo do espaço.

```tsx
<HStack>
  <Text>Esquerda</Text>
  <Spacer />
  <Text>Direita</Text>
</HStack>
```
