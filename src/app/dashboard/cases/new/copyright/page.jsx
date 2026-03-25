"use client";
import GenericFilingForm from "@/components/dashboard/GenericFilingForm";

const copyrightFormSections = {
  details: {
    required: [
      { key: "workType", label: "Work Type", type: "select", required: true, options: ["Literary", "Artistic", "Software", "Music", "Cinematograph Film"] },
      { key: "titleOfWork", label: "Title of Work", type: "text", required: true, placeholder: "e.g. IP Automation Toolkit" },
      { key: "authorDetails", label: "Author Details", type: "textarea", required: true, placeholder: "Author name and details", rows: 3 },
      { key: "yearOfCreation", label: "Year of Creation", type: "text", required: true, placeholder: "e.g. 2026" },
    ],
    optional: [
      { key: "publishedStatus", label: "Published / Unpublished status", type: "radio", options: ["Published", "Unpublished"], defaultValue: "Unpublished" },
      { key: "dateOfPublication", label: "Date of Publication", type: "date" },
      { key: "publisherDetails", label: "Publisher Details", type: "textarea", placeholder: "Publisher name and address" },
      { key: "languageOfWork", label: "Language of Work", type: "text", placeholder: "e.g. English" },
      { key: "coAuthors", label: "Co-authors (if any)", type: "textarea", placeholder: "List co-authors details" },
      { key: "rightsOwnerDetails", label: "Rights Owner Details (if different from author)", type: "textarea", placeholder: "Rights owner details" },
    ],
  },
  applicant: {
    required: [
      { key: "applicantName", label: "Applicant Name", type: "text", required: true, placeholder: "e.g. John Doe" },
      { key: "address", label: "Address", type: "textarea", required: true, placeholder: "Enter full address", rows: 3 },
    ],
    optional: [],
  },
  documents: {
    required: [
      { key: "workFile", label: "Work File Upload (PDF, code, image, etc.)", type: "file", required: true, accept: ".pdf,.doc,.docx,.txt,.zip,.png,.jpg,.jpeg", acceptHint: "PDF, DOC, TXT, ZIP, PNG, JPG" },
      { key: "declaration", label: "I hereby declare that the submitted work is original and information is true.", type: "checkbox", required: true },
    ],
    optional: [
      { key: "nocUpload", label: "NOC (if work is assigned)", type: "file", accept: ".pdf,.doc,.docx", acceptHint: "PDF, DOC, DOCX" },
    ],
  },
};

export default function NewCopyrightFilingPage() {
  return (
    <GenericFilingForm
      filingType="copyright"
      heading="New Copyright Filing"
      subheading="Submit a new copyright registration application."
      sections={copyrightFormSections}
      referencePrefix="CR"
      caseIdLabel="Copyright ID"
    />
  );
}
