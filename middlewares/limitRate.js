import rateLimit from 'express-rate-limit'

const apiLimiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error:
        'Demasiadas peticiones desde esta IP, por favor intente nuevamente después de un rato.'
    })
  }
})

export default apiLimiter
