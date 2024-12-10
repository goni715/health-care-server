"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findPublicId = (url) => {
    //const url = "https://res.cloudinary.com/dwok2hmb7/image/upload/v1730821531/health-care/y3kfaewg0a66nwg4viec.png";
    //const public_id = 'health-care/dv0gzznxtitu32xbwm6o';
    // Split the URL by slashes(/)
    const parts = url.split("/");
    //split the lart parts by dot(.)
    const lastPart = (parts[parts.length - 1]).split('.')[0];
    const public_id = parts[parts.length - 2] + "/" + lastPart;
    return public_id;
};
exports.default = findPublicId;
