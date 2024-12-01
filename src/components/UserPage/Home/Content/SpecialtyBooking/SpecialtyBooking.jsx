import { Link } from "react-router-dom";

const SpecialtyBooking = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto py-10">
        <div className="flex justify-between items-center px-4 gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-0">
              Đặt lịch theo Chuyên khoa
            </h2>
            <p className="hidden md:block text-sm">
              Danh sách bác sĩ theo chuyên khoa
            </p>
          </div>
        </div>
        <div className="pt-8 pb-4 mx-4">
          <details className="group flex flex-row flex-wrap mt-10 [&_summary::-webkit-details-marker]:hidden">
            <summary className="grid grid-cols-3 lg:grid-cols-6">
              <div className="col-span-1">
                <Link
                  to="/"
                  className="flex flex-col items-center p-4 font-medium text-center text-xs md:text-sm hover:shadow-[0_10px_70px_#00000026] rounded-xl transition"
                >
                  <div className="rounded-full mb-2 w-16 h-16">
                    <img src="https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Yhoccotruyen.png" />
                  </div>
                  <h3>Y học cổ truyền</h3>
                </Link>
              </div>
            </summary>
          </details>
        </div>
      </div>
    </section>
  );
};

export default SpecialtyBooking;