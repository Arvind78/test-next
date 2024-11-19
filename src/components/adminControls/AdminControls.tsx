import Image from 'next/image';
import { useEffect, useState } from 'react';
import avatar from "@/assets/avater.png";
import menuIcon from "@/assets/menu.png";
import sidemenuIcon from "@/assets/sidemenu.png";
import searchIcon from "@/assets/search.png";
import { BsThreeDots } from "react-icons/bs";
// import { HiOutlineArrowRight } from 'react-icons/hi';
import ResponsivePaginationComponent from 'react-responsive-pagination';
import SortButton from '../ui/SortButton';
import axios from 'axios';
import useSearchValue from '@/hook/useSearchValue';
import Loader from '../ui/Loader';
import sucessIcon from "@/assets/icons8-success-32.png"
import { useReadContract } from 'thirdweb/react';
import { getContributionContract, wallectContract } from '@/thirdweb/contract';
import usdcIcon from "@/assets/usdc.png"
import { formatDistanceToNow } from 'date-fns';


const sortingFields = ["TVL", "LPToken", "Points"] as string[];

export default function AdminControls({ refresh, setRefresh }) {
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [activeInput, setActiveInput] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersData, setUserData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pointInput, setPointValue] = useState<number>(0);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserAccount, setCurrentUserAccount] = useState<string>("");
  const [sortingValue, setSortingValue] = useState<{ name: string; order: string }>({
    name: "",
    order: ""
  });
  
  const searchTerm = useSearchValue(activeInput, 2000);
  const limit = 10;

  // const [userPoints, setUserPoints] = useState<{ [key: number]: number }>({});

  const handleRowClick = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setActiveRow(index);
  };

  const handleViewClick = (user: any, e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setExpandedUserId(expandedUserId === user?._id ? null : user?._id);
    setCurrentUserAccount(user?.address);
   

  };


  const handleIncrement = async (userId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
        await axios.post(`/api/updatepoint/${userId}`, {
        type: "inc",
        amount: pointInput
      })
      setRefresh(!refresh);
      setPointValue(0)

    } catch (err: any) {
      console.error(err);
      return;
    };
  };


  useEffect(() => {
    const fetchUsersData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/get-all-user', {
          params: {
            pageNo: currentPage,
            limit,
            sortField: sortingValue.name,
            sortType: sortingValue.order,
            searchBar: searchTerm,
            Blocked: false
          }
        });
        setUserData(response.data.data);
        const totalpage = Math.ceil(response.data.total /  limit) || 1;
        setTotalPages(totalpage);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersData();
  }, [currentPage, sortingValue, searchTerm, refresh,]);


  const unBlockedHandler = async (id) => {
    try {
      await axios.put(`/api/blockAndUnblock/${id}`, { type: "block" });
      setRefresh(!refresh)
      setExpandedUserId(null);

    } catch (error) {
      console.error(error);
    }
  }

  const handleInputChange = (userId:string,e: any) => {
    setCurrentUserId(userId);
    setPointValue(Number(e.target.value))
  }


  const { data:wallet,} = useReadContract({
    contract:wallectContract,
    method: "function balanceOf(address account) view returns (uint256)",
    params: [currentUserAccount]
  });
 
  const walletBalance =(Number(wallet)/10**6).toFixed(2);
  
  const { data:contributionData } = useReadContract({
    contract:getContributionContract,
    method: "function getContributions(address _user) view returns ((address token, uint256 amount, uint256 timestamp, uint256 expiry, uint256 duration, bool withdrawn)[])",
    params: [currentUserAccount]
  });
  

  

  return (
    <div className="bg-gradient-to-b from-blue-start to-blue-end py-10 px-[14px] lg:px-[28px] rounded-lg">
      <div className="block sm:flex  justify-between items-center mb-6  gap-20 sm:gap-0">
        <h1 className="text-2xl font-medium text-white ">Admin Controls</h1>
        <div className="flex items-center gap-2 mt-5 sm:mt-0 lg:gap-5">
          <SortButton sortingOptions={sortingFields} setSorting={setSortingValue} />
          <div className="flex space-x-2">
            <button className="bg-blue-500 p-3 rounded hidden lg:block">
              <Image src={sidemenuIcon} alt="sidemenu" />
            </button>
            <button className="bg-blue-500 p-3 rounded hidden lg:block">
              <Image src={menuIcon} alt="menu" />
            </button>
          </div>
          <div className="px-4 py-2 rounded-md bg-[#18127A] text-white flex items-center border border-cyan-300">
            <input
              type="text"
              placeholder="Search Users"
              className="bg-transparent placeholder-white outline-none flex-grow"
              onChange={(e) => setActiveInput(e.target.value)}
            />
            <Image src={searchIcon} alt="search" />
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <div className="bg-blue-900 min-w-[1200px] rounded-lg p-4 text-white">
          <div className="grid grid-cols-5 gap-4 mb-4 text-center font-semibold">
            <span>Users</span>
            <span>TVL</span>
            <span>Invoice</span>
            <span>LP Token</span>
            <span>Points</span>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <Loader />
            </div>
          ) : usersData?.length === 0 ? (
            <div className="flex items-center justify-center h-[400px] text-center">
              <h2 className="text-xl font-semibold text-gray-300">User Not Available</h2>
            </div>
          ) : (

            <>

              <ul className="space-y-2">
                {usersData?.map((user, index) => (
                  <li key={user?.id}>
                    {/* Main Row */}
                    <div
                      className={`grid grid-cols-5 gap-4 text-center items-center p-4 rounded-md cursor-pointer ${activeRow === index ? 'bg-[#5743ED]' : 'hover:bg-[#5743ed34] transition duration-300'}`}
                      onClick={(e) => handleRowClick(index, e)}
                    >
                      <div className="flex items-center space-x-3">
                        <Image src={avatar} alt="avatar" className="h-[40px] w-[40px] rounded-[6px] " />
                        <div>
                          <span className="block font-semibold text-[15px] text-left">
                            {`${user?.address?.slice(0, 6)}...${user?.address?.slice(-5)}`}
                          </span>
                          <div className="text-[11px] text-gray-300 flex gap-2">
                            <span className="hover:text-teal-500 transition duration-300">Edit</span>
                            <span className="hover:text-teal-500 transition duration-300">Delete</span>
                            <span
                              className={`hover:text-teal-500 transition duration-300 ${expandedUserId === user._id ? "text-teal-500" : ""}`}
                              onClick={(e) => handleViewClick(user, e)}
                            >
                              View
                            </span>
                            <span  className="hover:text-teal-500 transition duration-300" onClick={()=>unBlockedHandler(user?._id)}>Ban</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[13px]">{user?.tvl || "N/A"}</span>
                      <span className="text-[13px]">{user?.invoice || "N/A"}</span>
                      <span className="text-[13px]">{user?.lpToken || "N/A"}</span>
                      <div className="flex items-center justify-center space-x-2 gap-4 lg:gap-1">
                        {/* <button
                        >
                          -
                        </button> */}
                        <input
                          className={`${user.id === activeRow ? "bg-[#5741EE]" : user.points <= 0 ? "bg-[#E7515A] px-6" : "bg-[#18127A]"} w-[120px] flex justify-center items-center  text-center rounded-[6px] px-2 text-[12px] font-[500] py-2 outline-none`}
                          value={(currentUserId===user?._id && pointInput ) ? pointInput : user.points}
                          onChange={(e)=>handleInputChange(user?._id,e)}
                           
                        />
                        <button
                          onClick={(e) => handleIncrement(user?._id, e)}
                          className="bg-[#21005D] text-white font-bold text-[20px] h-[26px] w-[26px] flex justify-center items-center rounded-full"
                        >
                          <Image src={sucessIcon} alt='successIcon' />
                        </button>
                      </div>
                    </div>
                    {expandedUserId === user._id && (
                      <div className="mt-2 bg-transparent  rounded-md ">
                        <div className="flex justify-between items-center gap-2 text-sm">
                          {/* Recent Activities */}
                          <div className="bg-[#5741EE] w-[55%] rounded-[6px] shadow-custom-2  flex flex-col  h-[290px] px-[16px] py-[18px]">
                            <div className='flex justify-between items-center'>
                              <h3 className="text-[19px] font-semibold  mb-2 nunito">Recent Activities</h3>
                              <BsThreeDots color="white" size={22} />
                            </div>
                            <ul className="space-y-1 custom-list px-2 py-2 overflow-auto scrollbar-hide">
                              <li className='flex justify-between mt-[9px] mb-[2px]' >
                                <div className='flex items-center gap-2 nunito text-[14px] mb-2  font-[500]'>
                                  {/* <span className='h-[7px] w-[7px] rounded-full bg-[#3EE5F8] hidden'></span> */}
                                  <span>Transaction</span>

                                </div>
                                <span></span>
                              </li>
                              {contributionData?.map((data, index) => (
        <li key={index} className=" py-[6px] mb-[8px] custom-border">
          <div className="flex items-center  gap-2 justify-start nunito text-[13px]  font-[400] mb-2">
            <span className="h-[7px] w-[7px] rounded-full bg-[#3EE5F8]"></span>
           
            <div className='flex justify-between w-full items-center'>
              <p>Amount</p>
              <p> {(Number(data.amount)/10**6).toFixed(2)}</p>
            </div>
           
          </div>

          <div className="flex items-center  gap-2 justify-start nunito text-[13px]  font-[400] mb-2">
            <span className="h-[7px] w-[7px] rounded-full bg-[#3EE5F8]"></span>
           
            <div className='flex justify-between w-full items-center'>
              <p>Duration</p>
              <p> 
                {(Number(data?.duration))}

                </p>
            </div>
           
          </div>

          <div className="flex items-center  gap-2 justify-start nunito text-[13px]  font-[400] mb-2">
            <span className="h-[7px] w-[7px] rounded-full bg-[#3EE5F8]"></span>
           
            <div className='flex justify-between w-full items-center'>
              <p>Expiry</p>
              <p> 
              {formatDistanceToNow(new Date(Number(data?.expiry) * 1000), { addSuffix: true })}

              </p>
            </div>
           
          </div>

          <div className="flex items-center  gap-2 justify-start nunito text-[13px]  font-[400] mb-2">
            <span className="h-[7px] w-[7px] rounded-full bg-[#3EE5F8]"></span>
           
            <div className='flex justify-between w-full items-center'>
              <p>Token</p>
              <p> {data?.token}</p>
            </div>
           
          </div>

          <div className="flex items-center  gap-2 justify-start nunito text-[13px]  font-[400] mb-2">
            <span className="h-[7px] w-[7px] rounded-full bg-[#3EE5F8]"></span>
           
            <div className='flex justify-between w-full items-center '>
              <p>Withdrawn</p>
              <p> {data?.withdrawn ? "withdraw":"locked" }</p>
            </div>
           
          </div>

          <div className="flex items-center  gap-2 justify-start nunito text-[13px]  font-[400] mb-2">
            <span className="h-[7px] w-[7px] rounded-full bg-[#3EE5F8]"></span>
           
            <div className='flex justify-between w-full items-center'>
              <p>Timestamp</p>
              <p> 
              {formatDistanceToNow(new Date(Number(data.timestamp) * 1000), { addSuffix: true })}

              </p>
            </div>
           
          </div>
 
        </li>
      ))}
                            </ul>
                            {/* <button className='cursor-pointer font-[14px] flex justify-center items-center  w-[100%] gap-4'>
                              View All
                              <HiOutlineArrowRight size={24} />
                            </button> */}
                          </div>

                          {/* Wallet Balance */}
                          <div className="bg-[#5741EE] w-[45%] rounded-[6px] shadow-custom-2 h-[290px] px-[16px] py-[18px]">
                            <div className='flex justify-between items-center '>
                              <h3 className="text-[19px] font-semibold mb-2 nunito">Wallet Balance</h3>
                              <span className="text-2xl font-bold nunito flex justify-center items-center gap-1">
                                 <Image src={usdcIcon} className='w-[28px] h-[28px]' alt='usdc'/> {walletBalance || 0.00}</span>
                            </div>
                            <div className='flex justify-center items-center gap-6 mt-2'>
                              <div className=" bg-[#595CED] custom-shadow h-auto w-[220px] py-[10px] px-[19px]  rounded-[8px]">
                                <p className='text-[14px] nunito'>Received:</p>
                                <p className='bg-[#18127A] font-semibold text-[16px] rounded-md py-2 text-center w-full mt-2 nunito'>$97.00</p>
                              </div>
                              <div className=" bg-[#595CED] custom-shadow h-auto w-[220px] rounded-[8px] py-[10px] px-[19px]">
                                <p className='text-[14px] nunito'>Spent:</p>
                                <p className='bg-[#18127A] font-semibold text-[16px] rounded-md py-2 text-center w-full mt-4 nunito'>$53.00</p>
                              </div>
                            </div>
                            <div className="flex justify-between w-fit gap-2 py-1  px-3 rounded-[16px] items-center my-4  bg-[#181079]">
                              <span className='h-[7px] w-[7px] rounded-full bg-[#fff]'></span>
                              <span className="font-[400] text-[12px] nunito">Pending</span>
                            </div>

                            <div className='w-full'>
                              {/* <div className='flex justify-between items-center nunito text-[13px] font-[400] my-2'>
                                <span>USDC</span>
                                <span>$ 13.85</span>
                              </div> */}

                              <div className='flex  mt-4 justify-between items-center nunito text-[13px] font-[400] mb-1'>
                                <span>DeFa LP</span>
                                <span>$ 15.66</span>
                              </div>
                            </div>

                            {/* <div className='flex justify-center items-center w-full gap-12'>
                              <button className='bg-red-600 nunito text-[13px] font-semibold px-6  py-[6px] hover:bg-[#ee2
                            929a1] transition-all ease-in  rounded-[8px]' onClick={() => unBlockedHandler(user?._id)}>Block</button>
                              <button className='bg-[#40D1F6] hover:bg-[#120e44] transition-all ease-in text-[13px] font-semibold nunito px-6  py-[6px] rounded-[8px]'>Pay Now $29.51</button>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Pagination */}
      {usersData.length > 0 &&

        <div className="flex justify-end mt-4">
          <ResponsivePaginationComponent
            current={currentPage}
            total={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      }
    </div>
  );
}
