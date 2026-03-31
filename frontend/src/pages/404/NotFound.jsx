import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () =>
{
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] px-4">
            <div className="relative mb-8">
                <h1 className="text-[12rem] font-bold text-gray-200 leading-none select-none">
                    404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">

                </div>
            </div>

            <div className="text-center">
                <h2 className="text-3xl font-bold text-[#111] mb-3">
                    Oops! Page Not Found
                </h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    It seems you've taken the wrong path.
                    Don't worry, we'll get you back on track.
                </p>

                <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#111] text-white font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </Link>
            </div>
        </div>
    );
};

export default NotFound;