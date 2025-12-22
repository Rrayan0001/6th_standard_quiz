import React from 'react';

interface Result {
    score: number;
    total: number;
    percentage: number;
    report: string;
}

interface Props {
    result: Result;
    studentName: string;
    onRestart: () => void;
}

export const ResultScreen: React.FC<Props> = ({ result, studentName, onRestart }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="neo-box p-8 max-w-4xl w-full bg-white text-center">
                <div className="mb-8">
                    <h1 className="text-4xl font-black mb-2">🎉 TEST COMPLETED!</h1>
                    <p className="text-xl">Superb effort, <span className="text-blue-600 font-bold">{studentName}</span>!</p>
                </div>

                {/* Score Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="neo-box bg-yellow-100 p-6">
                        <div className="text-5xl font-black mb-2">{result.score}</div>
                        <div className="font-bold uppercase tracking-wide">Your Score</div>
                    </div>
                    <div className="neo-box bg-pink-100 p-6">
                        <div className="text-5xl font-black mb-2">{result.total}</div>
                        <div className="font-bold uppercase tracking-wide">Total Questions</div>
                    </div>
                    <div className="neo-box bg-green-100 p-6">
                        <div className="text-5xl font-black mb-2">{Math.round(result.percentage)}%</div>
                        <div className="font-bold uppercase tracking-wide">Percentage</div>
                    </div>
                </div>

                {/* AI Report */}
                <div className="neo-box bg-blue-50 p-6 mb-8 text-left border-dashed">
                    <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                        🤖 AI Performance Report
                    </h3>
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {result.report}
                    </p>
                </div>

                <button
                    onClick={onRestart}
                    className="neo-btn neo-btn-secondary text-xl"
                >
                    🔄 TAKE ANOTHER TEST
                </button>
            </div>
        </div>
    );
};
