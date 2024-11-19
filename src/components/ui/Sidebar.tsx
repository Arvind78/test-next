import React, { useEffect, useState } from 'react';
import { FiUsers, FiDollarSign, FiHome, FiMenu, FiLogOut } from 'react-icons/fi';
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GrFormSubtract } from "react-icons/gr";
import { signOut } from "next-auth/react";


const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isDashboardExpanded, setIsDashboardExpanded] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string>('Dashboard');

  const toggleSidebar = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleDrawer = (): void => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };
  

  const handleMenuClick = (menu: string): void => {
    setActiveMenu(menu);
    if (menu === 'Dashboard') {
      setIsDashboardExpanded(!isDashboardExpanded);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const collapsed = window.innerWidth >= 760 && window.innerWidth <= 1260;
      if (collapsed) {
        setIsCollapsed(true);
      }
    }
  }, []);

  return (
    <>
      <button
        onClick={toggleDrawer}
        className="md:hidden text-white p-4 py-[26px] w-[100%] fixed top-0 left-0 z-20 bg-[#2843c9a4]"
      >
        <FiMenu size={26} />
      </button>

      <div className={`fixed mt-10 inset-0 bg-black bg-opacity-50 z-10 md:hidden transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`bg-[#18127A] h-full w-[250px] transition-transform duration-300 transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button
            onClick={toggleDrawer}
            className="absolute top-4 right-4 text-white focus:outline-none"
          >
          </button>
          <SidebarContent
            isCollapsed={false}
            isDashboardExpanded={isDashboardExpanded}
            handleMenuClick={handleMenuClick}
            activeMenu={activeMenu}
            handleLogout={handleLogout}
          />
        </div>
      </div>

      <div className={`hidden md:block py-4 bg-[#18127A] h-[100vh] ${isCollapsed ? 'w-[100px]' : 'w-[410px]'} transition-all duration-300 relative`}>
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white focus:outline-none my-8"
        >
          {isCollapsed ? <MdKeyboardDoubleArrowRight size={26} /> : <MdKeyboardDoubleArrowLeft size={26} />}
        </button>
        <SidebarContent
          isCollapsed={isCollapsed}
          isDashboardExpanded={isDashboardExpanded}
          handleMenuClick={handleMenuClick}
          activeMenu={activeMenu}
          handleLogout={handleLogout}
        />
      </div>
    </>
  );
};

interface SidebarContentProps {
  isCollapsed: boolean;
  isDashboardExpanded: boolean;
  handleMenuClick: (menu: string) => void;
  activeMenu: string;
  handleLogout: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ isCollapsed, isDashboardExpanded, handleMenuClick, activeMenu, handleLogout }) => (
  <div className="py-[66px] sm:py-20 text-white">
    <div className="px-2 sm:px-4 py-2">
      <a
        href='#Statistics'
        onClick={() => handleMenuClick('Dashboard')}
        className={`flex items-center justify-${isCollapsed ? 'center' : ''} w-full text-[15px] sm:text-[18px] py-3 ${isCollapsed ? "pl-2" : "px-2"} ${activeMenu === 'Dashboard' ? 'bg-blue-700 font-[700]' : 'hover:bg-blue-600'} rounded-lg`}
      >
        <FiHome size={24} className="mr-3" />
        {!isCollapsed && <span>Dashboard</span>}
      </a>
      {!isCollapsed && isDashboardExpanded && (
        <div className="ml-8 mt-2">
          <a
            href="#Statistics"
            className={`block py-1 px-2 ${activeMenu === 'Statistics' ? 'bg-blue-700' : ''} rounded text-[15px] sm:text-[18px] flex items-center gap-1`}
          >
            <GrFormSubtract /> Statistics
          </a>
        </div>
      )}
    </div>

    <p className={`nunito px-4 mt-4 sm:mt-5 py-2 sm:py-3 text-gray-400 ${isCollapsed ? 'hidden' : ''} bg-[#373385b2] font-[600] sm:font-[800] text-[14px] sm:text-[18px] text-white`}>ADMIN CONTROLS</p>
    <MenuItem
      icon={<FiUsers size={24} className="mr-3" />}
      label="Users"
      isActive={activeMenu === 'Users'}
      onClick={() => handleMenuClick('Users')}
      isCollapsed={isCollapsed}
    />
    <p className={`nunito px-4 mt-2 sm:mt-5 py-2 sm:py-3 text-gray-400 ${isCollapsed ? 'hidden' : ''} bg-[#373385b2] font-[600] sm:font-[800] text-[15px] sm:text-[18px] text-white`}>BLACK LIST</p>
    <MenuItem
      icon={<FiUsers size={24} className="mr-3" />}
      label="Ban"
      isActive={activeMenu === 'Ban'}
      onClick={() => handleMenuClick('Ban')}
      isCollapsed={isCollapsed}
    />

    <p className={`nunito px-4 mt-2 sm:mt-5 py-2 sm:py-3 text-gray-400 ${isCollapsed ? 'hidden' : ''} bg-[#373385b2] font-[600] sm:font-[800] text-[14px] sm:text-[18px] text-white`}>FAUCET STATS</p>
    <MenuItem
      icon={<FiDollarSign size={24} className="mr-3" />}
      label="Faucet"
      isActive={activeMenu === 'Faucet'}
      onClick={() => handleMenuClick('Faucet')}
      isCollapsed={isCollapsed}
    />
    <p className={`nunito px-4 mt-2 sm:mt-5 py-2 sm:py-3 text-gray-400 ${isCollapsed ? 'hidden' : ''} bg-[#373385b2] font-[600] sm:font-[800] text-[14px] sm:text-[18px] text-white`}>Logout</p>
    <MenuItem
      icon={<FiLogOut size={24} className="mr-3" />}
      label="Logout"
      onClick={handleLogout}
      isCollapsed={isCollapsed}
      isActive={false} // Logout doesn't need to be highlighted as an active menu
    />
  </div>
);

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, isActive, onClick, isCollapsed }) => (
  <div className="px-4 py-2 mt-2">
    <a
      href={`#${label}`}
      onClick={onClick}
      className={`flex items-center justify-${isCollapsed ? 'center' : ''} w-full py-3 transition-all ${isCollapsed ? "pl-2" : "px-2"} ${isActive ? 'bg-blue-700 font-[600]' : 'hover:bg-blue-600'} rounded-lg text-[15px] sm:text-[18px]`}
    >
      {icon}
      {!isCollapsed && <div className="flex justify-between items-center w-[100%]">
        <span>{label}</span>
        <MdKeyboardArrowRight size={22} />
      </div>}
    </a>
  </div>
);

export default Sidebar;
