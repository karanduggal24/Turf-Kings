import TurfCard from './TurfCard';

const featuredTurfs = [
  {
    sport: "FOOTBALL",
    sportIcon: "sports_soccer",
    name: "Downtown Arena",
    location: "Central City",
    distance: "1.2km",
    rating: 4.9,
    amenities: ["5v5", "Shower", "Parking"],
    price: 40,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsRbEjcI8o2ybN_auF0pJcTqUcxiPHzS9jQoSJVzoiiqvBBw3nehlGhphg92o2g_AdR4tgZVt74o1-pfhtKjjgcQXELesOGuCACpQ_BX56ls6wWIZEEVgvN9TW8lN_PhbiSTx-Q1z8jWcWhWymfb2NKPWUd_3GO3UT1Lf3LpmBUW_rePvCcavI-vrRzRW_8vTutKkoU4OOY-Cy-zt3kO0DspClK--aVVtnmf-g28CIcb6T1qbyxoYiLz7Xky-DypSFoudtw5OTr78"
  },
  {
    sport: "CRICKET",
    sportIcon: "sports_cricket",
    name: "Strike Zone",
    location: "Westside",
    distance: "3.5km",
    rating: 4.7,
    amenities: ["Box Cricket", "Floodlights"],
    price: 35,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIXWRC6aG5N0wmRkaqKHQlGXAta18V7cS94OFkid4GfhSMFFfMXWmHrwwhf5Z2RZUHH04TMX2EKoeAHaL9mwy5T0W2GE_Vl3IbQTv_SR_8VCTikBE9iUcbSfUXDFQaQMce5io1qdPoGeQgsLeg03FVzLawZkkn6uj4_BMkg8zZNy7OlWU8d5YmjfERN7lqTPuSZ_QoTpDF5gK6Gzk64ql4B-U2ZRWGwcR4J2qp7t4WzCTc3ZiYO9Vjxgwz0_mOqIWfnFVrll5tXMQ"
  },
  {
    sport: "FOOTBALL",
    sportIcon: "sports_soccer",
    name: "Legends Field",
    location: "North Hills",
    distance: "5.0km",
    rating: 4.9,
    amenities: ["7v7", "Locker Room", "Cafe"],
    price: 55,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCeHMZqME3UdgCfEvSe5yyjsB79omUh9ncqn59DFDDd5YbyLrR9MFdJ6Nm3eQSln48_mIwGFaTeDbRmpwSJF8uuKyW44kC96jb0lDK6b7Br1X2Vh-pjEdn16v8Dra7OCxwtRSLuLgf9ft5eIM96C__TJrImY6nYzIjfByTtRl2D8XyBFVhXV0wGKU88rv3qQfYVtpdjpg41G3dXcm0w-Qv_1XsLyKrtqFTRbG4verDiYVqw45k8R902sRGnH1t59tgEjkoKJvgIGI"
  }
];

export default function FeaturedSection() {
  return (
    <section className="py-20 px-4 md:px-10 lg:px-20 max-w-[1440px] mx-auto w-full bg-black">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Featured Turfs</h2>
          <p className="text-gray-400 mt-3 text-lg">Top rated grounds chosen by our community</p>
        </div>
        <a className="text-primary hover:text-white font-medium flex items-center gap-2 transition-colors text-lg" href="#">
          View all turfs
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredTurfs.map((turf, index) => (
          <TurfCard key={index} {...turf} />
        ))}
      </div>
    </section>
  );
}