import { useEffect, useState } from 'react';
import './CountOurNumbers.css';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { BiUserCheck } from 'react-icons/bi';
import { BsBriefcase, BsPeople } from 'react-icons/bs';
import { PiPenNibLight } from 'react-icons/pi';
import axios from 'axios';

const CountOurNumbers = () => {
  const [stats, setStats] = useState({
    users: 0,
    notices: 0,
    companies: 0,
    admins: 0,
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/stats`)
      .then((res) => setStats(res.data))
      .catch(() => console.error('Failed to fetch stats'));
  }, []);

  return (
    <div className="count-banner-content">
      <div className="count-banner">
        <div className="count-inside-banner">
          <div className="grid grid-cols-2 gap-7 lg:grid-cols-4">
            {/* Users */}
            <StatBox
              icon={<BiUserCheck />}
              value={stats.users}
              label="Current Users"
            />
            {/* Notices */}
            <StatBox
              icon={<BsBriefcase />}
              value={stats.notices}
              label="Published Notices"
            />
            {/* Companies */}
            <StatBox
              icon={<PiPenNibLight />}
              value={stats.companies}
              label="Companies"
            />
            {/* Admins */}
            <StatBox
              icon={<BsPeople />}
              value={stats.admins}
              label="Team Members"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({
  icon,
  value,
  label,
}: {
  icon: JSX.Element;
  value: number;
  label: string;
}) => (
  <div className="lg:mx-24 text-white flex flex-col justify-center">
    <div className="text-6xl border py-5 mb-2 px-[1.45rem] rounded-full bg-white text-black cursor-text mx-auto transition-all duration-200">
      {icon}
    </div>
    <div className="text-center">
      <CountUp start={0} end={value} duration={3}>
        {({ countUpRef, start }) => (
          <VisibilitySensor onChange={start} delayedCall>
            <span className="text-4xl my-2" ref={countUpRef} />
          </VisibilitySensor>
        )}
      </CountUp>
      <p className="text-2xl my-2 uppercase font-mono">{label}</p>
    </div>
  </div>
);

export default CountOurNumbers;
