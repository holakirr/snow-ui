import { defineConfig } from '@playwright/test'
const root=process.cwd()
import config from '../../apps/demo/playwright.config'
const {webServer,...rest}=config
export default defineConfig({...rest,testDir:root + '/.tmp/production-check/demo',workers:2,retries:0,timeout:60000,expect:{timeout:10000},reporter:[['list'],['json',{outputFile:root + '/.tmp/production-check/demo-results.json'}]],outputDir:root + '/.tmp/production-check/demo-output',use:{...config.use,baseURL:'https://demo.snow-ui.holakirr.com',screenshot:'only-on-failure',trace:'off',video:'off'}})
