import React, { useState } from 'react';

interface Props {
    onStart: (name: string, rollNo: string) => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
    const [name, setName] = useState('');
    const [rollNo, setRollNo] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && rollNo) {
            onStart(name, rollNo);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="neo-box p-8 max-w-md w-full bg-white text-center">
                <h1 className="text-4xl font-extrabold mb-2" style={{ color: 'var(--color-secondary)' }}>
                    🎓 विद्यार्थी परीक्षा
                </h1>
                <p className="text-xl mb-6 font-bold">इयत्ता ६वी - मराठी माध्यम</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                        <label className="block font-bold mb-1">विद्यार्थ्याचे नाव</label>
                        <input
                            type="text"
                            className="w-full p-3 border-3 border-black font-bold focus:outline-none focus:ring-4 ring-yellow-300"
                            placeholder="तुमचे नाव लिहा"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="text-left">
                        <label className="block font-bold mb-1">रोल नंबर</label>
                        <input
                            type="text"
                            className="w-full p-3 border-3 border-black font-bold focus:outline-none focus:ring-4 ring-pink-300"
                            placeholder="उदा: 24"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="neo-btn neo-btn-primary w-full text-xl mt-6"
                    >
                        पुढे जा ➜
                    </button>
                </form>
            </div>
        </div>
    );
};
