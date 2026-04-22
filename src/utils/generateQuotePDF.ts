import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface QuoteData {
  customer_name: string
  customer_email: string
  company_name: string
  country: string
  phone?: string
  product_name: string
  quantity: string
  target_price?: string
  specifications?: string
  delivery_terms: string
  payment_terms: string
  message?: string
  quote_number?: string
  valid_until?: string
}

export const generateQuotePDF = (data: QuoteData) => {
  const doc = new jsPDF()
  
  // Company branding colors
  const primaryColor = [102, 126, 234] // #667eea
  const secondaryColor = [51, 51, 51] // #333
  
  // Header - Company Logo and Info
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('FIXTURERB2B', 105, 20, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Professional Display Solutions', 105, 28, { align: 'center' })
  doc.text('www.fixturerb2b.top | info@fixturerb2b.top', 105, 34, { align: 'center' })
  
  // Document Title
  doc.setTextColor(...secondaryColor)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('QUOTATION', 105, 55, { align: 'center' })
  
  // Quote Number and Date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const quoteNumber = data.quote_number || `QT-${Date.now().toString().slice(-6)}`
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  const validUntil = data.valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  doc.text(`Quote Number: ${quoteNumber}`, 14, 65)
  doc.text(`Date: ${today}`, 14, 71)
  doc.text(`Valid Until: ${validUntil}`, 14, 77)
  
  // Customer Information
  doc.setDrawColor(200, 200, 200)
  doc.setFillColor(248, 249, 250)
  doc.roundedRect(14, 85, 90, 35, 3, 3, 'FD')
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('BILL TO:', 18, 93)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...secondaryColor)
  doc.text(data.customer_name, 18, 100)
  doc.text(data.company_name, 18, 106)
  doc.text(data.country, 18, 112)
  if (data.phone) {
    doc.text(`Phone: ${data.phone}`, 18, 118)
  }
  
  // Product Details Table
  const tableStartY = 130
  autoTable(doc, {
    startY: tableStartY,
    head: [['Description', 'Quantity', 'Unit Price', 'Total']],
    body: [
      [
        data.product_name + (data.specifications ? `\n${data.specifications}` : ''),
        data.quantity,
        data.target_price || 'TBD',
        data.target_price || 'TBD'
      ]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: secondaryColor
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' }
    },
    styles: {
      fontSize: 9,
      cellPadding: 5
    }
  })
  
  // Trade Terms
  const termsY = (doc as any).lastAutoTable.finalY + 15
  doc.setFillColor(248, 249, 250)
  doc.roundedRect(14, termsY, 182, 30, 3, 3, 'F')
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('TRADE TERMS:', 18, termsY + 10)
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...secondaryColor)
  doc.text(`Delivery Terms: ${data.delivery_terms}`, 18, termsY + 18)
  doc.text(`Payment Terms: ${data.payment_terms}`, 100, termsY + 18)
  
  // Additional Notes
  if (data.message) {
    const notesY = termsY + 40
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text('NOTES:', 14, notesY)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...secondaryColor)
    const splitText = doc.splitTextToSize(data.message, 180)
    doc.text(splitText, 14, notesY + 8)
  }
  
  // Footer - Terms and Conditions
  const pageHeight = doc.internal.pageSize.height
  doc.setDrawColor(200, 200, 200)
  doc.line(14, pageHeight - 50, 196, pageHeight - 50)
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('Terms & Conditions:', 14, pageHeight - 42)
  
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  const terms = [
    '1. This quotation is valid for 30 days from the date of issue.',
    '2. Prices are subject to change based on raw material costs.',
    '3. Payment terms: 30% deposit, 70% before shipment.',
    '4. Delivery time: 15-25 days after receiving deposit.',
    '5. Quality guarantee: 100% inspection before shipment.'
  ]
  
  let termY = pageHeight - 36
  terms.forEach(term => {
    doc.text(term, 14, termY)
    termY += 5
  })
  
  // Signature Area
  doc.setDrawColor(200, 200, 200)
  doc.line(14, pageHeight - 15, 70, pageHeight - 15)
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('Authorized Signature', 14, pageHeight - 10)
  
  doc.line(120, pageHeight - 15, 196, pageHeight - 15)
  doc.text('Company Stamp', 120, pageHeight - 10)
  
  // Save PDF
  const fileName = `Quotation_${quoteNumber}_${data.customer_name.replace(/\s+/g, '_')}.pdf`
  doc.save(fileName)
  
  return { doc, fileName }
}

// Helper function to send quote via email
export const sendQuoteEmail = async (quoteData: QuoteData, pdfBlob: Blob) => {
  // This would integrate with your email service
  console.log('Sending quote to:', quoteData.customer_email)
  console.log('PDF attached:', pdfBlob)
  
  // Example implementation with Resend API
  /*
  const formData = new FormData()
  formData.append('to', quoteData.customer_email)
  formData.append('subject', `Quotation for ${quoteData.product_name}`)
  formData.append('html', generateEmailHTML(quoteData))
  formData.append('attachments', pdfBlob, 'quotation.pdf')
  
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: formData
  })
  */
}

const generateEmailHTML = (data: QuoteData) => {
  return `
    <h1>Quotation for ${data.product_name}</h1>
    <p>Dear ${data.customer_name},</p>
    <p>Please find attached our quotation for your inquiry.</p>
    <p>If you have any questions, please don't hesitate to contact us.</p>
    <p>Best regards,<br>FixtureRB2B Team</p>
  `
}
