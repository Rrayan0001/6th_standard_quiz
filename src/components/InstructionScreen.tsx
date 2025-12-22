import React from 'react';

interface Props {
    name: string;
    onProceed: () => void;
}

export const InstructionScreen: React.FC<Props> = ({ name, onProceed }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="neo-box p-8 max-w-2xl w-full bg-white relative">
                <div className="absolute -top-6 -right-6 bg-yellow-300 border-3 border-black p-4 font-black text-xl rotate-12 shadow-[4px_4px_0px_black]">
                    READY?
                </div>

                <h2 className="text-3xl font-black mb-6">📝 Instructions for <span className="text-blue-500">{name}</span></h2>

                <div className="space-y-4 text-lg font-medium mb-8">
                    <div className="flex gap-4 items-center bg-blue-50 p-4 border-2 border-black">
                        <span className="text-4xl">⏱️</span>
                        <p>Time Limit: <b>30 Minutes</b>. The test auto-submits when time ends!</p>
                    </div>
                    <div className="flex gap-4 items-center bg-purple-50 p-4 border-2 border-black">
                        <span className="text-4xl">📚</span>
                        <p>Total: <b>30 Questions</b> (Maths, Science, Social Science).</p>
                    </div>
                    <div className="flex gap-4 items-center bg-green-50 p-4 border-2 border-black">
                        <span className="text-4xl">✅</span>
                        <p>Select the correct answer from 4 options.</p>
                    </div>
                    <div className="flex gap-4 items-center bg-pink-50 p-4 border-2 border-black">
                        <span className="text-4xl">📊</span>
                        <p>Your result will be shown at the end with a special report!</p>
                    </div>
                </div>

                <button
                    onClick={onProceed}
                    className="neo-btn neo-btn-success w-full text-2xl"
                >
                    START TEST 🚀
                </button>
            </div>
        </div>
    );
};
