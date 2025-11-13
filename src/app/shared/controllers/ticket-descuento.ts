export const descuento = (prices) => {
    let total = 0
    if (prices.length > 1) {
      total = prices.reduce((acc, item) => acc + item.precio, 0)
    } else {
      total = prices[0].precio || 0
    }
    
    if (total >= 50 && total <= 199) {
      return 20
    } else if (total >= 200 && total <= 399) {
      return 30
    } else if (total >= 400) {
      return 50
    } else {
      return 0
    }
  } 