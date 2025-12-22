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
                    तयार?
                </div>

                <h2 className="text-3xl font-black mb-6">📝 सूचना - <span className="text-blue-500">{name}</span></h2>

                <div className="space-y-4 text-lg font-medium mb-8">
                    <div className="flex gap-4 items-center bg-blue-50 p-4 border-2 border-black">
                        <span className="text-4xl">⏱️</span>
                        <p>वेळ मर्यादा: <b>३० मिनिटे</b>. वेळ संपल्यावर परीक्षा आपोआप सबमिट होईल!</p>
                    </div>
                    <div className="flex gap-4 items-center bg-purple-50 p-4 border-2 border-black">
                        <span className="text-4xl">📚</span>
                        <p>एकूण: <b>३० प्रश्न</b> (गणित, विज्ञान, समाजशास्त्र).</p>
                    </div>
                    <div className="flex gap-4 items-center bg-green-50 p-4 border-2 border-black">
                        <span className="text-4xl">✅</span>
                        <p>४ पर्यायांमधून योग्य उत्तर निवडा.</p>
                    </div>
                    <div className="flex gap-4 items-center bg-pink-50 p-4 border-2 border-black">
                        <span className="text-4xl">📊</span>
                        <p>शेवटी तुमचा निकाल आणि विशेष अहवाल दिसेल!</p>
                    </div>
                </div>

                <button
                    onClick={onProceed}
                    className="neo-btn neo-btn-success w-full text-2xl"
                >
                    परीक्षा सुरू करा 🚀
                </button>
            </div>
        </div>
    );
};
