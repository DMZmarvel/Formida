import bannerImg from '../../Images/banner.jpg';

const Banner = () => {
  return (
    <section
      className="relative h-[90vh] w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bannerImg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Welcome to Formida
          </h1>
          <p className="mt-3 text-gray-200 text-lg md:text-xl">
            Your trusted platform for public notices
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/notice"
              className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
            >
              Submit Notice
            </a>
            <a
              href="/status"
              className="inline-block rounded-xl bg-white/90 px-6 py-3 text-gray-900 font-semibold shadow-lg hover:bg-white transition"
            >
              Check Status
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
