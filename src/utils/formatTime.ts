const formatTime = (dateString: string, format: string = "hh-mm"): string => {
  const date = new Date(dateString);
  const formatArr = format.split("-");

  let formattedTime = "";
  formatArr.forEach((fmt, idx) => {
    formattedTime += idx > 0 ? ":" : "";

    if (fmt === "hh") {
      formattedTime += date.getUTCHours();
    }

    if (fmt === "mm") {
      const minutes = date.getUTCMinutes();
      formattedTime += minutes < 10 ? "0" + minutes : minutes;
    }
  });

  return formattedTime;
};

export default formatTime;
