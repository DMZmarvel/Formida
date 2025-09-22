import benefits from '../../Images/benefits.png';
import './benefits.css'; // 👈 make sure this import is active
import {
  AiOutlineInbox,
  AiOutlineDollarCircle,
  AiOutlineRotateLeft,
} from 'react-icons/ai';
import { FaPeopleArrows } from 'react-icons/fa';

const Benefits = () => {
  return (
    <section className="bg-white w-full flex flex-col lg:flex-row justify-center items-center py-14 mb-10 gap-10">
      {/* Left illustration */}
      <div className="w-full px-4 lg:w-1/3">
        <img
          src={benefits}
          alt="Benefits illustration"
          className="rounded-xl shadow-md"
        />
      </div>

      {/* Right content */}
      <div className="lg:w-[60ch] px-4">
        <h2 className="text-4xl font-extrabold my-5 text-gray-900">
          Why Choose <span className="text-blue-600">Formida?</span>
        </h2>
        <p className="my-5 text-gray-600">
          Publish and manage your public notices with ease. Fast, reliable, and
          tailored for individuals, organizations, and legal compliance.
        </p>

        {/* Benefit cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border hover:shadow-lg transition">
            <div className="icon-blob mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xl shadow">
              <AiOutlineInbox />
            </div>
            <h3 className="font-semibold text-gray-900">Centralized Records</h3>
            <p className="text-sm text-gray-600 mt-1">
              Access and manage all your published notices from one place.
            </p>
          </div>

          <div className="p-5 rounded-xl border hover:shadow-lg transition">
            <div className="icon-blob mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xl shadow">
              <AiOutlineDollarCircle />
            </div>
            <h3 className="font-semibold text-gray-900">Transparent Pricing</h3>
            <p className="text-sm text-gray-600 mt-1">
              Clear, flexible pricing without hidden costs.
            </p>
          </div>

          <div className="p-5 rounded-xl border hover:shadow-lg transition">
            <div className="icon-blob mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xl shadow">
              <FaPeopleArrows />
            </div>
            <h3 className="font-semibold text-gray-900">Dedicated Support</h3>
            <p className="text-sm text-gray-600 mt-1">
              Our support team is always available to assist with your notices.
            </p>
          </div>

          <div className="p-5 rounded-xl border hover:shadow-lg transition">
            <div className="icon-blob mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xl shadow">
              <AiOutlineRotateLeft />
            </div>
            <h3 className="font-semibold text-gray-900">Easy Revisions</h3>
            <p className="text-sm text-gray-600 mt-1">
              Update or resubmit your notices quickly and efficiently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
