import { createSelector } from '@reduxjs/toolkit';


const selectRows = state => state.table.rows;
const selectFilters = state => state.ui.filters;


export const selectFilteredRows = createSelector([selectRows, selectFilters], (rows, filters) => {
    const { showVerified, showInvalid, showNoStatus } = filters;


// Если ничего не выбрано – отображаем всё (или по умолчанию showNoStatus=true)
    const active = [];
    if (showVerified) active.push('verified');
    if (showInvalid) active.push('invalid');
    if (showNoStatus) active.push('none');


// если все выключены – покажем все, чтобы не пусто
    const useAll = active.length === 0;


    return rows.filter(r => useAll || active.includes(r.status));
});