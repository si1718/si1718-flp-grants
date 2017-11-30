exports.config = {
    seleniumAddress: 'http://localhost:9515',
    specs: ['T01-LoadData.js', 'T02-AddGrant.js'],
    capabilities: {
        'browserName' : 'phantomjs'
    }
}