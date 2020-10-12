module.exports = (fn) => {
  return () => {
    fn().catch((error) => {
      console.log('This is an error of the WebSocket Set Timeout interval\n', error);
    });
  };
};
