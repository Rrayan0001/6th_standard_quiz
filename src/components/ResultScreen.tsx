import React, { useState } from 'react';

interface Result {
    score: number;
    total: number;
    answered?: number;
    percentage: number;
    report: string;
}

interface Props {
    result: Result;
    studentName: string;
    onRestart: () => void;
    onReAnalyze?: () => Promise<void>;
}

export const ResultScreen: React.FC<Props> = ({ result, studentName, onRestart, onReAnalyze }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleReAnalyzeClick = async () => {
        if (!onReAnalyze) return;
        setIsAnalyzing(true);
        await onReAnalyze();
        setIsAnalyzing(false);
    };

    const answeredCount = result.answered ?? result.total;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="neo-box p-8 max-w-4xl w-full bg-white text-center">
                <div className="mb-8">
                    <h1 className="text-4xl font-black mb-2">🎉 परीक्षा पूर्ण!</h1>
                    <p className="text-xl">छान प्रयत्न, <span className="text-blue-600 font-bold">{studentName}</span>!</p>
                </div>

                {/* Score Card - 4 columns now */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="neo-box bg-yellow-100 p-4">
                        <div className="text-4xl font-black mb-1">{result.score}</div>
                        <div className="text-sm font-bold uppercase tracking-wide">तुमचे गुण</div>
                    </div>
                    <div className="neo-box bg-pink-100 p-4">
                        <div className="text-4xl font-black mb-1">{result.total}</div>
                        <div className="text-sm font-bold uppercase tracking-wide">एकूण प्रश्न</div>
                    </div>
                    <div className="neo-box bg-purple-100 p-4">
                        <div className="text-4xl font-black mb-1">{answeredCount}</div>
                        <div className="text-sm font-bold uppercase tracking-wide">दिलेले उत्तर</div>
                    </div>
                    <div className="neo-box bg-green-100 p-4">
                        <div className="text-4xl font-black mb-1">{Math.round(result.percentage)}%</div>
                        <div className="text-sm font-bold uppercase tracking-wide">टक्केवारी</div>
                    </div>
                </div>

                {/* AI Report */}
                <div className="neo-box bg-blue-50 p-6 mb-8 text-left border-dashed">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-black flex items-center gap-2">
                            🤖 कामगिरी अहवाल (AI)
                        </h3>
                        {onReAnalyze && (
                            <button
                                onClick={handleReAnalyzeClick}
                                disabled={isAnalyzing}
                                className="text-xs font-bold border-2 border-black px-2 py-1 bg-white hover:bg-gray-100 disabled:opacity-50"
                            >
                                {isAnalyzing ? '🔄 विश्लेषण चालू आहे...' : '🔄 पुन्हा विश्लेषण करा'}
                            </button>
                        )}
                    </div>
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {result.report}
                    </p>
                </div>

                <button
                    onClick={onRestart}
                    className="neo-btn neo-btn-secondary text-xl"
                >
                    🔄 पुन्हा परीक्षा द्या
                </button>
            </div>
        </div>
    );
};
