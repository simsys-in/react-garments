const { SUCCESS_LOGIN, ON_LOGOUT, TOGGLE_SIDER } = require("../actionTypes");

const initialState = {
    login: false,
    userData : {},
    sider_collapsed : true
}

export default function Login(state=initialState, action){
    switch (action.type)
    {
        case SUCCESS_LOGIN : {
            const MENU_TREE = action.payload.userMenuList;
            delete action.payload.userMenuList;
            return {
                ...state,
                login : true,
                userData : action.payload,
                menuTree : MENU_TREE
            }
        }
        case ON_LOGOUT : {
            return {
                ...state,
                login : false,
                userData : {}
            }
        }
        case TOGGLE_SIDER : {
            return {
                ...state,
                sider_collapsed : action.payload
            }
        }
        
        default:
            return state
    }

}