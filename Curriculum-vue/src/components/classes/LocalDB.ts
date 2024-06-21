import { ProfileData } from '@/views/NeedLogin/Profile/ProfileData'
import { DepartmentData } from '@/views/NeedLogin/Department/DepartmentData'
import { RoleData } from '@/views/NeedLogin/Role/RoleData'
import { DoctorData } from '@/views/NeedLogin/Doctor/DoctorData'
import { PatientData } from '@/views/NeedLogin/Patient/PatientData'
import { PatientCardData } from '@/views/NeedLogin/PatientCard/PatientCardData'
import { RegisteredData } from '@/views/NeedLogin/Registered/RegisteredData'
import { PrescriptionData } from '@/views/NeedLogin/Prescription/PrescriptionData'

export class LocalDB {
  //   把你页面数据的类作为字段放进这个类里面，比如
  //   userData: UserData
  private readonly urlRoot: string
  profileData: ProfileData
  departmentData: DepartmentData
  roleData: RoleData
  doctorData: DoctorData
  patientData: PatientData
  patientCardData: PatientCardData
  registeredData: RegisteredData
  prescriptionData: PrescriptionData
  patientPrescriptionData : PrescriptionData

  //   这是无参的构造函数，用来统一构造所有页面的Data类
  constructor(urlRoot: string) {
    //   你写好你的类的字段后，把它的构造函数写进这个类的构造函数里面，比如
    //   this.userData = new UserData()
    this.urlRoot = urlRoot
    this.profileData = new ProfileData(urlRoot + '/api/user/profile')
    this.departmentData = new DepartmentData(urlRoot + '/api/department')
    this.roleData = new RoleData(urlRoot + '/api/role')
    this.doctorData = new DoctorData(urlRoot + '/api/doctor')
    this.patientData = new PatientData(urlRoot + '/api/patient')
    this.patientCardData = new PatientCardData(urlRoot + '/api/patientCard')
    this.registeredData = new RegisteredData(urlRoot + '/api/registered')
    this.prescriptionData = new PrescriptionData(urlRoot + '/api/prescription', 'doctor')
    this.patientPrescriptionData = new PrescriptionData(urlRoot + '/api/prescription', 'patient')
  }

  destroy() {
    this.profileData = new ProfileData(this.urlRoot + '/api/user/profile')
    this.departmentData = new DepartmentData(this.urlRoot + '/api/department')
    this.roleData = new RoleData(this.urlRoot + '/api/role')
    this.doctorData = new DoctorData(this.urlRoot + '/api/doctor')
    this.patientData = new PatientData(this.urlRoot + '/api/patient')
    this.patientCardData = new PatientCardData(this.urlRoot + '/api/patientCard')
    this.registeredData = new RegisteredData(this.urlRoot + '/api/registered')
    this.prescriptionData = new PrescriptionData(this.urlRoot + '/api/prescription', 'doctor')
    this.patientPrescriptionData = new PrescriptionData(this.urlRoot + '/api/prescription', 'patient')
  }
}
