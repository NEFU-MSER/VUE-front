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
  new ItemGroup('个人管理', [new SideBarItem('个人信息', '/main/profile')]),
  new ItemGroup('事务管理', [
    new SideBarItem('科室管理', '/main/department'),
    new SideBarItem('职务管理', '/main/role'),
    new SideBarItem('医生管理', '/main/doctor'),
    new SideBarItem('患者管理', '/main/patient'),
    new SideBarItem('诊疗卡管理', '/main/patientCard')
  ])
]
export const bar2: Array<ItemGroup> = [
  new ItemGroup('门诊', [
    new SideBarItem('门诊挂号', '/main/registered'),
    new SideBarItem('门诊缴费', '/main/outPatient'),
    new SideBarItem('门诊历史', '/main/patientHistory')
  ])
]
export const bar3: Array<ItemGroup> = [
  new ItemGroup('门诊', [
    new SideBarItem('处放开具', '/main/prescription'),
    new SideBarItem('处方历史', '/main/doctorHistory')
  ])
]
