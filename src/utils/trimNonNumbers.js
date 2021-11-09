const trimNonNumbers = (text) => {
  return text.toString().replace(/\D/g, '');
};

export default trimNonNumbers;
