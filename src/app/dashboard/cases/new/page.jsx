"use client";
import GenericFilingForm from "@/components/dashboard/GenericFilingForm";

const patentFormSections = {
  details: {
    required: [
      { key: "titleOfInvention", label: "Title of Invention", type: "text", required: true, placeholder: "e.g. AI-Driven Sorting System" },
      { key: "abstractOfInvention", label: "Abstract of Invention", type: "textarea", required: true, placeholder: "Provide a concise technical abstract...", rows: 4 },
      { key: "fieldOfInvention", label: "Field of Invention (Technical domain)", type: "text", required: true, placeholder: "e.g. Mechanical Engineering" },
      { key: "claims", label: "Claims (text or file)", type: "textarea", required: true, placeholder: "Enter key patent claims here (or upload in documents step).", rows: 4 },
    ],
    optional: [
      { key: "priorityDate", label: "Priority Date", type: "date" },
      { key: "specificationChoice", label: "Provisional / Complete Specification", type: "radio", options: ["Provisional", "Complete"], defaultValue: "Complete" },
      { key: "fastTrackRequest", label: "Fast Track Request", type: "radio", options: ["Yes", "No"], defaultValue: "No" },
    ],
  },
  applicant: {
    required: [
      { key: "applicantName", label: "Applicant Name", type: "text", required: true, placeholder: "e.g. John Doe" },
      { key: "applicantType", label: "Applicant Type", type: "select", required: true, options: ["Individual", "Startup", "Company"] },
      { key: "address", label: "Address (Full Address)", type: "textarea", required: true, placeholder: "Enter full address", rows: 3 },
      { key: "country", label: "Country", type: "text", required: true, placeholder: "e.g. India" },
      { key: "inventorName", label: "Inventor Details - Name", type: "text", required: true, placeholder: "Inventor full name" },
      { key: "inventorAddress", label: "Inventor Details - Address", type: "textarea", required: true, placeholder: "Inventor address", rows: 3 },
    ],
    optional: [
      { key: "patentAgentDetails", label: "Patent Agent Details", type: "textarea", placeholder: "Name, reg no., contact" },
      { key: "correspondenceAddress", label: "Correspondence Address (if different)", type: "textarea", placeholder: "Enter correspondence address" },
    ],
  },
  documents: {
    required: [
      { key: "specificationDocument", label: "Specification Document (PDF upload)", type: "file", required: true, accept: ".pdf", acceptHint: "PDF only" },
      { key: "declarationConsent", label: "I hereby declare that the submitted information is true and I provide consent for filing.", type: "checkbox", required: true },
    ],
    optional: [
      { key: "claimsFile", label: "Claims File Upload", type: "file", accept: ".pdf,.doc,.docx", acceptHint: "PDF, DOC, DOCX" },
      { key: "drawingsDiagrams", label: "Drawings / Diagrams upload", type: "file", accept: ".pdf,.png,.jpg,.jpeg", acceptHint: "PDF, PNG, JPG" },
      { key: "supportingDocuments", label: "Supporting Documents (proofs, annexures)", type: "file", multiple: true, accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg", acceptHint: "Multiple files allowed" },
    ],
  },
};

export default function NewPatentFilingPage() {
  return (
    <GenericFilingForm
      filingType="patent"
      heading="New Patent Filing"
      subheading="Submit a new patent filing application."
      sections={patentFormSections}
      referencePrefix="PT"
      caseIdLabel="Patent ID"
    />
  );
}
