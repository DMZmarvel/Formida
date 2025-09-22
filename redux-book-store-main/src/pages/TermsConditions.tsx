// src/pages/TermsConditions.tsx
const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Terms & Conditions
      </h1>
      <p className="text-gray-700 mb-4">
        By using Formida, you agree to these terms. Please read carefully.
      </p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>
          Users must provide accurate information when using our services.
        </li>
        <li>We reserve the right to suspend accounts that violate policies.</li>
        <li>
          All content and trademarks belong to Formida unless stated otherwise.
        </li>
      </ul>
    </div>
  );
};

export default TermsConditions;
