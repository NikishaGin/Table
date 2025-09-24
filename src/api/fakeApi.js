// // Простой генератор данных 100×40
// export async function fetchRowsApi(count = 100) {
//     const rows = Array.from({ length: count }).map((_, i) => {
//         const cols = {};
//         for (let c = 1; c <= 40; c++) {
//             cols['col' + c] = Math.floor(Math.random() * 1000);
//         }
//         return {
//             id: i + 1,
//             cols,
//             status: 'none', // 'none' | 'verified' | 'invalid'
//             comment: '',
//             cellFlags: {}, // { col1: true, ... }
//         };
//     });
// // имитация сети
//     await new Promise(r => setTimeout(r, 200));
//     return rows;
// }


export async function fetchRowsPageApi({ page, pageSize }) {
    const rowCount = 100000;                 // всего строк
    const start = page * pageSize;
    const end = Math.min(start + pageSize, rowCount);
    const rows = [];
    for (let i = start; i < end; i++) {
        const cols = {};
        for (let c = 1; c <= 40; c++) cols['col'+c] = Math.floor(Math.random()*1000);
        rows.push({ id: i+1, cols, status: 'none', comment: '', cellFlags: {} });
    }
    await new Promise(r => setTimeout(r, 150));  // имитация сети
    return { rows, rowCount };
}
