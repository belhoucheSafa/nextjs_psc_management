import React from 'react'
import './test.scss'
const test = () => {
  return (
    <div className="app-container">
      <div className="toolbar">
        <div className="filters">
          {['Columns', 'Department', 'Site', 'Lifecycle', 'Status', 'Entity'].map((filter) => (
            <button className="filter-btn" key={filter}>{filter} <span>&#9662;</span></button>
          ))}
        </div>
        <div className="actions">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search" />
          </div>
          <button className="icon-btn"><Plus /></button>
          <button className="icon-btn"><SlidersHorizontal /></button>
          <button className="icon-btn"><Download /></button>
        </div>
      </div>
    </div>
  )
}

export default test