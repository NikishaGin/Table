// Сериализация текущей выборки в JSON/CSV и скачивание без сторонних библиотек


export function downloadBlob(content, filename, mime = 'application/octet-stream') {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}


export function rowsToExportShape(rows) {
// Приводим к плоскому виду: id, col1..col40, status, comment, cellFlags(JSON)
    return rows.map(r => {
        const flat = { id: r.id, ...r.cols, status: r.status, comment: r.comment };
        const flaggedCols = Object.entries(r.cellFlags || {})
            .filter(([, v]) => !!v)
            .map(([k]) => k);
        flat.cellFlags = flaggedCols; // массив имён колонок
        return flat;
    });
}


export function exportJSON(rows) {
    const data = rowsToExportShape(rows);
    downloadBlob(JSON.stringify(data, null, 2), 'export.json', 'application/json');
}


export function exportCSV(rows) {
    const data = rowsToExportShape(rows);
    if (!data.length) {
        downloadBlob('', 'export.csv', 'text/csv;charset=utf-8;');
        return;
    }
    const headers = Object.keys(data[0]);
    const csv = [headers.join(',')]
        .concat(
            data.map(row => headers.map(h => serializeCsvCell(row[h])).join(','))
        )
        .join('\n');
    downloadBlob(csv, 'export.csv', 'text/csv;charset=utf-8;');
}


function serializeCsvCell(v) {
    if (v == null) return '';
    const s = Array.isArray(v) ? JSON.stringify(v) : String(v);
// Экранируем запятые/кавычки/переводы строк
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
}