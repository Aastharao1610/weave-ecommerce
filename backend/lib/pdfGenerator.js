// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";

// export const generateInvoicePDF = (invoiceData) => {
//   return new Promise((resolve, reject) => {
//     // Ensure the invoices folder exists
//     const invoicesDir = path.resolve("invoices");
//     if (!fs.existsSync(invoicesDir)) {
//       fs.mkdirSync(invoicesDir, { recursive: true });
//     }

//     const filePath = path.join(
//       invoicesDir,
//       `invoice-${invoiceData.orderId}.pdf`
//     );
//     const doc = new PDFDocument();

//     const writeStream = fs.createWriteStream(filePath);
//     doc.pipe(writeStream);

//     // Header
//     doc.fontSize(20).text("🧵 Weave Store", { align: "center" });
//     doc.moveDown();
//     doc.fontSize(14).text(`Invoice for Order #${invoiceData.orderId}`);
//     doc.moveDown();
//     doc.fontSize(12).text(`Customer: ${invoiceData.customerName}`);
//     doc.text(`Email: ${invoiceData.customerEmail}`);
//     doc.text(`Date: ${new Date().toLocaleDateString()}`);
//     doc.moveDown();

//     // Table Header
//     doc.fontSize(12).text("Product", 50, doc.y);
//     doc.text("Quantity", 200, doc.y);
//     doc.text("Price", 300, doc.y);
//     doc.text("Total", 400, doc.y);
//     doc.moveDown();

//     // Table Items
//     invoiceData.items.forEach((item) => {
//       doc.text(item.name, 50, doc.y);
//       doc.text(item.quantity.toString(), 200, doc.y);
//       doc.text(`₹${item.price}`, 300, doc.y);
//       doc.text(`₹${item.total}`, 400, doc.y);
//       doc.moveDown();
//     });

//     // Footer
//     doc.moveDown();
//     doc
//       .fontSize(14)
//       .text(`Grand Total: ₹${invoiceData.total}`, { align: "right" });

//     doc.end();

//     writeStream.on("finish", () => resolve(filePath));
//     writeStream.on("error", (err) => reject(err));
//   });
// };
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = (invoiceData) => {
  return new Promise((resolve, reject) => {
    const invoicesDir = path.resolve("invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filePath = path.join(
      invoicesDir,
      `invoice-${invoiceData.orderId}.pdf`
    );
    const doc = new PDFDocument({ margin: 50 });

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    const accentColor = "#009688";
    const lightGray = "#eeeeee";

    // Company Info
    doc
      .fillColor("#333333")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("🧵 Weave Store", { align: "left" });

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("black")
      .text("123 Fashion Street, Style City, India", { align: "left" })
      .text("Phone: +91 98765 43210")
      .text("Email: support@weavestore.in");

    doc.moveDown(1.5);

    // Invoice Title
    doc
      .fontSize(18)
      .fillColor(accentColor)
      .font("Helvetica-Bold")
      .text("INVOICE", { align: "right" });

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("black")
      .text(`Invoice #: ${invoiceData.orderId}`, { align: "right" })
      .text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });

    doc.moveDown(1);

    // Billing Info
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Bill To:", 50)
      .font("Helvetica")
      .text(`${invoiceData.customerName}`, 50)
      .text(`${invoiceData.customerEmail}`, 50)
      .moveDown();

    // Table Header
    doc.fillColor(lightGray).rect(50, doc.y, 500, 20).fill();

    doc
      .fillColor("black")
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("Product", 55, doc.y - 15)
      .text("Quantity", 250, doc.y - 15)
      .text("Price", 350, doc.y - 15)
      .text("Total", 450, doc.y - 15);

    doc.moveDown(0.5);

    // Table Items
    doc.font("Helvetica").fontSize(10);
    invoiceData.items.forEach((item) => {
      doc
        .fillColor("black")
        .text(item.name, 55)
        .text(item.quantity.toString(), 250)
        .text(`₹${item.price.toFixed(2)}`, 350)
        .text(`₹${item.total.toFixed(2)}`, 450);
      doc.moveDown(0.3);
    });

    doc.moveDown();

    // Subtotal, Tax, Total
    const subtotal = invoiceData.items.reduce(
      (acc, item) => acc + item.total,
      0
    );
    const tax = subtotal * 0.18;
    const grandTotal = subtotal + tax;

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`Subtotal:`, 400, doc.y, { continued: true })
      .text(`₹${subtotal.toFixed(2)}`, { align: "right" });

    doc
      .font("Helvetica-Bold")
      .text(`Tax (18% GST):`, 400, doc.y, { continued: true })
      .text(`₹${tax.toFixed(2)}`, { align: "right" });

    doc
      .font("Helvetica-Bold")
      .fillColor(accentColor)
      .text(`Total:`, 400, doc.y, { continued: true })
      .text(`₹${grandTotal.toFixed(2)}`, { align: "right" });

    doc.moveDown(2);

    // Thank You Note
    doc
      .font("Helvetica-Oblique")
      .fontSize(11)
      .fillColor("black")
      .text("Thank you for shopping with Weave Store!", { align: "center" });

    // Optional Signature Placeholder
    doc.moveDown(3);
    doc
      .font("Helvetica")
      .text("Authorized Signature", 50)
      .moveDown(0.5)
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(200, doc.y)
      .stroke();

    doc.end();

    writeStream.on("finish", () => resolve(filePath));
    writeStream.on("error", (err) => reject(err));
  });
};

// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";

// export const generateInvoicePDF = (invoiceData) => {
//   return new Promise((resolve, reject) => {
//     const invoicesDir = path.resolve("invoices");
//     if (!fs.existsSync(invoicesDir)) {
//       fs.mkdirSync(invoicesDir, { recursive: true });
//     }

//     const filePath = path.join(invoicesDir, `invoice-${invoiceData.orderId}.pdf`);
//     const doc = new PDFDocument({ margin: 50 });

//     const writeStream = fs.createWriteStream(filePath);
//     doc.pipe(writeStream);

//     // Colors and styles
//     const headerColor = "#444444";
//     const accentColor = "#009688";

//     // Header
//     doc
//       .fillColor(headerColor)
//       .fontSize(24)
//       .text("🧵 Weave Store", { align: "center", underline: true });

//     doc.moveDown(1);

//     // Invoice Details
//     doc
//       .fontSize(14)
//       .fillColor("black")
//       .text(`Invoice for Order #${invoiceData.orderId}`, { align: "left" });

//     doc
//       .fontSize(12)
//       .text(`Customer: ${invoiceData.customerName}`)
//       .text(`Email: ${invoiceData.customerEmail}`)
//       .text(`Date: ${new Date().toLocaleDateString()}`);

//     doc.moveDown();

//     // Draw line
//     doc
//       .strokeColor(accentColor)
//       .lineWidth(1)
//       .moveTo(50, doc.y)
//       .lineTo(550, doc.y)
//       .stroke();

//     doc.moveDown(0.5);

//     // Table Header
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(12)
//       .text("Product", 50)
//       .text("Quantity", 250)
//       .text("Price", 350)
//       .text("Total", 450);

//     doc.moveDown(0.5);

//     // Table Divider
//     doc
//       .strokeColor("#dddddd")
//       .lineWidth(1)
//       .moveTo(50, doc.y)
//       .lineTo(550, doc.y)
//       .stroke();

//     doc.moveDown(0.5);

//     // Table Items
//     doc.font("Helvetica");
//     invoiceData.items.forEach((item) => {
//       doc
//         .fontSize(11)
//         .text(item.name, 50)
//         .text(item.quantity.toString(), 250)
//         .text(`₹${item.price.toFixed(2)}`, 350)
//         .text(`₹${item.total.toFixed(2)}`, 450);
//       doc.moveDown(0.3);
//     });

//     // Divider before total
//     doc.moveDown();
//     doc
//       .strokeColor("#aaaaaa")
//       .lineWidth(1)
//       .moveTo(50, doc.y)
//       .lineTo(550, doc.y)
//       .stroke();

//     doc.moveDown(0.5);

//     // Grand Total
//     doc
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .fillColor("black")
//       .text(`Grand Total: ₹${invoiceData.total.toFixed(2)}`, {
//         align: "right",
//       });

//     doc.end();

//     writeStream.on("finish", () => resolve(filePath));
//     writeStream.on("error", (err) => reject(err));
//   });
// };
