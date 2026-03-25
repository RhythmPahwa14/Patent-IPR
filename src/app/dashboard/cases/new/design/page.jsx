"use client";
import GenericFilingForm from "@/components/dashboard/GenericFilingForm";

const designFormSections = {
  details: {
    required: [
      { key: "articleName", label: "Article Name (product name)", type: "text", required: true, placeholder: "e.g. Smart Bottle" },
      { key: "locarnoClass", label: "Class (Locarno Classification)", type: "select", required: true, options: ["Class 02", "Class 09", "Class 11", "Class 14", "Class 32"] },
      { key: "briefDescription", label: "Brief Description of Design", type: "textarea", required: true, placeholder: "Describe the novel visual features of the design.", rows: 4 },
    ],
    optional: [
      { key: "priorityDate", label: "Priority Date", type: "date" },
      { key: "statementOfNovelty", label: "Statement of Novelty", type: "textarea", placeholder: "Mention novelty statement" },
      { key: "disclaimer", label: "Disclaimer (if partial design claimed)", type: "textarea", placeholder: "Mention portions not claimed" },
    ],
  },
  applicant: {
    required: [
      { key: "applicantName", label: "Applicant Name", type: "text", required: true, placeholder: "e.g. John Doe" },
      { key: "address", label: "Address", type: "textarea", required: true, placeholder: "Enter full address", rows: 3 },
    ],
    optional: [
      { key: "agentDetails", label: "Agent Details", type: "textarea", placeholder: "Name, reg no., contact" },
    ],
  },
  documents: {
    required: [
      { key: "representationOfDesign", label: "Representation of Design (Images / Drawings)", type: "file", required: true, multiple: true, accept: ".png,.jpg,.jpeg,.pdf", acceptHint: "Multiple images or PDF" },
      { key: "declaration", label: "I hereby declare that submitted design details are true and correct.", type: "checkbox", required: true },
    ],
    optional: [
      { key: "multipleViewsUpload", label: "Multiple Views Upload (front, side, top, etc.)", type: "file", multiple: true, accept: ".png,.jpg,.jpeg,.pdf", acceptHint: "Multiple files allowed" },
    ],
  },
};

export default function NewDesignFilingPage() {
  return (
    <GenericFilingForm
      filingType="design"
      heading="New Design Filing"
      subheading="Submit a new design registration application."
      sections={designFormSections}
      referencePrefix="DR"
      caseIdLabel="Design ID"
    />
  );
}
