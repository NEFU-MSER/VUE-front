import { ProfileData } from '@/views/NeedLogin/Profile/ProfileData'
import { urlRoot } from '@/main'

export class LocalDB {
  //   把你页面数据的类作为字段放进这个类里面，比如
  //   userData: UserData
  profileData: ProfileData

  //   这是无参的构造函数，用来统一构造所有页面的Data类
  constructor() {
    //   你写好你的类的字段后，把它的构造函数写进这个类的构造函数里面，比如
    //   this.userData = new UserData()
    this.profileData = new ProfileData(urlRoot + '/api/user/profile')
  }
}
