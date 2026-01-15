const { withAndroidManifest } = require('@expo/config-plugins');

const withAndroidQueries = (config) => {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults;
    
    if (!manifest.manifest.queries) {
      manifest.manifest.queries = [];
    }
    
    let queriesTag = manifest.manifest.queries[0];
    if (!queriesTag) {
      queriesTag = {};
      manifest.manifest.queries.push(queriesTag);
    }
    
    if (!queriesTag.intent) {
      queriesTag.intent = [];
    }

    const schemesToAdd = [
      'whatsapp', 
      'tg', 
      'sms', 
      'tel', 
      'mailto', 
      'geo', 
      'waze',
      'instagram',
      'facebook',
      'youtube',
      'twitter',
      'linkedin',
      'tiktok'
    ];
    
    schemesToAdd.forEach(scheme => {
        const exists = queriesTag.intent.some(i => i.data && i.data[0] && i.data[0].$ && i.data[0].$['android:scheme'] === scheme);
        if (!exists) {
            queriesTag.intent.push({
                action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
                data: [{ $: { 'android:scheme': scheme } }]
            });
        }
    });

    return config;
  });
};

module.exports = withAndroidQueries;
