
const findPublicId = (url: string) => {
  //const url = "https://res.cloudinary.com/dwok2hmb7/image/upload/v1730821531/health-care/y3kfaewg0a66nwg4viec.png";
  //const public_id = 'health-care/dv0gzznxtitu32xbwm6o';

  // Split the URL by slashes(/)
  const parts = url.split("/");
  const public_id = parts[parts.length - 2] + "/" + parts[parts.length - 1];
  return public_id;
};