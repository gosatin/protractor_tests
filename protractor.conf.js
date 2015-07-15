exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e/*.js'],
  capabilities: {
    'browserName': 'chrome'
  },
  jasmineNodeOpts: {defaultTimeoutInterval: 600000},
  suites: {
    smoke: 'e2e/smoke.js',
    admin: 'e2e/admin_*.js',
    academy: 'e2e/academy.js',
    screenshot: 'e2e/academy_screenshot.js',
  }
}

