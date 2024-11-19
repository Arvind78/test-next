import { useState } from 'react';
import { BsSortUp, BsCheck } from 'react-icons/bs';
import { FaSort } from 'react-icons/fa';

type IState = {
  sortingOptions: string[];
  setSorting: any;
};

function SortButton({ sortingOptions, setSorting }: IState) {
  const [popover, setPopover] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<'ASC' | 'DES' | null>(null);

  const handleSortClick = (field: string, order: 'ASC' | 'DES') => {
    console.log(field, order)
    setSorting({
      name: field,
      order: order
    });
    
    setPopover(false);
    setSelectedOption(field);
    setSelectedOrder(order);
  };

  const toggleSubOptions = (option: string) => {
    setSelectedOption(prev => (prev === option ? null : option));
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setPopover(!popover)}
        className="bg-blue-700 flex items-center gap-3 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-md"
      >
        <BsSortUp size={22} /> Sort
      </button>

      {popover && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#08053af1] border border-gray-300 rounded-md shadow-lg p-4">
          {sortingOptions.map((option, index) => (
            <div key={`${option}-${index}`} className="py-1">
              <div
                onClick={() => toggleSubOptions(option)}
                className="font-semibold cursor-pointer text-white hover:text-blue-600  nunito flex items-center justify-start gap-2"
              >
                <FaSort size={14} />
                {option}
              </div>
              {selectedOption === option && (
                <div className="pl-4">
                  <div
                    onClick={() => handleSortClick(option, 'ASC')}
                    className="cursor-pointer text-blue-600 nunito flex items-center gap-2"
                  >
                    Low to High
                    {selectedOption === option && selectedOrder === 'ASC' && <BsCheck size={16} />}
                  </div>
                  <div
                    onClick={() => handleSortClick(option, 'DES')}
                    className="cursor-pointer text-blue-600 nunito flex items-center gap-2"
                  >
                    High to Low
                    {selectedOption === option && selectedOrder === 'DES' && <BsCheck size={16} />}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SortButton;
