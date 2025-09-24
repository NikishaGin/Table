import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRowsPageApi } from '../api/fakeApi';
import { openCommentModal, showAlert } from './uiSlice';

export const fetchRowsPage = createAsyncThunk(
    'table/fetchRowsPage',
      async ({ page, pageSize }, thunkAPI) => {
        // пробрасываем AbortSignal в API
            return await fetchRowsPageApi({ page, pageSize, signal: thunkAPI.signal });
      }
);

const initialState = {
    rows: [], rowCount: 0, loading: false,
    page: 0, pageSize: 12,                    // <= тут задаём 10 на странице
};

const slice = createSlice({
    name: 'table', initialState,
    reducers: {
        setRowComment(state, { payload:{ rowId, comment } }) {
            const r = state.rows.find(x=>x.id===rowId); if (r) r.comment = comment;
        },
        setRowStatus(state, { payload:{ rowId, status } }) {
            const r = state.rows.find(x=>x.id===rowId); if (r) r.status = status;
        },
        toggleCellFlag(state, { payload:{ rowId, columnKey } }) {
            const r = state.rows.find(x=>x.id===rowId); if (!r) return;
            r.cellFlags[columnKey] = !r.cellFlags[columnKey];
        },
        setPage(state, { payload }) { state.page = payload; },
        setPageSize(state, { payload }) { state.pageSize = payload; },
    },
    extraReducers: b => {
        b.addCase(fetchRowsPage.pending, (s)=>{ s.loading = true; })
            .addCase(fetchRowsPage.fulfilled, (s, { payload:{ rows, rowCount } })=>{
                s.rows = rows; s.rowCount = rowCount; s.loading = false;
            })
            .addCase(fetchRowsPage.rejected, (s)=>{ s.loading = false; });
    }
});

export const { setRowComment,setRowStatus,toggleCellFlag,setPage,setPageSize } = slice.actions;
export default slice.reducer;

// Санка: toggle статуса + требование комментария для invalid
export const applyRowStatus = ({ rowId, status }) => (dispatch, getState) => {
    const { table } = getState(); const row = table.rows.find(r=>r.id===rowId); if (!row) return;
    const nextStatus = (row.status === status) ? 'none' : status;
    if (nextStatus === 'invalid' && (!row.comment || !row.comment.trim())) {
        dispatch(showAlert({ severity:'warning', message:'Чтобы поставить «Некорректная», укажите причину.' }));
        dispatch(openCommentModal(rowId));
        return;
    }
    dispatch(setRowStatus({ rowId, status: nextStatus }));
};
