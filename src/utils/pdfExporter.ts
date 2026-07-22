import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TravelGuideData } from '../types';

export async function exportGuideToPDF(elementId: string, guideData: TravelGuideData): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    window.print();
    return;
  }

  try {
    // Canvas options for high quality rendering
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const fileName = `${guideData.overview.name.replace(/\s+/g, '_')}_Travel_Guide_AI.pdf`;
    pdf.save(fileName);
  } catch (err) {
    console.warn('HTML2Canvas failed, falling back to window print', err);
    window.print();
  }
}
