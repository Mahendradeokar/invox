import Handlebars from "handlebars";
import { decode } from "he";

// Dummy invoice data for template injection
export const DUMMY_INVOICE_DATA = {
  invoiceTitle: "Invoice - ACME Technologies Pvt. Ltd.",
  companyLogo: "http://acmelogos.com/images/logo-3.svg",
  companyName: "ACME Technologies Pvt. Ltd.",
  companyTagline: "Empowering Digital India",
  from: {
    name: "ACME Technologies Pvt. Ltd.",
    address:
      "5th Floor, Cyber Tower, Hinjewadi Phase 1, Pune, Maharashtra - 411057, India",
    phone: "+91 98765 43210",
    email: "contact@acmetech.in",
    website: "www.acmetech.in",
    gstin: "27AAECA1234F1Z5",
  },
  billTo: {
    name: "Sharma & Sons",
    address: "12, Connaught Place, New Delhi - 110001, India",
    contact: "Rajesh Sharma",
    email: "rajesh@sharmasons.in",
    phone: "+91 91234 56789",
    gstin: "07BBBCA5678G1Z2",
  },
  invoice: {
    number: "INV-2025-001",
    date: "2025-08-14",
    dueDate: "2025-08-29",
    paymentTerms: "Net 15",
    poNumber: "PO-DEL-2025-0456",
    project: "E-Commerce Website Development",
  },
  items: [
    {
      description: "Custom E-Commerce Website Development",
      hsn: "998314",
      qty: 1,
      unitPrice: 150000,
      discount: 0,
      taxableValue: 150000,
      cgst: 13500,
      sgst: 13500,
      igst: 0,
      total: 177000,
    },
    {
      description: "Annual Website Maintenance",
      hsn: "998315",
      qty: 1,
      unitPrice: 25000,
      discount: 0,
      taxableValue: 25000,
      cgst: 2250,
      sgst: 2250,
      igst: 0,
      total: 29500,
    },
  ],
  totals: {
    subtotal: 175000,
    cgstTotal: 15750,
    sgstTotal: 15750,
    totalGST: 31500,
    totalAmount: 206500,
    amountPaid: 100000,
    balanceDue: 106500,
  },
  payment: {
    bank: "State Bank of India",
    accountNumber: "12345678901",
    ifsc: "SBIN0000456",
    upi: "acmetech@sbi",
    note: "Please include the invoice number in payment remarks.",
  },
  terms:
    "Payment to be made within 15 days. Late payments will attract 2% interest per month.",
  footerNote: "Thank you for partnering with ACME Technologies!",
  support: {
    email: "support@acmetech.in",
    phone: "+91 98765 00000",
  },
};

// White label CDN domains allowed for script src, etc.
const ALLOWED_CDN_DOMAINS = [
  "https://cdn.tailwindcss.com",
  "https://placehold.co",
  "http://acmelogos.com",
];

const ALLOWED_URI_REGEXP = new RegExp(
  `^(${ALLOWED_CDN_DOMAINS.map((d) => d.replace(/\./g, "\\.")).join("|")})`
);

// Expanded config to allow html, head, meta, title, script, and their attributes
export const SANITIZE_CONFIG = {
  USE_PROFILES: { html: true },
  ADD_TAGS: ["script", "meta", "title", "head", "html", "link", "body"],
  ADD_ATTR: [
    "src",
    "charset",
    "name",
    "content",
    "http-equiv",
    "property",
    "lang",
    "viewport",
  ],
  ALLOWED_URI_REGEXP,
  FORBID_ATTR: [
    "onerror",
    "onload",
    "onclick",
    "onmouseover",
    "onfocus",
    "onblur",
  ],
  WHOLE_DOCUMENT: true,
  SAFE_FOR_TEMPLATES: true,
};

export class ArtifactService {
  static sanitizeHTML(html: string): string {
    /**
     * It's not handling the handlebar syntax properly.
     * Need to find the alternative
     * disabled for now.
     */

    // let doctype = "";
    // const doctypeMatch = html.match(/^\s*<!DOCTYPE[^>]*>/i);
    // if (doctypeMatch) {
    //   doctype = doctypeMatch[0];
    //   html = html.replace(doctype, "");
    // }
    // const sanitized = DOMPurify.sanitize(html, SANITIZE_CONFIG);

    // Normalize the HTML string and remove escape characters
    return decode(
      html.replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\t/g, "\t")
    );
  }

  static injectData(html: string, _data?: Record<string, unknown>): string {
    const template = Handlebars.compile(html);
    return template(_data ?? DUMMY_INVOICE_DATA);
  }
}
