import React from "react";
import Slider from "react-slick";

const Section2 = ({ courses, settings }) => {
  return (
    <section className="bg-slate-950 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-10">
          Explore Our Courses
        </h2>

        <Slider {...settings}>
          {courses.map((course) => (
            <div key={course._id} className="px-2 sm:px-3">
              <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 flex flex-col h-full">

                {/* Image */}
                <div className="h-40 sm:h-48 w-full overflow-hidden">
                  <img
                    src={course.image?.url || course.image}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {course.title}
                  </h3>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-indigo-400 font-bold text-base sm:text-lg">
                      ${course.price}
                    </span>

                    <button className="px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm sm:text-base font-semibold transition">
                      Enroll Now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </Slider>

      </div>
    </section>
  );
};

export default Section2;