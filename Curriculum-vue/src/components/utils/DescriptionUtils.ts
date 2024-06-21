import { healTools } from '@/views/NeedLogin/Department/ChangeForm/HealToolData'

export function translate(index: number[]): string {
  let result = '## 药品清单  \n'
  for (const i of index) {
    let text = '- '
    text = text + '**' + healTools[i].label + '** ' + healTools[i].cost + '  \n'
    result = result.concat(text)
  }
  return result
}
