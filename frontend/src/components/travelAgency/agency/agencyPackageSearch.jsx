import React from "react";

function AgencyPackageSearch({ handleSearchInputChange, handleSortChange, sortOrder }) {
  return (
    <div>
      <section className='flex flex-col border border-green-600 px-5 py-6 text-sm rounded-[30px] bg-white bg-opacity-70 w-[300px]'>
        <div
          className='relative flex justify-center mx-auto bg-green-200 border rounded-xl'
          data-twe-input-wrapper-init
          data-twe-input-group-ref
        >
          <input
            type='search'
            className='peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-green-500 placeholder-opacity-0'
            placeholder='Search'
            aria-label='Search'
            id='exampleFormControlInput'
            aria-describedby='basic-addon1'
            onChange={handleSearchInputChange}
          />
          <label
            htmlFor='exampleFormControlInput'
            className='pointer-events-none rounded-full absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-green-500 '
          >
            Search
          </label>
        </div>

        <h3 className='mt-8 ml-5 text-black'>Sort</h3>
        <div className='flex bg-green-300 font-bold flex-col justify-center mt-4 mx-auto max-w-full whitespace-nowrap  rounded-xl text-black text-opacity-60 w-[200px]'>
          <div
            className={`flex gap-5 justify-between px-7 py-1.5  bg-opacity-30 border-b cursor-pointer ${
              sortOrder === "name" && "text-green-600"
            }`}
            onClick={handleSortChange}
          >
            <span className='my-auto'>Name</span>
            {sortOrder === "asc" ? (
              <img
                src='https://www.svgrepo.com/download/532208/sort-amount-down.svg'
                alt='Sort-Ascending'
                className='w-5 shrink-0 aspect-square'
              />
            ) : (
              <img
                src='https://www.svgrepo.com/download/532213/sort-amount-up.svg'
                alt='Sort-Descending'
                className='w-5 shrink-0 aspect-square'
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AgencyPackageSearch;
