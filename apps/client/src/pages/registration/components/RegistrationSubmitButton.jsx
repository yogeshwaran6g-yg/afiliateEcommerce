import React from "react";

const RegistrationSubmitButton = ({ loading }) => {
  return (
    <div className="pt-6">
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-5 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-white text-xl font-black rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      </button>
    </div>
  );
};

export default RegistrationSubmitButton;
