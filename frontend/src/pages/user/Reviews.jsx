import React from 'react';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';

// Reviews dashboard/overview for PG/Bike
const Reviews = ({ itemType, itemId }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold mb-4 text-blue-700 text-center">Reviews & Feedback</h2>
        <ReviewForm itemType={itemType} itemId={itemId} />
        <ReviewsList itemType={itemType} itemId={itemId} />
      </div>
    </div>
  );
};

export default Reviews;
