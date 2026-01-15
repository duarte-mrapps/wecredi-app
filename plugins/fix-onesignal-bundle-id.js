const { withXcodeProject } = require('@expo/config-plugins')

module.exports = function withFixOneSignalBundleId(config) {
  return withXcodeProject(config, config => {
    const bundle = config.ios?.bundleIdentifier
    if (!bundle) return config

    const project = config.modResults
    const sections = project.pbxXCBuildConfigurationSection()

    Object.entries(sections).forEach(([key, value]) => {
      if (typeof value !== 'object') return
      const settings = value.buildSettings || {}
      const infoPlist = settings.INFOPLIST_FILE
      const entitlements = settings.CODE_SIGN_ENTITLEMENTS
      const isOneSignalExt = [infoPlist, entitlements].some(v => typeof v === 'string' && v.includes('OneSignalNotificationServiceExtension'))
      if (isOneSignalExt) {
        settings.PRODUCT_BUNDLE_IDENTIFIER = `${bundle}.OneSignalNotificationServiceExtension`
        sections[key].buildSettings = settings
      }
    })

    return config
  })
}
