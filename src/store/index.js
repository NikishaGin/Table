import { configureStore } from '@reduxjs/toolkit';
import tableReducer from './tableSlice.js';
import uiReducer from './uiSlice.js';


const store = configureStore({
    reducer: {
        table: tableReducer,
        ui: uiReducer,
    },
});


export default store;