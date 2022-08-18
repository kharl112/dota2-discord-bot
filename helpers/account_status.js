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
    if (!status) return "Offline";
    if (!/\d/g.test(status)) return "Offline";

    return status_array[status];
  };

  return { getStatus };
})();
