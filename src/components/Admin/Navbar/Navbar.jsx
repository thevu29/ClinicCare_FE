import { Group, Text, ScrollArea, ThemeIcon, Image } from "@mantine/core";
import {
  IconUser,
  IconGauge,
  IconKey,
  IconReportMedical,
  IconDiscountFilled,
  IconVaccine,
  IconMessageDots,
  IconCalendarMonth,
  IconCalendarClock,
  IconCashBanknote,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/Auth/authContext";
import NavbarFooter from "./NavbarFooter";
import LinksGroup from "./NavbarLinksGroup";
import classes from "./Navbar.module.scss";
import logoImage from "../../../assets/images/logo.png";
import clsx from "clsx";

const mockdata = [
  { label: "Dashboard", icon: IconGauge, link: "/admin/dashboard" },
  { label: "Roles", icon: IconKey, link: "/admin/roles" },
  {
    label: "Users",
    icon: IconUser,
    links: [
      { label: "Users", link: "/admin/users" },
      { label: "Doctors", link: "/admin/doctors" },
    ],
  },
  {
    label: "Medical Records",
    icon: IconReportMedical,
    link: "/admin/medical-records",
  },
  { label: "Promotions", icon: IconDiscountFilled, link: "/admin/promotions" },
  { label: "Services", icon: IconVaccine, link: "/admin/services" },
  { label: "Feedbacks", icon: IconMessageDots, link: "/admin/feedbacks" },
  { label: "Schedules", icon: IconCalendarMonth, link: "/admin/schedules" },
  {
    label: "Appointments",
    icon: IconCalendarClock,
    link: "/admin/appointments",
  },
  { label: "Payments", icon: IconCashBanknote, link: "/admin/payments" },
];

const adminPermitted = [
  "Dashboard",
  "Roles",
  "Users",
  "Medical Records",
  "Promotions",
  "Services",
  "Feedbacks",
  "Schedules",
  "Appointments",
  "Payments",
];

const doctorPermitted = [
  "Medical Records",
  "Feedbacks",
  "Schedules",
  "Appointments",
];

const Navbar = ({ isCollapsed }) => {
  const { token } = useAuth();

  const permittedLinks = (role) => {
    if (role === "admin") {
      return adminPermitted;
    } else if (role === "doctor") {
      return doctorPermitted;
    }
    return [];
  };

  const userPermittedLinks = permittedLinks(token?.role.toLowerCase());

  const filteredLinks = mockdata.filter((item) =>
    userPermittedLinks.includes(item.label)
  );

  const links = filteredLinks.map((item) => (
    <LinksGroup {...item} isCollapsed={isCollapsed} key={item.label} />
  ));

  return (
    <nav
      className={clsx(
        classes.navbar,
        "transition-all duration-300",
        isCollapsed ? "w-[65px]" : "w-[300px]"
      )}
    >
      <div className={classes.header}>
        <Link to="/admin">
          <Group wrap="no">
            <ThemeIcon variant="white" radius="xl">
              <Image w="auto" fit="contain" src={logoImage} />
            </ThemeIcon>
            {!isCollapsed && (
              <Text
                size="xl"
                fw={900}
                className={clsx(
                  classes.logoText,
                  isCollapsed ? classes.collapsed : classes.expanded
                )}
              >
                ClinicCare
              </Text>
            )}
          </Group>
        </Link>
      </div>

      <ScrollArea className={classes.links}>
        <div className={`${classes.linksInner} overflow-x-hidden`}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <NavbarFooter isCollapsed={isCollapsed} />
      </div>
    </nav>
  );
};

export default Navbar;
