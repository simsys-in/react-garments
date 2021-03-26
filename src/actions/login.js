const { SUCCESS_LOGIN, ON_LOGOUT, TOGGLE_SIDER } = require("../actionTypes");

export const successLogin = (loginData) => ({
    type : SUCCESS_LOGIN,
    payload : loginData
})

export const onLogOut = () => ({
    type : ON_LOGOUT
})

export const toggleSiderCollapse = (collapsed) => ({
    type : TOGGLE_SIDER,
    payload : collapsed
})