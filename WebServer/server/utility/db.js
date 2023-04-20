const mongoose = require('mongoose');
const { UserModel, RoomModel } = require('./models');

const debugURL = 'TemplateDebug';
const productionURL = 'TemplateProduction';
let dbUrl = debugURL;
let databaseEnabled = false;

let dbConnect = async () => {
    await mongoose.connect(`mongodb://127.0.0.1:27017/${dbUrl}`,);
    databaseEnabled = true;
};

const printTable = (data) => {
    // Get the headers by getting the keys of the first object in the data array
    const headers = Object.keys(data[0]);
    console.log(headers);
    // Find the longest header text to set the width of all columns
    const longestHeader = headers.reduce((acc, header) => {
      return header.length > acc ? header.length : acc;
    }, 0);
  
    // Find the longest value for each header to set the width of each column
    const columnWidths = headers.map((header) => {
      return data.reduce((acc, obj) => {
        if (typeof obj[header] === 'boolean') return Math.max('false'.length, acc);
        const val = obj[header] ?? null;
        const len = val?.toString()?.length ?? 0;
        return Math.max(len, acc);
      }, longestHeader);
    });
  
    // Print the header row
    console.log('+' + headers.map((header, i) => '-'.repeat(columnWidths[i] + 2)).join('+') + '+');
    console.log('| ' + headers.map((header, i) => header.padEnd(columnWidths[i])).join(' | ') + ' |');
    console.log('+' + headers.map((header, i) => '-'.repeat(columnWidths[i] + 2)).join('+') + '+');
  
    // Print the data rows
    data.forEach((obj) => {
      console.log('| ' + headers.map((header, i) => {
        if (typeof obj[header] === 'boolean') return obj[header].toString().padEnd(columnWidths[i]);
        const val = obj[header] ?? null;
        return val ? val.toString().padEnd(columnWidths[i]) : ' '.repeat(columnWidths[i]);
      }).join(' | ') + ' |');
    });
  
    // Print the footer row
    console.log('+' + headers.map((header, i) => '-'.repeat(columnWidths[i] + 2)).join('+') + '+');
};
  
const database = {

};

module.exports = {
    database,
    dbConnect,
    databaseEnabled,
};
