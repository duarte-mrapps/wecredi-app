export type FontWeight =
  | 'ultraLight'
  | 'thin'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'heavy'
  | 'black'

export type TextStyleKey =
  | 'largeTitle'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subheadline'
  | 'footnote'
  | 'caption1'
  | 'caption2'

export type FontMetrics = {
  fontSize: number
  fontWeight: FontWeight
  lineHeight: number
  letterSpacing: number // 0 if not available
  textStyle: TextStyleKey
}

export type SystemFonts = Record<TextStyleKey, FontMetrics>
