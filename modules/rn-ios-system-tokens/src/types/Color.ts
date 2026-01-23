export type SystemColorKey =
  // Text
  | 'label'
  | 'secondaryLabel'
  | 'tertiaryLabel'
  | 'quaternaryLabel'
  | 'placeholderText'
  | 'link'
  // Backgrounds
  | 'systemBackground'
  | 'secondarySystemBackground'
  | 'tertiarySystemBackground'
  | 'systemGroupedBackground'
  | 'secondarySystemGroupedBackground'
  | 'tertiarySystemGroupedBackground'
  // Fill
  | 'systemFill'
  | 'secondarySystemFill'
  | 'tertiarySystemFill'
  | 'quaternarySystemFill'
  // Standard
  | 'systemBlue'
  | 'systemGreen'
  | 'systemIndigo'
  | 'systemOrange'
  | 'systemPink'
  | 'systemPurple'
  | 'systemRed'
  | 'systemTeal'
  | 'systemYellow'
  | 'systemGray'
  | 'systemGray2'
  | 'systemGray3'
  | 'systemGray4'
  | 'systemGray5'
  | 'systemGray6'

export type SystemColors = Record<SystemColorKey, string> // Hex strings
