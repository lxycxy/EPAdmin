import * as XLSX from 'xlsx/xlsx.mjs';
export function recoverGTM8(time : Date) {
    time.setHours(time.getHours() + 8);
    return time.toISOString().slice(0, 19).replace('T', ' ');
}

export function exportXLSX(data : any, fileName : string) {
    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
    const buffer = XLSX.write(workBook, {bookType: 'xlsx', type: 'buffer'});

    const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url
    a.download = fileName + '.xlsx'
    a.click();
    window.URL.revokeObjectURL(url)
}