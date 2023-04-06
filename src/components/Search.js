import React from "react";

const Search = () => {
  return (
    <>
      <div className="flex justify-start">
        <div className="mt-1  p-2 w-full md:w-1/4">
          <input
            type="search"
            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-500 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-50 outline-none transition duration-300 ease-in-out focus:border-primary-300 focus:text-gray-50 shadow-te-primary outline-none dark:placeholder:text-gray-50 "
            id="exampleSearch"
            placeholder="Find a user"
          />
        </div>
      </div>
    </>
  );
};

export default Search;

