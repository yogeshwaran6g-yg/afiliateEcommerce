import React from 'react';

export default function ProofUploadSection({ proofPreview, handleProofChange, removeProof, errors }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold shadow-lg shadow-primary/20">4</div>
                <h2 className="text-2xl font-black text-slate-900">Upload Payment Proof</h2>
            </div>
            <div className="max-w-lg mx-auto">
                <div className={`mt-1 flex justify-center border-3 ${errors.proof ? 'border-red-300' : 'border-slate-300'} border-dashed rounded-3xl hover:border-primary transition-all relative overflow-hidden group bg-gradient-to-br from-slate-50/50 to-transparent hover:shadow-lg`}>
                    <div className="space-y-3 text-center w-full">
                        {proofPreview ? (
                            <div className="p-8">
                                <div className="relative inline-block animate-in zoom-in duration-300">
                                    <img src={proofPreview} alt="Proof" className="mx-auto h-56 w-auto rounded-2xl shadow-2xl border-4 border-white" />
                                    <button 
                                        type="button" 
                                        onClick={removeProof} 
                                        className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full p-2 shadow-xl hover:scale-110 transition-transform z-10"
                                    >
                                        <span className="material-symbols-outlined text-lg">close</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="cursor-pointer flex flex-col items-center justify-center w-full px-8 py-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                    <span className="material-symbols-outlined text-primary text-5xl">cloud_upload</span>
                                </div>
                                <span className="text-base font-black text-slate-900 mb-1">Upload Payment Screenshot</span>
                                <span className="text-sm text-slate-600 mb-3">Drag and drop or click to browse</span>
                                <span className="text-xs text-slate-500 bg-slate-100 px-4 py-2 rounded-full font-medium">JPG, JPEG, PNG • Max 2MB</span>
                                <input type="file" required name="proof" className="sr-only" onChange={handleProofChange} accept=".jpg,.jpeg,.png,image/jpeg,image/png" />
                            </label>
                        )}
                    </div>
                </div>
                {errors.proof && <p className="text-sm text-red-500 font-bold text-center mt-3">{errors.proof}</p>}
            </div>
        </div>
    );
}
