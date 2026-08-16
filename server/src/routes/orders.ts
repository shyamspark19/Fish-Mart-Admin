import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../controllers/orderController'
import { authorizeRoles } from '../middleware/roles'

const router = Router()

router.use(authenticate)
router.post('/', createOrder)
router.get('/', getOrders)
router.get('/:id', getOrderById)
router.put('/:id/status', authorizeRoles('ADMIN'), updateOrderStatus)

export default router
