"use client"
import React, { useEffect, useState } from 'react'
import { HiDotsHorizontal } from "react-icons/hi";
import greenLine from "@/assets/Green Line.png"
import blueLine from "@/assets/Yellow.png"
import upArrow from "@/assets/uparrow.png"
import plus from "@/assets/Plus.png"
import card from "@/assets/cart.png"
import Image from 'next/image';
import ProgressBar from '../ui/ProgressBar';
import axios from 'axios';
import { useReadContract } from "thirdweb/react";
import  { lpContarct, tvlContract } from '@/thirdweb/contract';

/*
📊 Statistics Component:
- Displays various financial and user metrics in a responsive card layout.
- Consists of four cards, each representing a specific metric:
    1. **Statistics**: Shows the total users registered and daily transactions.
    2. **Total Points Issued**: Displays issued points and progress percentage.
    3. **Total Value Locked (TVL)**: Shows the locked value, with quick action buttons for adding and upgrading.
    4. **LP Tokens Issued**: Displays issued tokens with a progress indicator.
- Each card includes a gradient background, box shadow, and responsive styling.
- Uses Next.js Image component and ProgressBar for optimized images and progress tracking.
*/


const Statistics = ({refresh,setRefresh}) => {
    const [statisticsData, setStatisticsData] = useState<any>({});


 
    useEffect(() => {
        const getStatisticsData = async () => {
            try {
                const res = await axios.get("/api/get-statics");
                setStatisticsData(res.data.data);
                console.log(res.data);
                setRefresh(!refresh); 
            } catch (error) {
                console.error("Error fetching statistics data:", error);
            }
        };
        getStatisticsData();
    },[]);

    const { data } :any= useReadContract({
        contract:lpContarct,
        method: "function totalSupply() view returns (uint256)",
        params: []
      });
    
      const lpToken =(Number(data)/10**18).toFixed(2);

      const { data:tvl, }:any = useReadContract({
        contract:tvlContract,
        method: "function totalUSDCLocked() view returns (uint256)",
        params: []
      });
      const tvlValue =(Number(tvl)/10**6).toFixed(2);
 
    return (
        <div className='h-auto grid grid-cols-1 lg:grid-cols-2 gap-4 '>
            {/* Card 1 */}
            <section className='bg-[#18127A] h-auto sm:h-[220px] p-[24px] w-full rounded-[6px] shadow-md' style={{ boxShadow: "0px 1px 3px 0px #0000001A, 0px 1px 2px -1px #0000001A" }}>
                <div className='flex justify-between items-center'>
                    <span className="font-[600] text-white text-[22px] leading-[30.05px]">Statistics</span>
                    <HiDotsHorizontal size={22} color='white' className='invisible' />
                </div>
                <div className='block sm:flex justify-between items-start mt-[24px]'>
                    <div className='w-[100%]'>
                        <p className='font-[600] text-white text-[19px] leading-[30.05px]'>Total Users registered:</p>
                        <span className='font-[600] text-[#3EE0F7] text-[18px] leading-[30.05px]'>{statisticsData?.totalUsers || '0'}</span>
                        <Image src={greenLine} alt=''  className='w-[100%] sm:w-auto h-[60%] sm:h-auto'/>
                    </div>
                    <div className='w-[100%] mt-4 sm:mt-0'>
                        <p className='font-[600] text-white text-[19px] leading-[30.05px]'>Daily transactions</p>
                        <span className='font-[600] text-[#3EE0F7] text-[18px] leading-[30.05px]'>{statisticsData?.dailyTransactions || '0'}</span>
                        <Image src={blueLine} alt='' className='w-[100%] sm:w-auto h-[60%] sm:h-auto' />
                    </div>
                </div>
            </section>

            {/* Card 2 */}
            <section className='bg-[#18127A] h-[220px] p-[24px] w-full rounded-[6px] shadow-md flex flex-col justify-between' style={{ boxShadow: "0px 1px 3px 0px #0000001A, 0px 1px 2px -1px #0000001A" }}>
                <div className='flex justify-between items-center'>
                    <span className='font-[600] text-white text-[22px] leading-[30.05px]'>Total Points issued</span>
                    <HiDotsHorizontal size={20} color='white' className='invisible' />
                </div>
                <div className='flex justify-start gap-2'>
                    <h2 className='font-[600] text-[#3EE5F8] text-[30px] leading-[30.05px]'>{statisticsData?.totalPoints || 0.00}</h2>
                    <Image src={upArrow} alt='' />
                </div>
                <ProgressBar percentage={57} color={'#E0E6ED'}  />
            </section>

            {/* Card 3 */}
            <section className='bg-[#18127A] h-[220px] p-[24px] w-full rounded-[6px] shadow-md flex flex-col justify-between' style={{
                boxShadow: "0px 1px 3px 0px #0000001A, 0px 1px 2px -1px #0000001A",
                background: "linear-gradient(270deg, #41D1F5 0%, #3948E3 100%)"
            }}>
                <div>
                    <div className='flex justify-between items-center'>
                        <span className='font-[600] text-white text-[22px] leading-[30.05px]'>Total Value Locked (TVL)</span>
                        {/* <span className='font-[600] text-white text-[22px] leading-[30.05px]'></span> */}
                    </div>
                    <div className='flex justify-between items-center mt-2'>
                        
                        <span className='font-[600] text-white text-[30px] mt-8 leading-[30.05px]'>{tvlValue || "00.0" }</span>
                        <span className='bg-[#3948E3] text-[14px] py-2 text-white rounded-lg px-4 font-[600]  invisible'>+2453</span>
                    </div>
                </div>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-4 invisible'>
                        <button>
                            <Image src={plus} alt='' className='h-[40px] w-[40px]' />
                        </button>
                        <button>
                            <Image src={card} alt='' className='h-[40px] w-[40px]' />
                        </button>
                    </div>
                    <button className='bg-[#3948E3] px-5 py-[10px] rounded-lg text-[17px] font-[600] text-white invisible'>Upgrade</button>
                </div>
            </section>

            {/* Card 4 */}
            <section className='h-[220px] p-[24px] w-full rounded-[6px] shadow-md flex flex-col justify-between' style={{
                background: "linear-gradient(270deg, #41D1F5 0%, #3948E3 100%)",
                boxShadow: "0px 1px 3px 0px #0000001A, 0px 1px 2px -1px #0000001A"
            }}>
                <div className='flex justify-between items-center'>
                    <span className='font-[600] text-white text-[22px] leading-[30.05px]'>LP Tokens Issued</span>
                    <HiDotsHorizontal size={20} color='white' className='invisible' />
                </div>
                <div>
                    <h2 className='font-[600] text-[#fff] ml-3 text-[30px] leading-[30.05px]'>{lpToken || 0.00}</h2>
                </div>
                <ProgressBar percentage={57} color={'#18127A'} />
            </section>
        </div>
    )
}

export default Statistics;
