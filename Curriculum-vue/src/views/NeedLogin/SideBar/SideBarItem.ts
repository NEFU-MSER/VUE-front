class SideBarItem {
  name: string
  path: string

  constructor(name: string, path: string) {
    this.name = name
    this.path = path
  }
}

class ItemGroup {
  name: string
  items: SideBarItem[]

  constructor(name: string, items: SideBarItem[]) {
    this.name = name
    this.items = items
  }
}

export const bar1: Array<ItemGroup> = [
  new ItemGroup('基础管理', [new SideBarItem('个人信息', '/main/profile')])
]
export const bar2: Array<SideBarItem> = []
