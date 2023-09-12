let lastOrderNumber = 0;

const generateOrderNumber = () => {

  lastOrderNumber += 1
  return lastOrderNumber
}

module.exports = {generateOrderNumber}
