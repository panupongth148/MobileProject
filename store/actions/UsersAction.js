export const TOGGLE_USER = "TOGGLE_USER";
export const GET_WARDTYPE = "GET_WARDTYPE";


export const toggleUser = (data) => {
    return { type: TOGGLE_USER, accountData: data }
}

export const getWardtype = (data) => {
    return { type: GET_WARDTYPE, ward: data }
}