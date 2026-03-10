"use client";

import React from "react";

const Pagination = ({ page, currentPage, totalPages, onPageChange }) => {
  const activePage = currentPage !== undefined ? currentPage : page;
  if (totalPages <= 1) return null;

  const handleClick = (p) => {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={() => handleClick(activePage - 1)}
        disabled={activePage === 1}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => handleClick(p)}
          className={`px-3 py-1 rounded ${p === activePage ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => handleClick(activePage + 1)}
        disabled={activePage === totalPages}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
