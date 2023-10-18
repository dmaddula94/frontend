const MAP_KEY = process.env.MAP_KEY || "AIzaSyCm8tykVzUw05yjP4qfvO9Qx69VH6miAAw";

export const getLocationCords = () => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      }, reject);
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};

export const getLocation = async (coordinates) => {
  if (!coordinates) {
    coordinates = await getLocationCords();
  }
  const { latitude, longitude } = coordinates;

  return new Promise(async (resolve, reject) => {
    const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAP_KEY}`;

    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.status === "OK") {
      if (data.results && data.results.length > 0) {
        // Return the formatted address of the first result
        resolve({
          latitude,
          longitude,
          name: data.results[0].formatted_address?.split(",")[data.results[0].formatted_address?.split.length - 1].trim()
        });
      }
    } else {
      reject(new Error(data.error_message || "Failed to fetch location name"));
    }
  });
};
