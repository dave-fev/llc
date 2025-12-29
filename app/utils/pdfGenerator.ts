
import jsPDF from 'jspdf';

interface Order {
  id: number;
  order_number: string;
  tx_ref?: string;
  company_name: string;
  state: string;
  state_fee: number;
  purpose?: string;
  physical_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  } | string; // Handle both just in case, but prefer object
  mailing_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  } | string;
  same_as_physical: boolean;
  management_type: string;
  owners?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  }[];
  managers?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  }[];
  contact_email: string;
  contact_phone: string;
  account_email: string;
  additional_services?: {
    ein: boolean;
    website: boolean;
    itin: boolean;
    branding: boolean;
  };
  physical_registered_agent?: boolean;
  physical_agent_address?: string;
  mailing_registered_agent?: boolean;
  mailing_agent_address?: string;
  amount: number;
  status: string;
  payment_method?: string; // made optional
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  } | null;
}

export function generateOrderPDF(order: Order) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * (fontSize * 0.4); // approx line height
  };

  // Helper function to add a section header
  const addSectionHeader = (title: string) => {
    checkPageBreak(15);
    yPosition += 5;
    doc.setFillColor(41, 41, 41);
    doc.rect(margin, yPosition, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 5, yPosition + 5.5);
    doc.setTextColor(0, 0, 0);
    yPosition += 12;
  };

  // Helper function to add a field
  const addField = (label: string, value: string | number | undefined, isFullWidth: boolean = false) => {
    checkPageBreak(10);
    const fieldWidth = isFullWidth ? contentWidth : contentWidth / 2;
    const xPos = isFullWidth ? margin : (label.includes('Address') || label.includes('Purpose') ? margin : margin);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text(label + ':', xPos, yPosition);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const valueText = value !== undefined && value !== null ? String(value) : 'N/A';
    const valueHeight = addText(valueText, xPos, yPosition + 5, fieldWidth - 5, 10, false);

    if (isFullWidth) {
      yPosition += valueHeight + 8;
    } else {
      // Simple sequential layout for robustness
      yPosition += valueHeight + 8;
    }
  };

  // Helper to formatting address object to string
  const formatAddress = (addr: any): string => {
    if (!addr) return 'N/A';
    if (typeof addr === 'string') return addr;
    if (typeof addr === 'object') {
      return `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.zip || ''}`.trim().replace(/^, /, '').replace(/, $/, '');
    }
    return 'N/A';
  };

  // --- HEADER ---
  doc.setFillColor(29, 29, 29);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER DETAILS', margin, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order #${order.order_number}`, pageWidth - margin - 50, 25);

  doc.setTextColor(0, 0, 0);
  yPosition = 50;

  // --- ORDER INFO ---
  addSectionHeader('ORDER INFORMATION');
  addField('Order Number', order.order_number);
  addField('Transaction Reference', order.tx_ref || 'N/A');
  const statusStr = order.status || 'pending';
  addField('Status', statusStr.charAt(0).toUpperCase() + statusStr.slice(1));
  addField('Payment Method', order.payment_method ? order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1) : 'Online');
  addField('Amount', `$${Number(order.amount || 0).toFixed(2)}`);
  addField('Order Date', order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A');
  addField('Last Updated', order.updated_at ? new Date(order.updated_at).toLocaleDateString() : 'N/A');

  // --- COMPANY INFO ---
  addSectionHeader('COMPANY INFORMATION');
  addField('Company Name', order.company_name);
  addField('State', order.state);
  addField('State Fee', `$${Number(order.state_fee || 0).toFixed(2)}`);
  const mgmtType = (order.management_type || 'member-managed').replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  addField('Management Type', mgmtType);
  if (order.purpose) {
    addField('Business Purpose', order.purpose, true);
  }

  // --- ADDRESSES ---
  addSectionHeader('ADDRESSES');
  addField('Physical Address', formatAddress(order.physical_address), true);
  if (order.physical_registered_agent) {
    addField('Physical Registered Agent', order.physical_agent_address || 'N/A', true);
  }
  if (order.same_as_physical) {
    addField('Mailing Address', 'Same as Physical Address', true);
  } else {
    addField('Mailing Address', formatAddress(order.mailing_address), true);
    if (order.mailing_registered_agent) {
      addField('Mailing Registered Agent', order.mailing_agent_address || 'N/A', true);
    }
  }

  // --- OWNERS ---
  if (order.owners && order.owners.length > 0) {
    addSectionHeader('OWNERS / MEMBERS');
    order.owners.forEach((owner, index) => {
      checkPageBreak(25);
      yPosition += 3;
      // Background box for owner
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition - 3, contentWidth, 22, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`Owner ${index + 1}: ${owner.firstName} ${owner.lastName}`, margin + 5, yPosition + 5);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Email: ${owner.email}`, margin + 5, yPosition + 12);
      doc.text(`Phone: ${owner.phone}`, margin + 5, yPosition + 17);

      yPosition += 25;
    });
  }

  // --- MANAGERS ---
  if (order.managers && order.managers.length > 0) {
    addSectionHeader('MANAGERS');
    order.managers.forEach((manager, index) => {
      checkPageBreak(25);
      yPosition += 3;
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition - 3, contentWidth, 22, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`Manager ${index + 1}: ${manager.firstName} ${manager.lastName}`, margin + 5, yPosition + 5);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Email: ${manager.email}`, margin + 5, yPosition + 12);
      doc.text(`Phone: ${manager.phone}`, margin + 5, yPosition + 17);

      yPosition += 25;
    });
  }

  // --- CONTACT ---
  addSectionHeader('CONTACT INFORMATION');
  addField('Contact Email', order.contact_email);
  addField('Contact Phone', order.contact_phone);
  addField('Account Email', order.account_email);

  // --- SERVICES ---
  if (order.additional_services) {
    const services: string[] = [];
    if (order.additional_services.ein) services.push('EIN');
    if (order.additional_services.website) services.push('Professional Website');
    if (order.additional_services.itin) services.push('ITIN Application');
    if (order.additional_services.branding) services.push('Branding Package');

    if (services.length > 0) {
      addSectionHeader('ADDITIONAL SERVICES');
      checkPageBreak(10);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(services.join(', '), margin, yPosition + 5);
      yPosition += 15;
    }
  }

  // --- FOOTER ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  const fileName = `Order-${order.order_number}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
