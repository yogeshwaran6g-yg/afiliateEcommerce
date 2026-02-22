import React from "react";

const RegistrationHeader = () => {
  return (
    <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 rounded-3xl shadow-2xl overflow-hidden mb-8 relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
      <div className="relative p-10 text-center text-white">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
          <span className="material-symbols-outlined text-5xl">person_add</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
          Complete Your Profile
        </h1>
        <p className="text-lg opacity-95 font-medium max-w-2xl mx-auto">
          Join our exclusive network and unlock unlimited earning potential
        </p>
      </div>
    </div>
  );
};

export default RegistrationHeader;
