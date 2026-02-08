import { FaRegCreditCard } from "react-icons/fa6";
import { LuWallet } from "react-icons/lu";
import { GiReceiveMoney } from "react-icons/gi";
import Link from "next/link";
import HeaderName from "@/components/HeaderName";

const Homepage = () => {
  const dashboard_data = [
    {
      title: "Amount",
      Icon: <LuWallet className="text-4xl text-yellow-400"/>,
      value: 0,
      link: '/amount'
    },
    {
      title: "Fixed Deposit",
      Icon: <GiReceiveMoney className="text-4xl text-rose-700"/>,
      value: 0,
      link: '/fd-amount'
    },
    {
      title: "ATM Cards",
      Icon: <FaRegCreditCard className="text-4xl"/>,
      value: 0,
      link:'/atm-cards'
    }
  ];

  return (
    <>
      <div className="py-4 flex flex-col gap-y-4">
        <HeaderName/>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-3">
          {dashboard_data.map((cur, i) => {
            return <DashboardCard data={cur} key={i} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Homepage;

const DashboardCard = ({ data }) => {
  return (
    <Link href={data.link} className="flex items-center justify-between border py-3 px-10">
      {data.Icon}
      <div className="flex flex-col gap-y-2 justify-end">
        <p className="text-xl font-semibold">{data.title}</p>
        <h1 className="text-2xl font-bold text-end">{data.value}</h1>
      </div>
      </Link>
  );
};
