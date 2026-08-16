import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getCart, addToCart, updateCartItem, removeCartItem } from '../controllers/cartController'

const router = Router()

router.use(authenticate)
router.get('/', getCart)
router.post('/', addToCart)
router.put('/:itemId', updateCartItem)
router.delete('/:itemId', removeCartItem)

export default router
