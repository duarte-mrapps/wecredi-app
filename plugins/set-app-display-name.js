const { withInfoPlist, withStringsXml, AndroidConfig } = require('@expo/config-plugins')

module.exports = function withAppDisplayName(config) {
  const displayName = 'WeCredi'

  config = withInfoPlist(config, config => {
    const plist = config.modResults
    plist.CFBundleDisplayName = displayName
    return config
  })

  config = withStringsXml(config, config => {
    const strings = config.modResults
    config.modResults = AndroidConfig.Strings.setStringItem(
      [
        { $: { name: 'app_name', translatable: 'false' }, _: displayName }
      ],
      strings
    )
    return config
  })

  return config
}
