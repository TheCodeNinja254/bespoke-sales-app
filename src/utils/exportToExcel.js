import moment from 'moment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const exportToExcel = (items, fileNamePrefix) => {
  if (!items || !items.length) {
    return;
  }
  const header = Object.keys(items[0]); // columns name
  const wsCols = [];
  for (let i = 0; i < header.length; i += 1) {
    // columns length added
    wsCols.push({ wch: header[i].length + 10 });
  }
  const fileName = `${fileNamePrefix}_${moment().format(
    'DD-MM-YYYY hh:mm:ss'
  )}`;
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const ws = XLSX.utils.json_to_sheet(items);
  ws['!cols'] = wsCols;

  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};

export default exportToExcel;
