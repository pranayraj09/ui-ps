const imageLoader = (imageContext, filename) => {
    try {
      return imageContext(`./${filename}.webp`);
    } catch (webpError) {
      try {
        return imageContext(`./${filename}.jpeg`);
      } catch (jpegError) {
        console.error(`Could not find image: ./${filename}`);
        return ''; // Fallback image path ?
      }
    }
  };
  
  export default imageLoader;
  