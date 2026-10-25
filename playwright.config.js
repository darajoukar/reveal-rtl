import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig( {
	testDir: 'tests',
	timeout: 30_000,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: `http://localhost:${ PORT }`,
		locale: 'fa-IR',
		// Local runs use an installed browser (set PW_CHANNEL=msedge or chrome) when Playwright's
		// own Chromium download is unavailable; CI uses the bundled Chromium.
		channel: process.env.PW_CHANNEL || undefined
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL || undefined }, testIgnore: /mobile/ },
		{ name: 'mobile', use: { ...devices['Pixel 7'], channel: process.env.PW_CHANNEL || undefined }, testMatch: /mobile/ }
	],
	webServer: {
		command: `npx serve -l ${ PORT } --no-clipboard .`,
		port: PORT,
		reuseExistingServer: !process.env.CI
	}
} );
