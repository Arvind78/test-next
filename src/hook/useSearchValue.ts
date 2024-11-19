import React, { useEffect } from 'react'

 

const useSearchValue  = (search:string,time:number) => {
    const [searchValue, setSearchValue] = React.useState(search);
  useEffect(()=>{
   const timmer = setTimeout(() => {
      setSearchValue(search);
    }, time);
    return () => clearTimeout(timmer);
  },[search,time])
  return searchValue
}

export default useSearchValue