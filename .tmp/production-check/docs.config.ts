import { defineConfig } from '@playwright/test'
const root=process.cwd()
export default defineConfig({testDir:'.',testMatch:'docs.spec.ts',workers:2,fullyParallel:true,retries:0,timeout:90000,reporter:[['list'],['json',{outputFile:root + '/.tmp/production-check/docs-results.json'}]],outputDir:root + '/.tmp/production-check/docs-output',use:{baseURL:'https://snow-ui.holakirr.com',viewport:{width:1280,height:720},locale:'en-US',colorScheme:'light',browserName:'chromium',screenshot:'only-on-failure',trace:'off',video:'off'}})
