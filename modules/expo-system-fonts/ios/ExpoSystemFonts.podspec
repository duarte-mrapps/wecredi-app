Pod::Spec.new do |s|
  s.name           = 'ExpoSystemFonts'
  s.version        = '1.0.0'
  s.summary        = 'A native Expo module for iOS Dynamic Type fonts'
  s.description    = 'Exposes system dynamic type metrics to React Native'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
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
