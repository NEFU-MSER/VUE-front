import { type Doctor } from '@/components/classes/Doctor'
import { type Role } from '@/components/classes/Role'

export class DoctorAndRole {
  doctor: Doctor
  role: Role

  constructor(doctor: Doctor, role: Role) {
    this.doctor = doctor
    this.role = role
  }
}
