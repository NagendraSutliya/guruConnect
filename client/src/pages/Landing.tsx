import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="bg-[#f8fafc] text-gray-800 px-10">
      {/* ================= NAVBAR ================= */}
      {/* <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="" />
          <img src="./guruconnect-logo.png" className="w-[100px] h-[100px]" /> */}
      {/* <span className="text-xl font-bold">
            <span className="text-orange-500">Guru</span>
            <span className="text-blue-600">Connect</span>
          </span> */}
      {/* </div>

        <Link
          to="/auth/login"
          className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition"
        >
          Login
        </Link>
      </nav> */}

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-10 grid md:grid-cols-2 gap-4 items-center">
        {/* Left */}
        <div>
          <h1 className="text-2xl md:text-5xl font-extrabold leading-tight">
            Anonymous Feedback System for Schools
          </h1>

          <p className="mt-6 text-gray-600 max-w-lg">
            Empower students, parents, and staff to share honest feedback
            anonymously, helping schools improve safely and effectively.
          </p>

          <Link to="/auth/register">
            <button className="mt-8 bg-blue-600 text-white px-7 py-3 rounded-md font-semibold">
              Get Started Now
            </button>
          </Link>

          <p className="mt-3 text-sm text-gray-500">
            Completely anonymous. Instant feedback
          </p>
        </div>

        {/* Right Illustration */}

        <div className="rounded-2xl overflow-hidden">
          <img
            src="./images/landing-page.png"
            alt="Illustration"
            className="w-[600px] object-cover"
          />
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}

      <section className="bg-white py-20">
        <h2 className="text-center text-3xl font-bold mb-14">
          Why Schools Choose GuruConnect
        </h2>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Safe and Confidential",
              desc: "Feedback is anonymous and secure",
              imgSrc: "/images/safe.jpg", // Add image path here
            },
            {
              title: "Easy and Accessible",
              desc: "Quick and intuitive feedback process",
              imgSrc: "/images/easy.jpg",
            },
            {
              title: "Actionable Insights",
              desc: "Gain valuable insights to make improvements",
              imgSrc: "/images/actionable.jpg",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-8 text-center"
            >
              {/* Render the image */}
              {item.imgSrc && (
                <img
                  src={item.imgSrc}
                  alt={item.title}
                  className="w-20 h-20 mx-auto mb-6 object-cover rounded-full"
                />
              )}

              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="mt-3 text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20">
        <h2 className="text-center text-3xl font-bold mb-14">How It Works</h2>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Submit Feedback",
              desc: "Students, parents, and staff submit feedback anonymously.",
            },
            {
              title: "Secure and Private",
              desc: "Feedback is securely collected and kept anonymous.",
            },
            {
              title: "Review and Improve",
              desc: "Schools review feedback and take action.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-8 text-center"
            >
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full mb-6" />
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="mt-3 text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-white py-20">
        <h2 className="text-center text-3xl font-bold mb-14">
          What Our Users Say
        </h2>

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          {[
            {
              name: "Sarah",
              text: "I feel more comfortable sharing my thoughts without worrying about being identified.",
            },
            {
              name: "Mr. Thompson",
              text: "GuruConnect helped us uncover issues we didn’t even know existed.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-6 flex gap-4"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-full" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500 text-sm mt-1">{item.text}</p>
                <p className="text-blue-600 text-sm mt-2">#GuruConnect</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
