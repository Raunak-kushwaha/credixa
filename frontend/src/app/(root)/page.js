"use client"
import HeaderName from "@/components/HeaderName";
import { useMainContext } from "@/context/MainContext";
import WalletCard from "@/components/WalletCard";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

const Homepage = () => {

  const {user} = useMainContext()


  return (
    <div className="container py-2">
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="flex-1">
          <WalletCard />
        </div>
        <div className="flex-[2]">
          <div className="mt-2">
            <AnalyticsDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
