// src/pages/FAQ.tsx
const FAQ = () => {
  const faqs = [
    {
      q: 'What is Formida?',
      a: 'Formida is a digital platform for managing and publishing public notices.',
    },
    {
      q: 'How do I submit a notice?',
      a: "You can create an account and use the 'Submit Notice' page.",
    },
    {
      q: 'Is there a fee?',
      a: 'Some notices may require a small fee depending on publication requirements.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Frequently Asked Questions
      </h1>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b pb-4">
            <h3 className="font-semibold text-lg text-gray-800">{faq.q}</h3>
            <p className="text-gray-600 mt-2">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
