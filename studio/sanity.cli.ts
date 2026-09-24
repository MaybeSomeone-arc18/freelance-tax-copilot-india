import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '7i4i5k0j',
    dataset: 'production'
  },
  studioHost: 'freelance-tax-copilot',
  deployment: {
    appId: 't2l357lcrckey10f1crl9h0v',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
