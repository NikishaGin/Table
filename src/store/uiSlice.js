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
        openCommentModal(state, { payload: rowId }) {
            state.commentModalRowId = rowId;
        },
        closeCommentModal(state) {
            state.commentModalRowId = null;
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