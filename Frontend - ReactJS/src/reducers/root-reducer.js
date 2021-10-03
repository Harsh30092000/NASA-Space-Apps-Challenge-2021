const initialState = {
    data: null,
    feaData: null,
    temp: false,
    basic_perf: null,
    analysis_user_data: null,
    analysis_NASA_data: null,
};

const reducer = (state = initialState, action) => {
    console.log(action);
    switch(action.type){
        case 'SET_DATA':
            return{  
                ...state,
                data: action.data,
            };
        
        case 'SET_FEA_DATA':
            return{  
                ...state,
                feaData: action.data,
            };
        
        case 'TOGGLE_TEMP':
            return{  
                ...state,
                temp: action.status,
            };

        case 'SET_BASIC_PERF':
            return{  
                ...state,
                basic_perf: action.data,
            };
            
        case 'SET_ANA_USER_DATA':
            return{  
                ...state,
                analysis_user_data: action.data,
            };
        
        case 'SET_ANA_NASA_DATA':
            return{  
                ...state,
                analysis_NASA_data: action.data,
            };
                        
        default:
            return state;
    }
}

export default reducer;