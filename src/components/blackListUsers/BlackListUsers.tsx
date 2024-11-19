import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import avater from "@/assets/avater.png";
import menuIcon from "@/assets/menu.png";
import sidemenuIcon from "@/assets/sidemenu.png";
import searchIcom from "@/assets/search.png";
import ResponsivePaginationComponent from 'react-responsive-pagination';
import SortButton from '../ui/SortButton';
import axios from 'axios';
import useSearchValue from '@/hook/useSearchValue';
import Loader from '../ui/Loader';

const sortingFields = ["IP", "Points"];

const BlackListUsers = ({ refresh, setRefresh }) => {
  const [activeUser, setActiveUser] = useState(1);
  const [activeInput, setActiveInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [sortingValue, setSortingValue] = useState({ name: "", order: "" });
  const searchTerm = useSearchValue(activeInput, 2000);
  const limit = 10;


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
            isBlocked: true
          }
        });
        setUserData(response.data.data);
        const totalpage = Math.floor(response.data.total / limit) || 1;
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
      await axios.put(`/api/blockAndUnblock/${id}`, { type: "unblock" });
      setRefresh(!refresh);
    } catch (error) {
      console.error(error);
    }
  }


  const deleteHandler = async (id) => {
    try {
      await axios.delete(`/api/deleteUser/${id}`);
    } catch (error) {
      console.error(error);
    }
    setRefresh(!refresh);

  }



  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(57, 72, 227, 0.65) 0%, rgba(10, 180, 216, 0.65) 100%)",
      }}
      className="text-white rounded-[12px]"
    >
      <div className="px-[16px] lg:px-[29px] py-[50px]">
        <div className="block sm:flex justify-between items-center mb-6">
          <h1 className="text-[22px] leading-[30px] font-[400]">Black list Users</h1>
          <div className="flex items-center gap-2 lg:gap-5 mt-4 sm:mt-0">
            <SortButton sortingOptions={sortingFields} setSorting={setSortingValue} />

            <div className="flex space-x-2">
              <button className="bg-blue-500 p-3 rounded hidden lg:block">
                <Image src={sidemenuIcon} alt="sidemenu" />
              </button>
              <button className="bg-blue-500 p-3 rounded hidden lg:block">
                <Image src={menuIcon} alt="menu" />
              </button>
            </div>
            <div className="px-4 py-[10px] rounded-[6px] bg-[#18127A] text-white flex items-center border border-cyan-300">
              <input
                type="text"
                placeholder="Search Users"
                className="bg-transparent placeholder-white outline-none flex-grow"
                onChange={(e) => setActiveInput(e.target.value)}
              />
              <Image src={searchIcom} alt="search" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto ">
          <table className=" w-[1200px] lg:w-[100%] min-w-full bg-[#181079] rounded-lg">
            <thead>
              <tr className="text-left text-white font-[400] text-[16px]">
                <th className="px-4 py-4">Name</th>
                <th className="w-[280px] ">Email</th>
                <th className="w-[180px]">IP</th>
                <th className="w-[180px]">Points</th>
                <th className="w-[300px] px-8">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 h-[400px]">
                    <Loader />
                  </td>
                </tr>
              ) : usersData?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 h-[400px]">
                    <h2 className="text-xl font-semibold text-gray-300">User Not Available</h2>
                  </td>
                </tr>
              ) : (
                usersData?.map((user: any, index: number) => (
                  <tr
                    onClick={() => setActiveUser(index)}
                    key={index}
                    className={`${index === activeUser ? "bg-[#5743ED]" : ""} cursor-pointer hover:bg-[#5743ed5d] transition duration-300`}
                  >
                    <td className="p-4 flex items-center space-x-4">
                      <Image src={avater} alt="Profile" className="w-[40px] h-[40px] rounded-[6px]" />
                      <span className="block font-semibold text-[15px]">
                        {`${user?.address?.slice(0, 6)}...${user?.address?.slice(-5)}`}
                      </span>
                    </td>
                    <td className="text-[14px]">{user?.email}</td>
                    <td className='text-[13px] w-[180px]'>{user?.ip || "2339930"}</td>
                    <td className="w-[160px]">
                      <span className="bg-red-500 text-white text-[12px] px-6 py-[6px] rounded">{user?.points}</span>
                    </td>
                    <td>
                      <button className="text-[13px] border border-[#3EE5F8] px-6 py-2 ml-8 rounded-[6px] hover:bg-indigo-500 hover:text-[#33dde9] transition duration-300 ease-in-out" onClick={() => unBlockedHandler(user?._id)}>
                        Unblock
                      </button>
                      <button className="text-[13px] border border-[#3EE5F8] px-5 py-2 ml-2 rounded-[6px] hover:bg-indigo-500 hover:text-[#33dde9] transition duration-300 ease-in-out" onClick={() => deleteHandler(user?._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className='flex justify-end items-center mt-6'>
          {usersData.length > 0 && (
            <div className='w-auto sm:w-auto lg:w-[500px] flex justify-end items-center'>
              <ResponsivePaginationComponent
                current={currentPage}
                total={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlackListUsers;
