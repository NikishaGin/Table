import * as XLSX from 'xlsx';

/**
 * Экспорт текущей выборки в Excel.
 * В лист "rows" — строки со статусом и комментарием.
 * В лист "flags" — список подсвеченных ячеек (rowId, column).
 */
export function exportXLSX(rows, filename = `export_${new Date().toISOString().slice(0,10)}.xlsx`) {
    // Основные данные
    const main = rows.map(r => ({
        id: r.id,
        status: r.status || 'none',
        comment: r.comment || '',
        ...r.cols, // col1..col40
    }));

    const wb = XLSX.utils.book_new();
    const wsMain = XLSX.utils.json_to_sheet(main);
    XLSX.utils.book_append_sheet(wb, wsMain, 'rows');

    // Лист с флагами ячеек (если есть)
    const flags = [];
    for (const r of rows) {
        const cf = r.cellFlags || {};
        for (const [colKey, isFlagged] of Object.entries(cf)) {
            if (isFlagged) flags.push({ id: r.id, column: colKey });
        }
    }
    if (flags.length) {
        const wsFlags = XLSX.utils.json_to_sheet(flags);
        XLSX.utils.book_append_sheet(wb, wsFlags, 'flags');
    }

    XLSX.writeFile(wb, filename);
}
