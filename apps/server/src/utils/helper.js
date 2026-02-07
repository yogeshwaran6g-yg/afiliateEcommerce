export const rtnRes = (res, code, msg = null, data = null) => {
  try {
    if (!res || !code) {
      throw new Error("Missing arguments to return a response");
    }

    const responses = {
      200: { success: true, defaultMsg: "OK" },
      201: { success: true, defaultMsg: "Created" },
      400: { success: false, defaultMsg: "Bad Request" },
      401: { success: false, defaultMsg: "Unauthorized" },
      404: { success: false, defaultMsg: "Not Found" },
      500: { success: false, defaultMsg: "Internal Server Error" },
    };

    const response = responses[code] || responses[500];

    return res.status(code).json({
      success: response.success,
      message: msg || response.defaultMsg,
      ...(data && { data }),
    });
  } catch (err) {
    console.log("===============================CAUTION================================");
    console.error("Error from rtnRes:", err.message);
    return res.status(500).json({
      success: false,
      message: "Response handler failed",
    });
  }
};

const COLORS = {
  info: "\x1b[36m",     // cyan
  success: "\x1b[32m",  // green
  warn: "\x1b[33m",     // yellow
  error: "\x1b[31m",    // red
  debug: "\x1b[35m",    // magenta
  reset: "\x1b[0m",
};

export const log = (msg, level = "info", data = null) => {
  if (process.env.ENABLE_LOGS === "false") return;

  const safeLevel = COLORS[level] ? level : "info";
  const method =
    safeLevel === "error"
      ? "error"
      : safeLevel === "warn"
      ? "warn"
      : "log";

  const timestamp = new Date().toISOString();
  const color = COLORS[safeLevel];
  const reset = COLORS.reset;

  console[method](
    `${color}[${safeLevel.toUpperCase()}]${reset} ${timestamp} - ${msg}`,
    data ? { data } : ""
  );
};
