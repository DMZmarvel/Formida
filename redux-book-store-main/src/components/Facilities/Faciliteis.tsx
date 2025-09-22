import { BsRocketTakeoff, BsFingerprint } from 'react-icons/bs';
import { AiOutlineHtml5 } from 'react-icons/ai';
import { BiPaperPlane } from 'react-icons/bi';

const Facilities = () => {
  return (
    <section className="relative py-16 bg-gray-50">
      <div className="items-center flex flex-wrap max-w-6xl mx-auto">
        {/* Left image */}
        <div className="w-full md:w-5/12 px-4 mb-10 md:mb-0">
          <img
            alt="Facilities"
            className="max-w-full rounded-2xl shadow-lg"
            src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&w=800&q=80"
          />
        </div>

        {/* Right content */}
        <div className="w-full md:w-6/12 px-4">
          <div className="md:pl-12">
            {/* Main icon */}
            <div className="text-blue-600 p-4 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-md rounded-full bg-blue-100 transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-300">
              <BsRocketTakeoff className="text-2xl" />
            </div>

            <h3 className="text-3xl font-extrabold text-gray-900">
              A Growing Platform
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Formida is built to scale with your needs — offering trusted
              services, seamless workflows, and modern digital solutions.
            </p>

            <ul className="list-none mt-6 space-y-4">
              <li className="flex items-center">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3 transition-transform duration-300 hover:scale-110 hover:shadow-md hover:shadow-blue-300">
                  <BsFingerprint className="text-lg" />
                </span>
                <h4 className="text-gray-700 font-medium">
                  Carefully crafted components
                </h4>
              </li>

              <li className="flex items-center">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3 transition-transform duration-300 hover:scale-110 hover:shadow-md hover:shadow-blue-300">
                  <AiOutlineHtml5 className="text-lg" />
                </span>
                <h4 className="text-gray-700 font-medium">
                  Seamless user experience
                </h4>
              </li>

              <li className="flex items-center">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3 transition-transform duration-300 hover:scale-110 hover:shadow-md hover:shadow-blue-300">
                  <BiPaperPlane className="text-lg" />
                </span>
                <h4 className="text-gray-700 font-medium">
                  Dynamic & reliable features
                </h4>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facilities;
