

/**
 * 📍 navigateSection:
 * Smoothly scrolls to the section of the page identified by the hash
 * in the provided location. Adjusts the scroll position by a specified
 * offset for better visibility.
 *
 * @param location - The current location object from react-router-dom.
 */


export const navigateSection = (location: Location) => {
  if (location.hash) {
    const element = document.getElementById(location.hash.substring(1));
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  }
};

