Pod::Spec.new do |s|
  s.name           = 'RnIosSystemTokens'
  s.version        = '1.0.0'
  s.summary        = 'Native iOS System Fonts and Colors for React Native'
  s.description    = 'Exposes system dynamic type metrics and semantic colors to React Native'
  s.author         = 'Lucas Duarte'
  s.homepage       = 'https://github.com/lucasdrta/rn-ios-system-tokens'
  s.platform       = :ios, '13.0'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,swift}"
end
