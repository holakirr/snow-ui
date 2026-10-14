import { test as base } from '../../apps/demo/e2e/fixtures'
import { authorizeProduction } from './auth'
export const test = base.extend<{ productionAccess: void }>({
  productionAccess: [async ({context},use)=>{
    await authorizeProduction(context,'https://demo.snow-ui.holakirr.com','SNOWUI_DEMO_AUTOMATION_SECRET')
    await use()
  },{auto:true}],
})
export { expect, checkA11y, animationsDone, useTheme, chartsReady } from '../../apps/demo/e2e/fixtures'
