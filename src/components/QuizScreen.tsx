import React, { useState, useEffect } from 'react';

interface Question {
    id: string | number;
    question: string;
    options: string[];
    section?: string;
}

interface Props {
    subject: string;
    questions: Question[];
    onSubmit: (answers: Record<string, string>) => void;
}

export const QuizScreen: React.FC<Props> = ({ subject, questions, onSubmit }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

    const currentQ = questions[currentIndex];

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(answers);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSubmit = (currentAnswers: Record<string, string>) => {
        onSubmit(currentAnswers);
    };

    const handleOptionSelect = (opt: string) => {
        // Save immediately
        setAnswers(prev => ({ ...prev, [currentQ.id]: opt }));
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            handleSubmit(answers);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    if (!currentQ) return <div className="p-10 text-center text-3xl font-black">प्रश्न लोड होत आहेत... 🐢</div>;

    const progress = Math.round((Object.keys(answers).length / questions.length) * 100);
    const selectedOption = answers[currentQ.id] || null;

    // Helper to get status color for navigator
    const getNavStatusClass = (indx: number, qId: string | number) => {
        if (indx === currentIndex) return "bg-black text-white"; // Current
        if (answers[qId]) return "bg-green-400 text-black"; // Answered
        return "bg-white text-black"; // Unanswered
    };

    return (
        <div className="h-screen bg-white p-2 md:p-4 font-mono text-black overflow-hidden flex flex-col">
            {/* HEADER */}
            <div className="max-w-7xl w-full mx-auto border-4 border-black p-2 md:p-3 mb-3 flex justify-between items-center gap-4 shadow-[4px_4px_0px_black] flex-shrink-0 bg-white z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full">
                        <span className="text-xl">🧠</span>
                    </div>
                    <h1 className="text-lg font-black tracking-widest hidden md:block">इयत्ता ६वी परीक्षा</h1>
                </div>

                <div className="flex-1 max-w-xl px-4">
                    <div className="flex justify-between text-[10px] font-bold mb-1 uppercase">
                        <span>प्रगती</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full h-3 border-2 border-black bg-white rounded-full overflow-hidden">
                        <div
                            className="h-full bg-black transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-yellow-300 border-2 border-black px-3 py-1 font-black text-lg shadow-[2px_2px_0px_black]">
                    <span>🕒</span>
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 flex-grow min-h-0">

                {/* LEFT COLUMN: QUESTION */}
                <div className="lg:col-span-3 flex flex-col h-full min-h-0">
                    <div className="border-4 border-black p-4 md:p-6 flex-1 bg-white shadow-[6px_6px_0px_black] relative flex flex-col overflow-y-auto">

                        {/* Question Header */}
                        <div className="flex justify-between items-start mb-4 border-b-2 border-black pb-2 flex-shrink-0">
                            <h2 className="text-lg font-bold uppercase tracking-widest">
                                प्रश्न {currentIndex + 1} / {questions.length}
                            </h2>
                            <div className="bg-black text-white px-2 py-1 font-bold text-xs tracking-widest uppercase">
                                {currentQ.section || "General"}
                            </div>
                        </div>

                        {/* Question Text */}
                        <div className="mb-6 flex-shrink-0">
                            <h3 className="text-xl md:text-2xl font-bold leading-snug">
                                {currentQ.question}
                            </h3>
                        </div>

                        {/* Options */}
                        <div className="space-y-3 mb-4 overflow-y-auto pr-2 custom-scrollbar">
                            {currentQ.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(opt)}
                                    className={`w-full text-left p-3 text-base font-bold border-3 border-black transition-all flex items-center gap-3
                                        ${selectedOption === opt ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}
                                    `}
                                >
                                    <div className={`w-5 h-5 border-2 flex-shrink-0 flex items-center justify-center ${selectedOption === opt ? 'border-white bg-white' : 'border-black'}`}>
                                        {selectedOption === opt && <div className="w-2.5 h-2.5 bg-black"></div>}
                                    </div>
                                    <span>{opt}</span>
                                </button>
                            ))}
                        </div>

                        {/* Footer Controls */}
                        <div className="mt-auto flex justify-between pt-4 border-t-2 border-black flex-shrink-0">
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className={`px-4 py-2 font-bold border-2 border-black shadow-[3px_3px_0px_black] active:translate-y-1 active:shadow-none bg-white uppercase text-sm tracking-widest transition-all ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            >
                                मागील
                            </button>

                            <button
                                onClick={handleNext}
                                className="px-6 py-2 font-bold border-2 border-black shadow-[3px_3px_0px_black] active:translate-y-1 active:shadow-none bg-black text-white hover:bg-gray-800 uppercase text-sm tracking-widest transition-all"
                            >
                                {currentIndex === questions.length - 1 ? 'पूर्ण करा' : 'पुढील'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: NAVIGATOR */}
                <div className="lg:col-span-1 hidden lg:flex flex-col h-full min-h-0">
                    <div className="border-4 border-black p-4 bg-white shadow-[6px_6px_0px_black] h-full overflow-y-auto flex flex-col">
                        <h3 className="text-base font-black uppercase tracking-widest mb-4 border-l-4 border-black pl-2 flex-shrink-0">
                            नेव्हिगेटर
                        </h3>

                        <div className="grid grid-cols-5 gap-2 mb-4 overflow-y-auto content-start flex-grow">
                            {questions.map((q, idx) => (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`aspect-square flex items-center justify-center font-bold border-2 border-black text-xs transition-all hover:opacity-80
                                        ${getNavStatusClass(idx, q.id)}
                                    `}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>

                        <div className="border-t-2 border-black pt-4 space-y-2 text-xs font-bold uppercase tracking-wider flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-green-400 border-2 border-black"></span>
                                <span>उत्तर दिलेले</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-white border-2 border-black"></span>
                                <span>बाकी</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-black border-2 border-black"></span>
                                <span>सध्याचा</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t-2 border-black flex-shrink-0">
                            <h4 className="font-black mb-2 uppercase text-xs">विभाग</h4>
                            <div className="text-xs space-y-1 font-medium">
                                <div className="flex justify-between">
                                    <span>गणित</span>
                                    <span>1-10</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>विज्ञान</span>
                                    <span>11-20</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>समाजशास्त्र</span>
                                    <span>21-30</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
