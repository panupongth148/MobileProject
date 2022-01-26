import User from '../models/usersModel';
import Dep from '../models/departmentModel';
import wardType from '../models/wardTypeModel';
import wardRoom from '../models/wardRoomModel';
import Tiang from './../models/tiangModel';
import Queue from './../models/queueDataModel';

export const USER = [
    new User(
        "Owen",
        "Tw",
        "555/555 LA, Thailand",
        "0999999999",
        "Owenlnwza555@gmail.com",
        "2000-01-01",
        "male",
        "male",
        "1"
    )
];

// Mock up data
export const DEPARTMENTS = [
    new Dep("1", "อายุรกรรม"),
    new Dep("2", "ศัลยกรรม"),
    new Dep("3", "ฉุกเฉิน"),
    new Dep("4", "ปราศจากเชื้อโรค"),
    new Dep("5", "ICU"),
    new Dep("6", "ห้องคลอด"),
    new Dep("7", "นรีเวช"),
    new Dep("8", "กุมารเวช"),
];

export const WARD_TYPE = [
    new wardType("1", "men"),
    new wardType("2", "women"),
    new wardType("3", "women & men"),
    new wardType("4", "vip"),
];

export const WARD_ROOM = [
    new wardRoom("1", "Room 1"),
    new wardRoom("2", "Room 2"),
    new wardRoom("3", "Room 3"),
    new wardRoom("4", "Room 4"),
];

export const TIANG = [
    new Tiang("1", "Tiang 1", "used"),
    new Tiang("2", "Tiang 2", "used"),
    new Tiang("3", "Tiang 3", "empty"),
    new Tiang("4", "Tiang 4", "empty"),
];

export const QUEUE = [
    new Queue("1", "นายทดสอบ ทดสอบ", 15, { CureName: "รถบรรทุกชน", PrescriptionID: 1, SpecialTreat: "ให้น้ำเกลือ", StateOfIllness: 2, TreatDay: 7, TreatmantInfoID: 1, TypeOfCure: "accident" }),
    new Queue("2", "นายทดส่อบ ทดส่อบ", 15, { CureName: "รถบรรทุกชน", PrescriptionID: 1, SpecialTreat: "ให้น้ำเกลือ", StateOfIllness: 2, TreatDay: 7, TreatmantInfoID: 1, TypeOfCure: "accident" }),
    new Queue("3", "นายทดส้อบ ทดส้อบ", 15, { CureName: "รถบรรทุกชน", PrescriptionID: 1, SpecialTreat: "ให้น้ำเกลือ", StateOfIllness: 2, TreatDay: 7, TreatmantInfoID: 1, TypeOfCure: "accident" }),
    new Queue("4", "นายทดส๊อบ ทดส๊อบ", 15, { CureName: "รถบรรทุกชน", PrescriptionID: 1, SpecialTreat: "ให้น้ำเกลือ", StateOfIllness: 2, TreatDay: 7, TreatmantInfoID: 1, TypeOfCure: "accident" }),
    new Queue("4", "นายทดส๋อบ ทดส๋อบ", 15, { CureName: "รถบรรทุกชน", PrescriptionID: 1, SpecialTreat: "ให้น้ำเกลือ", StateOfIllness: 2, TreatDay: 7, TreatmantInfoID: 1, TypeOfCure: "accident" }),
];