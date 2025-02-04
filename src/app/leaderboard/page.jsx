"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/leaderboard?page=${currentPage}&limit=${usersPerPage}`);
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log('Failed to fetch leaderboard:', error);
        setError(error.response?.data?.error || data?.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentPage]);

  const renderUserAvatar = (user) => {
    return user.imageurl ? (
      <img 
        src={user.imageurl} 
        alt={`${user.name}'s avatar`} 
        className="w-12 h-12 rounded-full object-cover border-2 border-[#39FF14]"
      />
    ) : (
      <div className="w-12 h-12 rounded-full bg-[#39FF14]/20 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gradient text-[#39FF14] p-6 pt-20">
      <div className="max-w-4xl mx-auto bg-black/50 border border-[#39FF14]/30 rounded-lg">
        <div className="p-6 border-b border-[#39FF14]/30 flex items-center space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h2 className="text-2xl font-bold">Global Leaderboard</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-6 animate-pulse">
            Loading leaderboard...
          </div>
        ) : (
            !error
            ?
          <>
            <div className="divide-y divide-[#39FF14]/20">
              {users.map((user, index) => (
                <div 
                  key={user.id} 
                  className="p-4 flex items-center justify-between hover:bg-[#39FF14]/10 transition-colors"
                >
                  <div className="flex items-center space-x-4 cursor-pointer">
                    <span className="text-xl font-bold">
                      {(currentPage - 1) * usersPerPage + index + 1}
                    </span>
                    {renderUserAvatar(user)}
                    <div>
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <p className="text-[#39FF14]/70">@{user.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold">
                      {user.problemsSolved} 
                      <span className="text-sm ml-1">solved</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center py-4 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-[#39FF14]/30 rounded 
                    disabled:opacity-50 disabled:cursor-not-allowed 
                    hover:bg-[#39FF14]/10 transition-colors"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 border border-[#39FF14]/30 rounded
                      ${currentPage === i + 1 
                        ? 'bg-[#39FF14] text-black' 
                        : 'hover:bg-[#39FF14]/10'
                      } transition-colors`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-[#39FF14]/30 rounded 
                    disabled:opacity-50 disabled:cursor-not-allowed 
                    hover:bg-[#39FF14]/10 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
         :
         <div className="text-center py-6">
            <p className="text-red-500 text-lg text-wrap font-bold">
                {error}
            </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;