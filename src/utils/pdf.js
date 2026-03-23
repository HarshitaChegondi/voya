import jsPDF from 'jspdf'

export const generatePDF = (chat, costItems) => {
  const doc = new jsPDF()
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const marginL = 14
  const marginR = pageW - 14
  const contentW = pageW - 28
  let y = 0

  const checkPage = (needed = 20) => {
    if (y + needed > pageH - 20) {
      doc.addPage()
      y = 20
    }
  }

  const addSpace = (n = 5) => { y += n }

  const addLine = () => {
    doc.setDrawColor(200, 190, 240)
    doc.setLineWidth(0.3)
    doc.line(marginL, y, marginR, y)
    y += 5
  }

  const addSectionTitle = (title) => {
    checkPage(16)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(124, 58, 237)
    doc.text(title, marginL, y)
    y += 5
    addLine()
  }


  // ── HEADER ──
  doc.setFillColor(19, 18, 26)
  doc.rect(0, 0, pageW, 38, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(167, 139, 250)
  doc.text('VOYA', marginL, 17)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(237, 233, 254)
  const titleText = doc.splitTextToSize(chat.title || 'Trip Summary', pageW - 80)
  doc.text(titleText, marginL, 27)

  doc.setFontSize(9)
  doc.setTextColor(167, 139, 250)
  const dateStr = new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })
  doc.text(dateStr, marginR, 27, { align: 'right' })

  y = 50

  // ── MESSAGES ──
  const assistantMsgs = chat.messages.filter(m => m.role === 'assistant')

  assistantMsgs.forEach((msg, idx) => {

    // text content
    if (msg.content) {
      checkPage(15)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(50, 30, 100)
      // clean up any stray characters
      const clean = msg.content.replace(/[^\u0020-\u007E]/g, '')      
      const lines = doc.splitTextToSize(clean, contentW)
      checkPage(lines.length * 5 + 4)
      doc.text(lines, marginL, y)
      y += lines.length * 5 + 6
    }

    // flights
    if (msg.type === 'flights' && msg.data && Array.isArray(msg.data)) {
      addSectionTitle('Flights')
      msg.data.forEach(f => {
        checkPage(20)
        const price = String(f.price || '').replace(/[^0-9.]/g, '')
        // route line
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(30, 10, 60)
        doc.text(`${f.from || ''} to ${f.to || ''}`, marginL, y)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(124, 58, 237)
        doc.text(`$${price}`, marginR, y, { align: 'right' })
        y += 5

        // details
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(100, 80, 160)
        const details = [
          f.depart && f.arrive ? `${f.depart} - ${f.arrive}` : '',
          f.airline || '',
          f.duration || '',
          f.stops || '',
        ].filter(Boolean).join('  |  ')
        doc.text(details, marginL + 4, y)
        y += 7
        addSpace(2)
      })
      addSpace(4)
    }

    // hotels
    if (msg.type === 'hotels' && msg.data && Array.isArray(msg.data)) {
      addSectionTitle('Hotels')
      msg.data.forEach(h => {
        checkPage(20)
        const price = String(h.price || '').replace(/[^0-9.]/g, '')
        // name + rating
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(30, 10, 60)
        doc.text(`${h.name || ''}`, marginL, y)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(124, 58, 237)
        doc.text(`$${price}/night`, marginR, y, { align: 'right' })
        y += 5

        // rating + location
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(100, 80, 160)
        const stars = `Rating: ${h.rating || 'N/A'}`
        doc.text(stars, marginL + 4, y)
        y += 5

        if (h.location) {
          doc.text(h.location, marginL + 4, y)
          y += 5
        }

        if (h.amenities) {
          doc.setTextColor(130, 110, 180)
          const amenLines = doc.splitTextToSize(h.amenities, contentW - 8)
          doc.text(amenLines, marginL + 4, y)
          y += amenLines.length * 4.5 + 1
        }

        addSpace(4)
      })
      addSpace(2)
    }

    // itinerary
    if (msg.type === 'itinerary' && msg.data && Array.isArray(msg.data)) {
      addSectionTitle('Itinerary')
      msg.data.forEach(day => {
        checkPage(14)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(124, 58, 237)
        doc.text(day.label || '', marginL, y)
        y += 5

        ;(day.items || []).forEach(item => {
          checkPage(8)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          doc.setTextColor(100, 80, 160)
          doc.text(item.time || '', marginL + 4, y)
          doc.setTextColor(50, 30, 100)
          const evtLines = doc.splitTextToSize(item.event || '', contentW - 28)
          doc.text(evtLines, marginL + 28, y)
          y += Math.max(evtLines.length * 4.5, 5) + 1
        })
        addSpace(4)
      })
      addSpace(2)
    }

    // packing list — 2 columns
    if (msg.type === 'packing' && msg.data && Array.isArray(msg.data)) {
      addSectionTitle('Packing List')
      const colW = contentW / 2
      msg.data.forEach((item, i) => {
        checkPage(7)
        const col = i % 2 === 0 ? marginL : marginL + colW
        if (i % 2 === 0 && i > 0) addSpace(0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(50, 30, 100)
        doc.text(`[ ]  ${item}`, col, y)
        if (i % 2 === 1) y += 6
      })
      if (msg.data.length % 2 !== 0) y += 6
      addSpace(4)
    }

    // weather
    if (msg.weather) {
      addSectionTitle('Weather Forecast')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(50, 30, 100)
      doc.text(`${msg.weather.city}   ${msg.weather.temp}C   ${msg.weather.description || ''}`, marginL, y)
      y += 6
      if (msg.weather.tip) {
        doc.setTextColor(100, 80, 160)
        doc.text(msg.weather.tip, marginL, y)
        y += 6
      }
      addSpace(4)
    }

    // divider between messages
    if (idx < assistantMsgs.length - 1) {
      checkPage(8)
      addSpace(2)
      doc.setDrawColor(220, 210, 250)
      doc.setLineWidth(0.2)
      doc.line(marginL, y, marginR, y)
      addSpace(6)
    }
  })

  // ── COST SUMMARY ──
  if (costItems && costItems.length > 0) {
    checkPage(40)
    addSpace(6)
    addSectionTitle('Cost Summary')

    let total = 0
    costItems.forEach(item => {
      checkPage(9)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(50, 30, 100)
      doc.text(item.label, marginL, y)
      doc.setTextColor(124, 58, 237)
      doc.text(`$${Number(item.amount || 0).toLocaleString()}`, marginR, y, { align: 'right' })
      y += 7
      total += Number(item.amount || 0)
    })

    doc.setDrawColor(167, 139, 250)
    doc.setLineWidth(0.5)
    doc.line(marginL, y, marginR, y)
    y += 6

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(124, 58, 237)
    doc.text('Total Estimated Cost', marginL, y)
    doc.text(`$${total.toLocaleString()}`, marginR, y, { align: 'right' })
    y += 10
  }

  // ── FOOTER on every page ──
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(167, 139, 250)
    doc.text('Powered by VOYA AI  |  Built for Spotnana', pageW / 2, pageH - 8, { align: 'center' })
    doc.setTextColor(200, 190, 240)
    doc.text(`${i} / ${pageCount}`, marginR, pageH - 8, { align: 'right' })
  }

  const filename = `${(chat.title || 'trip').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_voya.pdf`
  doc.save(filename)
}