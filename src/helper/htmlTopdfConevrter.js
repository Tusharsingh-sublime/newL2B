// const pdf = require('html-pdf');

// function generatePDF(htmlContent) {
//   return new Promise((resolve, reject) => {
//     const options = {
//       format: 'A2', // Options: 'Letter', 'Legal', 'A4', etc.
//       // You can also set a custom paper height like this:
//       // height: '10in', // You can specify 'mm', 'cm', 'in', or 'px'
//     }
//     pdf.create(htmlContent, options).toBuffer((err, buffer) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(buffer);
//       }
//     });
//   });
// }
const puppeteer = require('puppeteer');

async function generatePdfBufferFromHtml(htmlContent) {
  const browser = await puppeteer.launch({headless: "new",args: ['--no-sandbox']});
  const page = await browser.newPage();

  // Load the HTML content
  await page.setContent(htmlContent);

  // Generate PDF
  const pdfBuffer = await page.pdf({ format: 'A2' });

  await browser.close();

  return pdfBuffer;
}
module.exports=generatePdfBufferFromHtml
