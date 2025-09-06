import React from 'react';
import './CategoryFilter.css';

const categories = [
  { id: 'all', name: 'Tümü', icon: '🎬' },
  { id: 'music', name: 'Müzik', icon: '🎵' },
  { id: 'gaming', name: 'Oyun', icon: '🎮' },
  { id: 'education', name: 'Eğitim', icon: '📚' },
  { id: 'tech', name: 'Teknoloji', icon: '💻' },
  { id: 'entertainment', name: 'Eğlence', icon: '🎭' },
  { id: 'sports', name: 'Spor', icon: '⚽' },
  { id: 'news', name: 'Haberler', icon: '📰' }
];

const CategoryFilter = ({ selectedCategory, onCategoryChange, loading }) => {
  return (
    <div className="category-filter">
      <div className="category-scroll">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
            disabled={loading}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
