

import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'sonner'


const FaucetStats: React.FC = () => {
  const [toAddress, setToAddress] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const nodeEnv = process.env.NEXT_PUBLIC_PRODUCTION

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToAddress(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleCancel = () => {
    setToAddress('');
    setQuantity('');
  };

  const handleSubmit = async () => {
    if (!toAddress || !quantity) {
      alert('Please enter both address and quantity.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/faucet', { to: toAddress, amount: quantity });

      toast.success('Minted successfully!', {
        position: 'top-right',
        action: {
          label: 'View on Explorer',

          onClick: () => {
            if (typeof window !== 'undefined') {
              window.open(
                `https://${nodeEnv === 'development' ? 'sepolia.arbiscan.io' : 'arbiscan.io'}/tx/${response?.data?.data}`,
                '_blank'
              );
            } else {
              console.log('Window object is not available (server-side)');
            }
          }
        }
      });

    } catch (error) {
      console.error('Error minting:', error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-b from-[#3948e3a4] to-[#0ab4d8a4] py-3 px-2 rounded-[6px]">
      <Toaster />
      <div className="text-white p-2 sm:p-6 w-full space-y-4">
        {/* Balance Section */}
        <div className="text-center pb-4">
          <h2 className="text-left text-[22px] my-2">Faucet</h2>
          <div className="bg-[#181079] rounded-[6px] font-[400] py-2">
            <p className="mt-1 text-[20px]">Total USDC Minted</p>
            <p className="text-[16px] font-bold mt-1">0</p>
          </div>
        </div>

        {/* Mint Section */}
        <div className="space-y-4 bg-[#181079] rounded-[6px] font-[400] py-[31px] px-[16px]">
          <div className="text-[18px] font-[500]">MINT</div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="To Address"
              value={toAddress}
              onChange={handleAddressChange}
              className="py-[10px] bg-[#5743ED] placeholder:text-[14px] placeholder:text-white border border-[#271777] rounded-[6px] px-2"
            />
            <input
              type="number"
              placeholder="Amount"
              value={quantity}
              onChange={handleQuantityChange}
              className="py-[10px] bg-[#5743ED] placeholder:text-[14px] placeholder:text-white border border-[#271777] rounded-[6px] px-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <button
              onClick={handleCancel}
              className="bg-transparent text-[#67E9E9] border border-[#67E9E9] py-2 px-6 rounded-md hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 py-2 px-6 rounded-md text-white font-semibold hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'Minting...' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaucetStats;
