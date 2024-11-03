// Custom validation function for capitalized format
const capitalizeValidator = (value: string) => {
    const formattedValue = value
      .split(" ") // Split the string into an array of words
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize first letter and make the rest lowercase
      )
      .join(" ");
    if (value !== formattedValue) {
      return false;
    }
    return true;
};

export default capitalizeValidator;
  