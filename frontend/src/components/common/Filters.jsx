// src/components/Filter.jsx
import React, { useState, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { filtersConfigPG } from "../config/filtersConfig";

const Filter = ({ filters, setFilters }) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchInputRef = useRef(null);

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderFilter = (filter) => {
    switch (filter.type) {
      case "search":
        return (
          <div className="flex-1 relative w-full">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={filter.label}
              value={filters[filter.key] || ""}
              onChange={(e) => handleChange(filter.key, e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-gray-700"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            {filters[filter.key] && (
              <button
                className="absolute right-3 top-3 text-gray-400 hover:text-red-500"
                onClick={() => {
                  handleChange(filter.key, "");
                  setTimeout(() => searchInputRef.current?.focus(), 0);
                }}
              >
                <FaTimes />
              </button>
            )}
          </div>
        );

      case "select":
        return (
          <select
            value={filters[filter.key] || ""}
            onChange={(e) => handleChange(filter.key, e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-gray-700"
          >
            <option value="">{filter.label}</option>
            {filter.options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <div className="flex flex-wrap gap-2">
            {filter.options.map(opt => {
              const selected = (filters[filter.key] || []).includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    let newValue = [...(filters[filter.key] || [])];
                    if (selected) {
                      newValue = newValue.filter(v => v !== opt.value);
                    } else {
                      newValue.push(opt.value);
                    }
                    handleChange(filter.key, newValue);
                  }}
                  className={`px-3 py-2 rounded-full border ${
                    selected ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"
                  } text-sm transition-all`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-full"
          onClick={() => setShowMobileFilters(true)}
        >
          Filters
        </button>
        {filters.search && (
          <div className="flex-1 ml-2">
            <input
              type="text"
              ref={searchInputRef}
              placeholder="Search PGs..."
              value={filters.search || ""}
              onChange={(e) => handleChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-gray-700"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        )}
      </div>

      {/* Mobile Filter Panel */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-3/4 max-w-sm bg-white p-6 overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)}>
                <FaTimes className="text-gray-600 text-xl" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {filtersConfigPG.map(filter => (
                <div key={filter.key}>
                  {renderFilter(filter)}
                </div>
              ))}
            </div>
            <button
              className="mt-6 w-full px-4 py-3 bg-blue-600 text-white rounded-xl"
              onClick={() => setShowMobileFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Desktop Filter Bar */}
      <div className="hidden lg:flex gap-4 mb-6 flex-wrap">
        {filtersConfigPG.map(filter => (
          <div key={filter.key} className="flex-1 min-w-[150px]">
            {renderFilter(filter)}
          </div>
        ))}
      </div>
    </>
  );
};

export default React.memo(Filter);
