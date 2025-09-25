import { createSlice } from '@reduxjs/toolkit';


const initialState = {
// Фильтры списка
    filters: {
        showVerified: false,
        showInvalid: false,
        showNoStatus: false,
    },
// Управление модалкой комментариев
    commentModalRowId: null,
    commentModalIntent: null, // 'invalid' | null
//     commentModalRowId: null,
// Небольшие уведомления
    alert: null, // { severity, message }
};


const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setFilters(state, { payload }) {
            state.filters = { ...state.filters, ...payload };
        },
        // openCommentModal(state, { payload: rowId }) {
        //     state.commentModalRowId = rowId;
        // },
        openCommentModal(state, { payload }) {
         if (typeof payload === 'object' && payload) {
               state.commentModalRowId = payload.rowId;
               state.commentModalIntent = payload.intent || null;
             } else {
               state.commentModalRowId = payload;   // для обратной совместимости (число)
               state.commentModalIntent = null;
             }
       },
        closeCommentModal(state) {
            // state.commentModalRowId = null;
            state.commentModalRowId = null;
            state.commentModalIntent = null;
        },
        showAlert(state, { payload }) {
            state.alert = payload; // {severity, message}
        },
        hideAlert(state) {
            state.alert = null;
        },
    },
});


export const { setFilters, openCommentModal, closeCommentModal, showAlert, hideAlert } = uiSlice.actions;
export default uiSlice.reducer;