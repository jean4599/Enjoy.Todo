const initialState = {
    today: new Date(),
    activeDate: new Date()
}
export default function(state=initialState, action){
    switch(action.type){
        default:
            return state;
    }
}