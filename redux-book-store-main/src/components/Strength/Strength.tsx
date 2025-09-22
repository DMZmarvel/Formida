import strength from '../../Images/strength.png';
import './Strength.css';
import { AiOutlineCheck } from 'react-icons/ai';

const Strength = () => {
  const items = [
    'Streamlined Workflow',
    'One-Click Customer Management',
    'Automated Service Reminders',
    'Efficient Customer Inspections',
    'Technician Productivity Tracking',
  ];

  return (
    <section className="bg-white w-full py-14">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 px-6">
        {/* Left side: image */}
        <div
          className="w-full lg:w-1/2 flex justify-center"
          data-aos="fade-right"
        >
          <img
            src={strength}
            alt="Formida Strength"
            className="max-w-md w-full object-contain"
          />
        </div>

        {/* Right side: text */}
        <div className="w-full lg:w-1/2" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5 text-gray-900">
            Our <span className="text-blue-600">Strength</span>
          </h2>
          <p className="text-gray-600 mb-6">
            Backed by a dedicated and visionary team, Formida is built on
            innovation and reliability to deliver seamless public notice
            services.
          </p>

          <div className="flex flex-col gap-4">
            {items.map((text, i) => (
              <div key={i} className="line-container flex items-center">
                <div className="check-content">
                  <AiOutlineCheck />
                </div>
                <p className="text-gray-800 font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Strength;
