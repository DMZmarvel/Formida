import './CorporateClient.css';
import guardian from '../../Images/companies/guardian.png';
import punch from '../../Images/companies/punch.png';
import vanguard from '../../Images/companies/vanguard.png';
import channels from '../../Images/companies/channels.png';
import dailytrust from '../../Images/companies/dailytrust.png';
import thisday from '../../Images/companies/thisday.png';
import leadership from '../../Images/companies/leadership.png';
import thenation from '../../Images/companies/thenation.png';
import sun from '../../Images/companies/sun.png';
import tribune from '../../Images/companies/tribune.png';

import 'swiper/css';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

const CorporateClient = () => {
  const logos = [
    guardian,
    punch,
    vanguard,
    channels,
    dailytrust,
    thisday,
    leadership,
    thenation,
    sun,
    tribune,
  ];

  return (
    <div className="installation-content mt-40 mb-20">
      <div className="text-center mt-10 mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-5 text-gray-900">
          Corporate <span className="text-blue-600">Clientele</span>
        </h2>
      </div>

      <div className="companies mt-10 mb-10">
        <Swiper
          slidesPerView={4}
          spaceBetween={20}
          loop={true}
          className="mySwiper"
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 }, // 🔹 1 per slide on mobile
            640: { slidesPerView: 2, spaceBetween: 15 }, // 🔹 2 per slide on tablets
            1024: { slidesPerView: 5, spaceBetween: 20 }, // 🔹 5 per slide on desktop
          }}
        >
          {logos.map((logo, i) => (
            <SwiperSlide key={i}>
              <div className="client-logo">
                <img src={logo} alt={`Client ${i}`} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CorporateClient;
