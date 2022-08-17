module.exports = (() => {
  const status_array = [
    "Offline",
    "Online",
    "Busy",
    "Away",
    "Snooze",
    "Looking for trade",
    "Looking to play",
  ];

  const getStatus = (status) => {
    if (!status) return "offline";
    if (!/\d/g.test(status)) return "offline";

    return status_array[status];
  };

  return { getStatus };
})();
