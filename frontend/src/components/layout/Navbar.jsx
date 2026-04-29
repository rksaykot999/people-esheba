import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import SOSModal from "../ui/SOSModal";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiShield,
  FiAlertTriangle,
  FiDroplet,
  FiHeart,
  FiBriefcase,
  FiUsers,
  FiMap,
  FiSearch,
  FiChevronDown,
  FiGlobe,
  FiBookmark,
  FiPlusSquare,
  FiTruck,
  FiList,
  FiUserPlus,
  FiEdit,
  FiMonitor,
  FiAward,
  FiPlusCircle,
  FiBook,
  FiActivity,
  FiSun,
  FiMoon,
} from "react-icons/fi";

export default function Navbar() {
  const { isAuth, isAdmin, user, logout } = useAuth();
  const { lang, toggleLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);
  const searchRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [userMenu, setUserMenu] = useState(false);
  const [openCat, setOpenCat] = useState(null);

  const isDark = theme === "dark";

  if (location.pathname.startsWith("/admin")) return null;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMobile(false);
    setActiveMenu(null);
    setUserMenu(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setMobile(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (mobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobile]);

  const openDrop = (k) => {
    clearTimeout(timerRef.current);
    setActiveMenu(k);
  };
  const closeDrop = () => {
    timerRef.current = setTimeout(() => setActiveMenu(null), 160);
  };
  const stayDrop = () => clearTimeout(timerRef.current);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false);
      setSearchQ("");
    }
  };

  const MEGA = [
    {
      key: "emergency",
      icon: <FiAlertTriangle size={15} />,
      color: "#E63946",
      label: t("nav.emergency"),
      items: [
        {
          icon: <FiPlusSquare size={16} />,
          label: t("emergency.hospital") || "Hospitals",
          to: "/emergency?type=hospital",
        },
        {
          icon: <FiShield size={16} />,
          label: t("emergency.police") || "Police",
          to: "/emergency?type=police",
        },
        {
          icon: <FiActivity size={16} />,
          label: t("emergency.fire") || "Fire Service",
          to: "/emergency?type=fire",
        },
        {
          icon: <FiTruck size={16} />,
          label: t("emergency.ambulance") || "Ambulance",
          to: "/emergency?type=ambulance",
        },
        {
          icon: <FiList size={16} />,
          label: t("common.viewAll"),
          to: "/emergency",
        },
      ],
    },
    {
      key: "health",
      icon: <FiHeart size={15} />,
      color: "#EC4899",
      label: t("nav.health"),
      items: [
        {
          icon: <FiDroplet size={16} />,
          label: t("nav.blood") || "Blood Donation",
          to: "/blood",
        },
        {
          icon: <FiUser size={16} />,
          label: t("health.doctors") || "Doctors",
          to: "/doctors",
        },
        {
          icon: <FiActivity size={16} />,
          label: t("health.mental") || "Mental Health",
          to: "/health/mental",
        },
        {
          icon: <FiPlusSquare size={16} />,
          label: t("health.pharmacy") || "Pharmacy",
          to: "/health/pharmacy",
        },
        {
          icon: <FiActivity size={16} />,
          label: t("donation.medical") || "Medical Aid",
          to: "/medical-eid?category=medical",
        }, // Donation → MedicalEid
      ],
    },
    {
      key: "jobs",
      icon: <FiBriefcase size={15} />,
      color: "#06B6D4",
      label: t("nav.jobs"),
      items: [
        {
          icon: <FiBriefcase size={16} />,
          label: t("jobs.title") || "Browse Jobs",
          to: "/jobs",
        },
        {
          icon: <FiEdit size={16} />,
          label: t("jobs.post") || "Post a Job",
          to: "/jobs/new",
        },
        {
          icon: <FiMonitor size={16} />,
          label: t("jobs.freelance") || "Freelance",
          to: "/jobs?type=freelance",
        },
        {
          icon: <FiAward size={16} />,
          label: t("jobs.govt") || "Government",
          to: "/jobs?type=govt",
        },
      ],
    },
    {
      key: "education",
      icon: <FiBook size={15} />,
      color: "#F59E0B",
      label: t("nav.education"),
      items: [
        {
          icon: <FiAward size={16} />,
          label: t("education.scholarships") || "Scholarships",
          to: "/education?type=scholarships",
        },
        {
          icon: <FiUsers size={16} />,
          label: t("education.tutors") || "Tutors",
          to: "/education/tutors",
        },
        {
          icon: <FiBook size={16} />,
          label: t("donation.education") || "Education Fund",
          to: "/medical-eid?category=education",
        }, // Donation → MedicalEid
      ],
    },
    {
      key: "community",
      icon: <FiUsers size={15} />,
      color: "#10B981",
      label: t("nav.community"),
      items: [
        {
          icon: <FiUsers size={16} />,
          label: t("volunteers.title") || "Volunteers",
          to: "/volunteers",
        },
        {
          icon: <FiUserPlus size={16} />,
          label: t("volunteers.register") || "Join",
          to: "/volunteers?action=register",
        },
        {
          icon: <FiHeart size={16} />,
          label: t("donation.title") || "All Requests",
          to: "/donation",
        }, // Donation → MedicalEid
        {
          icon: <FiPlusCircle size={16} />,
          label: t("donation.new") || "Request Help",
          to: "/donation/new",
        }, // Donation → MedicalEid
      ],
    },
    {
      key: "services",
      icon: <FiList size={15} />,
      color: "#8B5CF6",
      label: t("nav.services"),
      items: [
        {
          icon: <FiMonitor size={16} />,
          label: t("services.home") || "Home Services",
          to: "/services?cat=home",
        },
        {
          icon: <FiTruck size={16} />,
          label: t("services.transport") || "Transport",
          to: "/services?cat=transport",
        },
        {
          icon: <FiEdit size={16} />,
          label: t("services.repairs") || "Repairs",
          to: "/services?cat=repairs",
        },
      ],
    },
    {
      key: "government",
      icon: <FiShield size={15} />,
      color: "#64748B",
      label: t("nav.government"),
      items: [
        {
          icon: <FiShield size={16} />,
          label: t("government.nid") || "NID Info",
          to: "/govt/nid",
        },
        {
          icon: <FiAward size={16} />,
          label: t("government.schemes") || "Gov Schemes",
          to: "/govt/schemes",
        },
        {
          icon: <FiList size={16} />,
          label: t("government.utility") || "Utility Bill",
          to: "/govt/utility",
        },
      ],
    },
  ];

  const VIEW_PAGES = [
    { icon: <FiActivity size={16} />, label: t("nav.home") || "Home", to: "/" },
    {
      icon: <FiAlertTriangle size={16} />,
      label: t("nav.emergency") || "Emergency",
      to: "/emergency",
    },
    {
      icon: <FiDroplet size={16} />,
      label: t("nav.blood") || "Blood Donation",
      to: "/blood",
    },
    {
      icon: <FiBook size={16} />,
      label: t("nav.education") || "Education",
      to: "/education",
    },
    {
      icon: <FiBriefcase size={16} />,
      label: t("jobs.title") || "Jobs",
      to: "/jobs",
    },
    {
      icon: <FiEdit size={16} />,
      label: t("jobs.post") || "Post a Job",
      to: "/jobs/new",
    },
    {
      icon: <FiHeart size={16} />,
      label: t("donation.title") || "Help Requests",
      to: "/donation/new",
    }, // Donation → MedicalEid
    
    {
      icon: <FiUsers size={16} />,
      label: t("volunteers.title") || "Volunteers",
      to: "/volunteers",
    },
    { icon: <FiMap size={16} />, label: t("nav.map") || "Map", to: "/map" },
    ...(!isAuth
      ? [
          {
            icon: <FiUser size={16} />,
            label: t("nav.login") || "Login",
            to: "/login",
          },
        ]
      : [
          {
            icon: <FiUser size={16} />,
            label: t("nav.profile") || "Profile",
            to: "/profile",
          },
        ]),
    ...(isAdmin
      ? [
          {
            icon: <FiShield size={16} />,
            label: t("nav.admin") || "Admin Panel",
            to: "/admin",
          },
        ]
      : []),
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? "var(--glass-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
          border: scrolled ? "1px solid var(--border-2)" : "none",
          borderTop: "none",
          borderRadius: scrolled ? "0 0 24px 24px" : "0",
          boxShadow: scrolled ? "0 20px 40px -15px rgba(0,0,0,0.1)" : "none",
          margin: scrolled ? "0 auto" : "0",
          width: scrolled ? "calc(100% - 40px)" : "100%",
          maxWidth: scrolled ? "1550px" : "100%",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          overflow: "visible",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: scrolled ? 64 : 80,
            gap: "0.5rem",
            padding: "0 5px",
            overflow: "visible",
          }}
        >
          {/* Logo */}
          <div
            style={{
              flex: "0 0 160px",
              width: 160,
              minWidth: 160,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              overflow: "hidden",
              maxWidth: 220,
            }}
          >
            <Link
              to="/"
              className="nav-logo"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                opacity: 1,
                visibility: "visible",
                transition: "all 0.3s ease",
                width: "100%",
              }}
            >
              <img
                src={isDark ? "/logo-dark.png" : "/Logo.png"}
                alt="People E-Sheba"
                style={{
                  height: 52,
                  width: "100%",
                  maxWidth: 220,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Link>
          </div>

          {/* Mega Nav */}
          <div
            id="mega-nav"
            className="hide-mobile"
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
            }}
          >
            {MEGA.map((cat) => (
              <div
                key={cat.key}
                style={{ position: "relative" }}
                onMouseEnter={() => openDrop(cat.key)}
                onMouseLeave={closeDrop}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "8px 12px",
                    borderRadius: 12,
                    border: "none",
                    cursor: "pointer",
                    background: "transparent",
                    color:
                      activeMenu === cat.key
                        ? "var(--red)"
                        : "var(--text-muted)",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "1rem",
                      opacity: activeMenu === cat.key ? 1 : 0.7,
                    }}
                  >
                    {cat.icon}
                  </span>
                  {cat.label}
                  <FiChevronDown
                    size={11}
                    style={{
                      transition: "transform 0.2s",
                      opacity: 0.5,
                      transform:
                        activeMenu === cat.key ? "rotate(180deg)" : "none",
                      marginLeft: 4,
                    }}
                  />
                  {activeMenu === cat.key && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: -4,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "var(--red)",
                      }}
                    />
                  )}
                </button>
                {activeMenu === cat.key && (
                  <div
                    onMouseEnter={stayDrop}
                    onMouseLeave={closeDrop}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: isDark
                        ? "rgba(15,23,36,0.95)"
                        : "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                      border: "1px solid var(--border-2)",
                      borderRadius: 14,
                      padding: 6,
                      minWidth: 210,
                      zIndex: 999,
                      boxShadow: "var(--shadow-lg)",
                      animation: "dropFadeCenter 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        padding: "7px 12px 7px",
                        marginBottom: 4,
                        borderBottom: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: cat.color,
                        }}
                      >
                        {cat.icon}
                      </span>
                      <span
                        style={{
                          fontSize: "0.73rem",
                          fontWeight: 800,
                          color: "var(--text)",
                        }}
                      >
                        {cat.label}
                      </span>
                    </div>
                    {cat.items.map((item, i) => (
                      <Link
                        key={i}
                        to={item.to}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 12px",
                          borderRadius: 8,
                          textDecoration: "none",
                          color: "var(--text-muted)",
                          fontSize: "0.84rem",
                          fontWeight: 500,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--surface-3)";
                          e.currentTarget.style.color = "var(--text)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "var(--text-muted)";
                        }}
                      >
                        <span
                          style={{
                            width: 22,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "0.95rem",
                          }}
                        >
                          {item.icon}
                        </span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            {/* Search */}
            <button
              id="desktop-search"
              className="hide-mobile"
              onClick={() => setSearchOpen((s) => !s)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--surface-2)",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "var(--t)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text)";
                e.currentTarget.style.borderColor = "var(--border-2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <FiSearch size={14} />
            </button>

            {/* SOS */}
            <button
              onClick={() => setSosOpen(true)}
              className="sos-pulse hide-mobile"
              style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "0 18px",
                borderRadius: 14,
                background: "var(--red)",
                border: "none",
                color: "#fff",
                fontSize: "0.75rem",
                fontWeight: 900,
                cursor: "pointer",
                letterSpacing: "1px",
                boxShadow: "0 8px 20px -6px rgba(230,57,70,0.5)",
              }}
            >
              <FiAlertTriangle size={14} />
              {t("nav.sos") || "SOS"}
            </button>

            {/* Theme toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--surface-2)",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "var(--t)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text)";
                e.currentTarget.style.borderColor = "var(--border-2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              {isDark ? <FiSun size={14} /> : <FiMoon size={14} />}
            </button>

            {/* Language toggle */}
            <button
              id="lang-toggle"
              onClick={toggleLang}
              style={{
                width: 64,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                padding: "0",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--surface-2)",
                color: "var(--text-muted)",
                fontSize: "0.74rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "var(--t)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(230,57,70,0.4)";
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <FiGlobe size={12} />
              {lang === "en" ? "বাংলা" : "EN"}
            </button>

            {/* User menu desktop */}
            <div
              id="user-menu-wrap"
              className="hide-mobile"
              style={{ position: "relative" }}
            >
              {isAuth ? (
                <>
                  <button
                    onClick={() => setUserMenu((s) => !s)}
                    style={{
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "0 10px 0 5px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--surface-2)",
                      color: "var(--text)",
                      cursor: "pointer",
                      transition: "var(--t)",
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "var(--grad-cyan)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        color: "#fff",
                      }}
                    >
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        maxWidth: 72,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user?.name?.split(" ")[0]}
                    </span>
                    <FiChevronDown size={11} style={{ opacity: 0.5 }} />
                  </button>
                  {userMenu && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 7px)",
                        right: 0,
                        background: isDark ? "rgba(15,23,36,0.98)" : "#fff",
                        backdropFilter: "blur(20px)",
                        border: "1px solid var(--border-2)",
                        borderRadius: 12,
                        padding: 6,
                        minWidth: 185,
                        zIndex: 999,
                        boxShadow: "var(--shadow-lg)",
                        animation: "dropFade 0.15s ease",
                      }}
                    >
                      <div
                        style={{
                          padding: "9px 12px 8px",
                          borderBottom: "1px solid var(--border)",
                          marginBottom: 4,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            color: "var(--text)",
                            fontSize: "0.88rem",
                          }}
                        >
                          {user?.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.71rem",
                            color: "var(--text-dim)",
                            marginTop: 2,
                          }}
                        >
                          {user?.email}
                        </div>
                        {user?.role === "admin" && (
                          <span
                            className="badge badge-red"
                            style={{ marginTop: 4, fontSize: "0.62rem" }}
                          >
                            ADMIN
                          </span>
                        )}
                      </div>
                      {[
                        {
                          icon: <FiUser size={13} />,
                          label: t("nav.profile") || "Profile",
                          to: "/profile",
                        },
                        {
                          icon: <FiBookmark size={13} />,
                          label: "Saved Items",
                          to: "/profile?tab=bookmarks",
                        },
                        ...(isAdmin
                          ? [
                              {
                                icon: <FiShield size={13} />,
                                label: t("nav.admin") || "Admin",
                                to: "/admin",
                              },
                            ]
                          : []),
                      ].map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setUserMenu(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                            padding: "8px 12px",
                            borderRadius: 8,
                            textDecoration: "none",
                            color: "var(--text-muted)",
                            fontSize: "0.83rem",
                            fontWeight: 500,
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "var(--surface-3)";
                            e.currentTarget.style.color = "var(--text)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "var(--text-muted)";
                          }}
                        >
                          <span style={{ color: "var(--text-dim)" }}>
                            {item.icon}
                          </span>
                          {item.label}
                        </Link>
                      ))}
                      <div
                        style={{
                          borderTop: "1px solid var(--border)",
                          marginTop: 4,
                          paddingTop: 4,
                        }}
                      >
                        <button
                          onClick={() => {
                            logout();
                            navigate("/");
                            setUserMenu(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: "transparent",
                            border: "none",
                            color: "var(--red)",
                            fontSize: "0.83rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            width: "100%",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "var(--red-light)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <FiLogOut size={13} />
                          {t("nav.logout") || "Logout"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div id="auth-btns" style={{ display: "flex", gap: 6 }}>
                  <Link
                    to="/login"
                    style={{
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 16px",
                      borderRadius: 8,
                      border: "1px solid var(--border-2)",
                      background: "var(--surface-2)",
                      color: "var(--text-muted)",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      transition: "var(--t)",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--text)";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.borderColor = "var(--border-2)";
                    }}
                  >
                    {t("nav.login") || "Login"}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile burger */}
            <button
              id="mobile-burger"
              onClick={() => setMobile((s) => !s)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--surface-2)",
                color: "var(--text)",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {mobile ? <FiX size={17} /> : <FiMenu size={17} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div
            style={{
              padding: "0 1.5rem 1rem",
              animation: "dropFade 0.15s ease",
            }}
          >
            <form
              onSubmit={handleSearch}
              style={{
                display: "flex",
                gap: 8,
                maxWidth: 560,
                margin: "0 auto",
              }}
            >
              <div style={{ flex: 1, position: "relative" }}>
                <FiSearch
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-dim)",
                    pointerEvents: "none",
                  }}
                  size={15}
                />
                <input
                  ref={searchRef}
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder={t("nav.search")}
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">
                {t("common.search")}
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="btn btn-ghost btn-sm"
              >
                <FiX size={14} />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Drawer */}
      {mobile && (
        <>
          <div
            onClick={() => setMobile(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 9998,
              animation: "dropFade 0.3s ease",
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: 400,
              background: isDark ? "var(--bg)" : "#fff",
              zIndex: 9999,
              overflowY: "auto",
              animation:
                "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-10px 0 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.2rem 1.5rem",
                borderBottom: "1px solid var(--border)",
                background: isDark ? "var(--bg)" : "#fff",
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <Link
                to="/"
                onClick={() => setMobile(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <img
                  src={isDark ? "/logo-dark.png" : "/Logo.png"}
                  alt="People E-Sheba"
                  style={{ height: 36, width: "auto" }}
                />
              </Link>
              <button
                onClick={() => setMobile(false)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  background: "var(--surface-2)",
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "var(--t)",
                }}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            <div
              style={{
                padding: "1.5rem",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Search */}
              <form onSubmit={handleSearch} style={{ position: "relative" }}>
                <FiSearch
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-dim)",
                  }}
                  size={16}
                />
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder={t("nav.search")}
                  className="form-input"
                  style={{
                    paddingLeft: 44,
                    paddingRight: 44,
                    height: 52,
                    borderRadius: 26,
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    fontSize: "0.9rem",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: "absolute",
                    right: 6,
                    top: 6,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    background: "var(--grad-red)",
                    border: "none",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-red)",
                  }}
                >
                  <FiSearch size={16} />
                </button>
              </form>

              {/* Pages & Categories */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    background: "var(--surface-2)",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    padding: "1rem",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "0.8rem",
                      letterSpacing: "0.3px",
                      color: "var(--text-dim)",
                      marginBottom: 10,
                      textTransform: "uppercase",
                    }}
                  >
                    Available Pages
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                    }}
                  >
                    {VIEW_PAGES.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobile(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "11px 12px",
                          borderRadius: 12,
                          textDecoration: "none",
                          color: "var(--text-muted)",
                          fontSize: "0.84rem",
                          fontWeight: 600,
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--red)",
                            opacity: 0.85,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {item.icon}
                        </span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {MEGA.map((cat) => {
                  const isOpen = openCat === cat.key;
                  return (
                    <div
                      key={cat.key}
                      style={{
                        background: "var(--surface-2)",
                        borderRadius: 16,
                        border: "1px solid var(--border)",
                        overflow: "hidden",
                        transition: "var(--t)",
                      }}
                    >
                      <button
                        onClick={() => setOpenCat(isOpen ? null : cat.key)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "1rem 1.25rem",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            color: isOpen ? "var(--text)" : "var(--text-muted)",
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: isOpen
                                ? `${cat.color}20`
                                : "var(--surface)",
                              color: isOpen ? cat.color : "var(--text-dim)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "var(--t)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            {cat.icon}
                          </div>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: "0.95rem",
                              letterSpacing: "0.3px",
                            }}
                          >
                            {cat.label}
                          </span>
                        </div>
                        <FiChevronDown
                          size={18}
                          style={{
                            color: "var(--text-dim)",
                            transform: isOpen ? "rotate(180deg)" : "none",
                            transition:
                              "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        />
                      </button>
                      <div
                        style={{
                          maxHeight: isOpen ? "500px" : "0",
                          opacity: isOpen ? 1 : 0,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          padding: isOpen ? "0 1rem 1rem 1rem" : "0 1rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            paddingTop: 4,
                          }}
                        >
                          {cat.items.map((item, i) => (
                            <Link
                              key={i}
                              to={item.to}
                              onClick={() => setMobile(false)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "12px 14px",
                                borderRadius: 12,
                                textDecoration: "none",
                                color: "var(--text-muted)",
                                fontSize: "0.88rem",
                                fontWeight: 600,
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                              }}
                            >
                              <span
                                style={{
                                  color: cat.color,
                                  opacity: 0.8,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {item.icon}
                              </span>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer */}
            <div
              style={{
                padding: "1.5rem",
                borderTop: "1px solid var(--border)",
                background: "var(--surface-2)",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              }}
            >
              {isAuth ? (
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <Link
                    to="/profile"
                    onClick={() => setMobile(false)}
                    style={{
                      height: 48,
                      borderRadius: 14,
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <FiUser size={16} />
                    {t("nav.profile")}
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobile(false)}
                      style={{
                        height: 48,
                        borderRadius: 14,
                        background: "rgba(230,57,70,0.1)",
                        color: "var(--red)",
                        textDecoration: "none",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <FiShield size={16} />
                      {t("nav.admin")}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                      setMobile(false);
                    }}
                    style={{
                      height: 48,
                      borderRadius: 14,
                      background: "var(--grad-red)",
                      border: "none",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: "var(--shadow-red)",
                    }}
                  >
                    <FiLogOut size={16} />
                    {t("nav.logout")}
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <Link
                    to="/login"
                    onClick={() => setMobile(false)}
                    style={{
                      height: 48,
                      borderRadius: 14,
                      border: "1px solid var(--border-2)",
                      background: "var(--surface)",
                      color: "var(--text)",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {t("nav.login")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div style={{ height: 72 }} />
      <SOSModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />

      <style>{`
        .mobile-menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }

        @media(max-width: 480px) {
          .mobile-menu-grid { grid-template-columns: 1fr; }
          .nav-logo .logo-text { display: none; }
        }
        @media(max-width:1200px){
          #mega-nav,#desktop-search,#user-menu-wrap,#auth-btns{ display:none!important; }
          #mobile-burger{ display:flex!important; }
        }
        @keyframes dropFade{ from{opacity:0;transform:translateY(-8px);} to{opacity:1;transform:translateY(0);} }
        @keyframes dropFadeCenter{ from{opacity:0;transform:translate(-50%,-8px);} to{opacity:1;transform:translate(-50%,0);} }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 4px 18px rgba(230,57,70,0.42); }
          50%      { box-shadow: 0 4px 28px rgba(230,57,70,0.72), 0 0 0 4px rgba(230,57,70,0.14); }
        }
        .pulse { animation: pulse-glow 2.2s ease-in-out infinite; }
      `}</style>
    </>
  );
}
