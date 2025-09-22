// src/pages/SupportCenter.tsx
const SupportCenter = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Support Center</h1>
      <p className="text-gray-700 mb-4">
        Need help? Our support team is here to guide you.
      </p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>
          Email us: <span className="font-semibold">support@formida.com</span>
        </li>
        <li>Call: +234 800 123 4567</li>
        <li>Live chat available Mon–Fri, 9AM – 5PM</li>
      </ul>
    </div>
  );
};

export default SupportCenter;
