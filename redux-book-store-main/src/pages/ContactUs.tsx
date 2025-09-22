// src/pages/ContactUs.tsx
const ContactUs = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Contact Us</h1>
      <form className="space-y-6">
        <div>
          <label className="block text-gray-700">Your Name</label>
          <input
            type="text"
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email Address</label>
          <input
            type="email"
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-gray-700">Message</label>
          <textarea
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            rows={4}
            placeholder="Type your message here..."
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
