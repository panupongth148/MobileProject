import { USER } from "./../../data/data";
import { TOGGLE_USER } from "./../actions/UsersAction";

const initialState = {
    accountInfo: USER[0],
    patientInfo: null,
    medicineData: null,
    treatmentInfo: null,
    bedData: null,
    medicalRole: null,
};

export default function usersReducer(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_USER :
            return {
                accountInfo: action.accountData.accountInfo,
                patientInfo: action.accountData.patientInfo,
                medicineData: action.accountData.medicineData,
                treatmentInfo: action.accountData.treatmentInfo,
                bedData: action.accountData.bedData,
                medicalRole: action.accountData.medicalRole,
            };
        default :
            return state;
    }
}
