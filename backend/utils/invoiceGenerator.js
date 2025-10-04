import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

// ----- ES module __dirname fix -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoicePDF = (order, res, orderId) => {
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  let buffers = [];

  // Collect PDF chunks
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(buffers);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${orderId}.pdf`
    );
    res.send(pdfBuffer);
  });

  // ----- Register Fonts -----
  const regularFontPath = path.join(__dirname, "../fonts/Roboto-Regular.ttf");
  const boldFontPath = path.join(__dirname, "../fonts/Roboto-Bold.ttf");
  doc.registerFont("Roboto-Regular", regularFontPath);
  doc.registerFont("Roboto-Bold", boldFontPath);

  // ----- Header -----
  doc.font("Roboto-Bold")
    .fontSize(23)
    .fillColor("#0493fb")
    .text("Ecommerce Site", 50, 50);

  doc.font("Roboto-Regular")
    .fontSize(10)
    .fillColor("#555")
    .text("1st Floor, Gandhi Nagar 1st Main Street, Adyar, Chennai, India", 50, 77)
    .text("Email: support@ecommercesite.com", 50, 90)
    .text("Phone: +91 9962887554", 50, 105);

  // ----- Invoice Title -----
  doc.font("Roboto-Bold")
    .fontSize(18)
    .fillColor("#000")
    .text("INVOICE", 400, 50);

  doc.font("Roboto-Regular")
    .fontSize(10)
    .fillColor("#555")
    .text(`Invoice #: INV-${orderId}`, 400, 75)
    .text(`Date: ${new Date(order.created_at).toLocaleDateString('en-IN')}`, 400, 90);

  // ----- Customer Info -----
  const customerY = 140;
  doc.font("Roboto-Regular")
    .fontSize(12)
    .fillColor("#000")
    .text(`Customer: ${order.name || ''}`, 50, customerY)
    .text(`Mobile: ${order.mobile_number || ''}`, 50, customerY + 15)
    .text(`Address: ${order.address || ''}`, 50, customerY + 30)
    .text(`Payment Method: ${order.payment_method || 'N/A'}`, 50, customerY + 45);

  // ----- Table Header -----
  const tableTop = 220;
  const colNo = 50;
  const colProduct = 80;
  const colQty = 300;
  const colUnit = 360;
  const colTotal = 450;

  doc.font("Roboto-Bold")
    .fontSize(12)
    .fillColor("#000")
    .text("No", colNo, tableTop)
    .text("Product", colProduct, tableTop)
    .text("Qty", colQty, tableTop, { width: 50, align: "right" })
    .text("Unit Price", colUnit, tableTop, { width: 80, align: "right" })
    .text("Total", colTotal, tableTop, { width: 90, align: "right" });

  doc.moveTo(50, tableTop + 15)
    .lineTo(540, tableTop + 15)
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .stroke();

  // ----- Table Rows -----
  let rowY = tableTop + 25;
  order.items.forEach((item, index) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const unitPrice = qty > 0 ? price / qty : 0;

    const formattedUnitPrice = unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    const formattedTotalPrice = price.toLocaleString('en-IN', { minimumFractionDigits: 2 });

    doc.font("Roboto-Regular")
      .fontSize(12)
      .fillColor("#333")
      .text(index + 1, colNo, rowY)
      .text(item.product.product_name || '', colProduct, rowY)
      .text(qty, colQty, rowY, { width: 50, align: "right" })
      .text(`₹${formattedUnitPrice}`, colUnit, rowY, { width: 80, align: "right" })
      .text(`₹${formattedTotalPrice}`, colTotal, rowY, { width: 90, align: "right" });

    rowY += 20;
  });

  // ----- Totals -----
  const totalY = rowY + 10;
  doc.moveTo(350, totalY)
    .lineTo(540, totalY)
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .stroke();

  const subtotal = Number(order.total_amount) || 0;
  const discount = (Number(order.discount) + Number(order.coupon_discount)) || 0;
  const deliveryFee = Number(order.delivery_fee) || 0;
  const finalAmount = Number(order.final_amount) || 0;

  doc.font("Roboto-Regular")
    .fontSize(12)
    .fillColor("#333")
    .text(`Subtotal: ₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 360, totalY + 10, { align: "right" })
    .text(`Discount: -₹${discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 360, totalY + 30, { align: "right" })
    .text(`Delivery Fee: ₹${deliveryFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 360, totalY + 50, { align: "right" })
    .font("Roboto-Bold")
    .fontSize(14)
    .fillColor("#000")
    .text(`Final Amount: ₹${finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 360, totalY + 70, { align: "right" });

  // ----- Watermark -----
  const watermarkText = "Ecommerce Site";
  doc.save()
    .rotate(-45, { origin: [300, 400] })
    .font("Roboto-Bold")
    .fontSize(60)
    .fillColor("gray")
    .opacity(0.1)
    .text(watermarkText, 100, 300, {
      align: "center",
      width: 400
    })
    .restore();

  // ----- Footer -----
  const footerY = totalY + 120;
  doc.font("Roboto-Regular")
    .fontSize(10)
    .fillColor("#777")
    .text("Thank you for your order!", 50, footerY, { align: "center" })
    .text("Visit again: www.ecommercesite.com", 50, footerY + 15, { align: "center" });
  doc.end();
};

