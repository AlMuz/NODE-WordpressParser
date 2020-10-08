module.exports = {
  isValidUrl: (string) => {
    console.log('is valid');
    try {
      console.log(new URL(string));
    } catch (_) {
      return false
    }

    return true
  },
}
