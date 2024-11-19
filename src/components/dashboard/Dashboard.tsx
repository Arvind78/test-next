"use client"

import { navigateSection } from "@/utils/navigateSection";
import AdminControls from "../adminControls/AdminControls";
import BlackListUsers from "../blackListUsers/BlackListUsers";
import FaucetStats from "../faucetStats/FaucetStats";
import Statistics from "../statistics/Statistics";
import Sidebar from "../ui/Sidebar";
import { useEffect, useState } from "react";


/**
 * 🚀 Dashboard Component
 * 
 * The Dashboard serves as the main interface for administrators, featuring:
 * - A **Sidebar** for easy navigation between sections.
 * - A **Statistics** section that displays various metrics and analytics.
 * - An **Admin Controls** section for managing users and settings.
 * - A **BlackList Users** section to view and manage banned users.
 * - A **Faucet Stats** section showing balance and other relevant financial metrics.
 * 
 * The component uses the `navigateSection` utility to handle navigation based on the current location.
 */

export default function Dashboard() {
  const [location, setLocation] = useState<any>("");
  const [refresh,setRefresh] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocation(window.location.href); 
    }
    navigateSection(location);
  }, [location]);

  return (
    <div id='dashboard' className="flex w-full sticky top-0">
      <Sidebar />
      <main className="w-full bg-admin-lg bg-cover bg-no-repeat h-[100vh] overflow-x-auto  isResponsiveConatiner ">
        <section id="Statistics" className="section-target">
          <Statistics refresh={refresh} setRefresh={setRefresh} />
        </section>

        <section id="Users" className="section-target">
          <AdminControls  refresh={refresh} setRefresh={setRefresh}/>
        </section>

        <section id="Ban" className="section-target">
          <BlackListUsers refresh={refresh} setRefresh={setRefresh} />
        </section>

        <section id="Faucet" className="mb-[60px] section-target">
          <FaucetStats  />
        </section>
      </main>
    </div>
  );
}


