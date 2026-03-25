"use client";
import GenericFilingForm from "@/components/dashboard/GenericFilingForm";

const trademarkFormSections = {
  details: {
    required: [
      { key: "trademarkName", label: "Trademark Name", type: "text", required: true, placeholder: "e.g. PATENTIPR" },
      { key: "classOfTrademark", label: "Class of Trademark (Nice Classification)", type: "select", required: true, options: ["Class 9", "Class 25", "Class 35", "Class 41", "Class 42"] },
      { key: "descriptionGoodsServices", label: "Description of Goods/Services", type: "textarea", required: true, placeholder: "Describe goods/services covered under this trademark.", rows: 4 },
      { key: "usageStatus", label: "Usage Status", type: "radio", required: true, options: ["Used", "Proposed to be used"], defaultValue: "Proposed to be used" },
      { key: "dateOfFirstUse", label: "Date of First Use (if used)", type: "date", required: true },
    ],
    optional: [
      { key: "multipleClasses", label: "Multiple Classes selection", type: "multiselect", options: ["Class 9", "Class 25", "Class 35", "Class 41", "Class 42"] },
      { key: "colorClaim", label: "Color Claim (if logo has specific colors)", type: "text", placeholder: "e.g. Blue and Gold" },
      { key: "translationTransliteration", label: "Translation / Transliteration (if non-English)", type: "textarea", placeholder: "Provide translation/transliteration details", rows: 3 },
    ],
  },
  applicant: {
    required: [
      { key: "applicantName", label: "Applicant Name", type: "text", required: true, placeholder: "e.g. John Doe" },
      { key: "applicantType", label: "Applicant Type", type: "select", required: true, options: ["Individual", "Startup", "Company"] },
      { key: "address", label: "Address", type: "textarea", required: true, placeholder: "Enter full address", rows: 3 },
    ],
    optional: [
      { key: "trademarkAgentDetails", label: "Trademark Agent Details", type: "textarea", placeholder: "Name, reg no., contact" },
    ],
  },
  documents: {
    required: [
      { key: "trademarkLogo", label: "Trademark Name / Logo Upload", type: "file", required: true, accept: ".png,.jpg,.jpeg,.pdf", acceptHint: "PNG, JPG, PDF" },
      { key: "declaration", label: "I hereby declare that the trademark details submitted are true and correct.", type: "checkbox", required: true },
    ],
    optional: [
      { key: "powerOfAttorney", label: "Power of Attorney upload", type: "file", accept: ".pdf,.doc,.docx", acceptHint: "PDF, DOC, DOCX" },
      { key: "msmeStartupCertificate", label: "MSME / Startup Certificate", type: "file", accept: ".pdf,.jpg,.jpeg,.png", acceptHint: "PDF, JPG, PNG" },
    ],
  },
};

export default function NewTrademarkFilingPage() {
  return (
    <GenericFilingForm
      filingType="trademark"
      heading="New Trademark Filing"
      subheading="Submit a new trademark registration application."
      sections={trademarkFormSections}
      referencePrefix="TM"
      caseIdLabel="Trademark ID"
    />
  );
}
