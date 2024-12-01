import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative site-footer bg-gray-50 py-3">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 md:pt-10">
        <div className="px-4 py-6 text-sm col-span-12 sm:col-span-6 lg:col-span-4 space-y-2">
          <p className="font-semibold">CLINICCARE SGU</p>
          <p>
            <strong>Địa chỉ:</strong> 273 An Dương Vương, Phường 3, Quận 5, Hồ
            Chí Minh
          </p>
          <p>
            <strong>Hotline:</strong>{" "}
            <a href="tel:0976124506" className="font-medium hover:underline">
              0976124506
            </a>{" "}
            (8:00 - 23:00 từ T2 đến T7)
          </p>
        </div>
        <div className="mx-4 lg:mx-0 border-b md:border-0 col-span-12 sm:col-span-6 lg:col-span-2">
          <p className="font-semibold py-6 ">Kết nối với chúng tôi</p>
          <p className="mb-2">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[14px] transition-all w-fit hover:text-blue-500"
            >
              <FaFacebook size={20} />
              Facebook
            </a>
          </p>
          <p className="mb-2">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[14px] transition-all w-fit hover:text-blue-700"
            >
              <FaLinkedin size={20} />
              Linkedin
            </a>
          </p>
          <p className="mb-2">
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[14px] transition-all w-fit hover:text-red-500"
            >
              <FaYoutube size={20} />
              Youtube
            </a>
          </p>
          <p className="mb-2">
            <a
              href="https://zalo.me/pc"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[14px] transition-all w-fit hover:text-blue-400"
            >
              <SiZalo size={20} />
              Zalo
            </a>
          </p>
        </div>
        <div className="mx-4 lg:mx-0 border-b md:border-0 col-span-12 sm:col-span-6 lg:col-span-3">
          <p className="font-semibold py-6 ">Dịch vụ</p>
          <ul className="list-none p-0 block text-sm space-y-2 transition-all">
            <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-73 hover:underline">
              <Link to="/">Đặt khám Bác sĩ</Link>
            </li>
            <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-73 hover:underline">
              <Link to="/">Đặt khám Chhuyên khoa</Link>
            </li>
            <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-73 hover:underline">
              <Link to="/">Tư vấn</Link>
            </li>
          </ul>
        </div>
        <div className="mx-4 lg:mx-0 border-b md:border-0 col-span-12 sm:col-span-6 lg:col-span-3">
          <p className="font-semibold py-6 ">Hỗ trợ</p>
          <ul className="list-none p-0 block text-sm space-y-2 transition-all">
            <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-73 hover:underline">
              <Link to="/">Điều khoản Sử dụng</Link>
            </li>
            <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-73 hover:underline">
              <Link to="/">Điều khoản bảo mật</Link>
            </li>
            <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-73 hover:underline">
              <Link to="/">Chính sách giải quyết khiếu nại</Link>
            </li>
            <li>
              Hỗ trợ khách hàng:{" "}
              <a
                href="mailto:cliniccare.sgu@gmail.com"
                target="_blank"
                className="hover:underline"
              >
                cliniccare.sgu@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl text-xs text-center mx-auto md:border-t border-slate-100 pb-6 pt-24 px-4">
        <p>
          Các thông tin trên ClinicCare chỉ dành cho mục đích tham khảo, tra cứu và
          không thay thế cho việc chẩn đoán hoặc điều trị y khoa.
          <br className="hidden lg:block"></br> Cần tuyệt đối tuân theo hướng
          dẫn của Bác sĩ và Nhân viên y tế.
        </p>
        <p className="mt-1">
          Copyright © 2018 - 2024 Công ty TNHH ClinicCare SGU
        </p>
      </div>
    </footer>
  );
};

export default Footer;
